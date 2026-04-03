# Implementation Plan: PPP TV AI Rewriter Pivot

## Overview

Migrate the Cloudflare Worker from KV-backed RSS aggregation to a Supabase-backed AI journalist pipeline using Gemini. Update the Next.js frontend to reflect the Entertainment/Sports/Technology pivot. Harden both layers with security headers and rate limiting.

## Tasks

- [x] 1. Create Supabase schema and configure environment variables
  - Run the SQL schema in Supabase dashboard to create the `articles` table with all columns, indexes, and the `fts` generated column for full-text search
  - Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` to Cloudflare Worker secrets via `wrangler secret put`
  - Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` to Vercel environment variables (not needed by frontend directly, but needed if any server-side route calls Supabase)
  - Add `GEMINI_API_KEY` to Cloudflare Worker secrets via `wrangler secret put`
  - Update `wrangler.toml` to declare the new env vars (without values) so the Worker type-checks correctly
  - _Requirements: 2.1, 2.2, 9.1, 9.2_

- [-] 2. Rewrite the Cloudflare Worker — Supabase client and data layer
  - [ ] 2.1 Update `Env` interface and add Supabase client helpers in `worker/index.ts`
    - Add `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` to the `Env` interface
    - Implement `supabaseHeaders(env)`, `supabaseQuery(env, path, options)`
    - Implement `getArticlesFromSupabase(env, filters)` — queries with PostgREST params (`category=eq.X`, `order=published_at.desc`, `limit`)
    - Implement `saveArticleToSupabase(env, article)` — POST with upsert, retry once on failure
    - Implement `incrementViewsInSupabase(env, slug)` — PATCH views + recalculate trending_score
    - Implement `getExistingSlugs(env)` — GET slugs only (`?select=slug`) to build dedup set
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.1, 9.2_

  - [ ]* 2.2 Write unit tests for Supabase client helpers
    - Mock `fetch` and verify correct PostgREST query params are sent for each helper
    - Verify `saveArticleToSupabase` retries once on 5xx then returns false
    - Verify `SUPABASE_SERVICE_KEY` never appears in logged error strings
    - _Requirements: 2.7, 8.5_

- [-] 3. Rewrite the Cloudflare Worker — AI pipeline functions
  - [ ] 3.1 Implement `detectLanguageHeuristic` and `detectAndTranslate` in `worker/index.ts`
    - Port the heuristic regex checks (Swahili, French, Arabic, Portuguese markers) from the design
    - Implement `detectAndTranslate`: run heuristic, call Gemini translation prompt only if non-English, return original text unchanged on error
    - _Requirements: 1.2, 1.3_

  - [ ]* 3.2 Write property test for `detectLanguageHeuristic`
    - **Property 1: Output is always a known language code**
    - **Validates: Requirements 1.2** — heuristic must return one of `{'en','sw','fr','ar','pt'}` for any string input
    - Use fast-check `fc.string()` as input generator

  - [ ] 3.3 Implement `validateGeminiOutput` and `rewriteWithGemini` in `worker/index.ts`
    - Implement `validateGeminiOutput(json)`: checks all required fields present (`rewritten_title`, `rewritten_excerpt`, `rewritten_body`, `pptv_verdict`, `tags` array of exactly 5, `subcategory`)
    - Implement `rewriteWithGemini(article, env)`: build the Gen Z journalist prompt from the design, call Gemini 1.5 Flash, parse JSON response, run `validateGeminiOutput`, return `null` on any error or invalid output
    - Ensure source publication name is not passed into the prompt body (only used for context in `sourceName` field, stripped per rule 8)
    - _Requirements: 1.4, 1.5, 1.6, 1.9, 1.10_

  - [ ]* 3.4 Write unit tests for `validateGeminiOutput`
    - Test: missing `rewritten_title` → returns false
    - Test: `tags` array with 4 items → returns false
    - Test: `tags` array with 6 items → returns false
    - Test: all fields present and valid → returns true
    - _Requirements: 1.10_

  - [ ]* 3.5 Write property test for `rewriteWithGemini` output structure
    - **Property 2: Rewriter output always passes validation or returns null**
    - **Validates: Requirements 1.4, 1.10** — `rewriteWithGemini` never returns a partially-formed object; it's either fully valid or null

- [ ] 4. Rewrite the Cloudflare Worker — batch processor and cron handler
  - [ ] 4.1 Implement `processArticleBatch` in `worker/index.ts`
    - Accept up to 10 `RawArticle` items, run `Promise.allSettled` for concurrency
    - For each: call `detectAndTranslate` → `rewriteWithGemini` → `validateGeminiOutput` → build `ProcessedArticle` with slug, timestamps, views=0, trending_score=0
    - Count fulfilled vs rejected, log per-article errors without throwing
    - Return `{ processed, failed, skipped }`
    - _Requirements: 1.8, 1.9, 7.1, 7.2_

  - [ ]* 4.2 Write property test for `processArticleBatch`
    - **Property 3: Batch size never exceeds 10 concurrent**
    - **Validates: Requirements 1.8** — input array sliced to 10 before `Promise.allSettled`

  - [ ] 4.3 Update the `scheduled` handler in `worker/index.ts`
    - Call `getExistingSlugs` at start of each cycle to build dedup set
    - Filter fetched articles: skip duplicates (slug already in set) and promo content
    - Call `processArticleBatch` with up to 10 new articles
    - For each processed article, call `saveArticleToSupabase`
    - Log cycle stats: fetched, rewritten, skipped (duplicates), failed, duration ms
    - _Requirements: 1.1, 1.7, 1.8, 7.1_

- [ ] 5. Checkpoint — Worker AI pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Rewrite the Cloudflare Worker — API endpoints and RSS feed pivot
  - [ ] 6.1 Update RSS feed list in `worker/index.ts` to Entertainment/Sports/Technology only
    - Remove all feeds with category: `Politics`, `Health`, `Science`, `Business`, `News` (general)
    - Keep and expand: Entertainment (Kenya, Tanzania, Uganda, Nigeria, Global), Sports (Kenya, Africa, Global), Technology (Africa, Global)
    - Add missing feeds per requirements: Mpasho, Ghafla, Nairobi News, Standard Entertainment, Capital FM Entertainment (Kenya); Mwanaspoti, Bongo5, Michezo Afrika (Tanzania); Sqoop, Chimp Reports (Uganda); BellaNaija, Pulse Nigeria (Nigeria); TMZ, E! Online, People, Billboard, ESPN (Global)
    - _Requirements: 3.1, 3.2_

  - [ ] 6.2 Update `/articles` endpoint to read from Supabase
    - Replace `getArticles(env)` KV call with `getArticlesFromSupabase(env, filters)`
    - Support query params: `category`, `subcategory`, `sort`, `limit`, `offset`
    - Return articles ordered by `published_at` descending by default
    - _Requirements: 9.1, 9.3, 4.7_

  - [ ] 6.3 Update `/trending` endpoint to read from Supabase
    - Query Supabase ordered by `trending_score` descending with configurable limit
    - _Requirements: 9.4, 6.1_

  - [ ] 6.4 Update `/search` endpoint to use Supabase full-text search
    - Use PostgREST `fts` column: `?fts=phraseto_tsquery.english.{query}` or `?rewritten_title=ilike.*{query}*`
    - _Requirements: 9.5, 6.4, 6.5_

  - [ ] 6.5 Update `/views` POST endpoint to call `incrementViewsInSupabase`
    - Replace KV `incrementViews` with `incrementViewsInSupabase(env, slug)`
    - _Requirements: 2.5, 2.6_

  - [ ] 6.6 Add `/health` endpoint
    - Return `{ lastCycleAt, articlesProcessed }` from KV (store after each cron cycle)
    - Require `Authorization: Bearer <WORKER_SECRET>` — return 401 if missing/invalid
    - _Requirements: 7.4, 7.5_

- [ ] 7. Rewrite the Cloudflare Worker — security headers and rate limiting
  - [ ] 7.1 Add `SECURITY_HEADERS` constant and apply to all responses
    - Define the CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers from the design
    - Update `cors()` and `json()` helpers to merge security headers into every response
    - _Requirements: 8.1, 8.5_

  - [ ] 7.2 Implement in-memory rate limiter and apply to all endpoints
    - Implement `checkRateLimit(ip, limitPerMinute=60)` using `Map<string, number[]>` sliding window
    - Extract client IP from `request.headers.get('CF-Connecting-IP')`
    - Return HTTP 429 with `Retry-After: 60` header when limit exceeded
    - _Requirements: 8.2_

  - [ ]* 7.3 Write property test for `checkRateLimit`
    - **Property 4: Rate limiter never allows more than 60 requests per minute from one IP**
    - **Validates: Requirements 8.2** — after 61 calls within 60s window, `checkRateLimit` returns false

- [ ] 8. Checkpoint — Worker complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Update Next.js frontend — next.config.js
  - [ ] 9.1 Add redirects for removed category pages in `next.config.js`
    - Add `async redirects()` returning 301 redirects: `/politics` → `/`, `/news` → `/`, `/health` → `/`, `/science` → `/`, `/business` → `/`
    - _Requirements: 4.2, 4.6_

  - [ ] 9.2 Update security headers in `next.config.js`
    - Replace existing partial `securityHeaders` array with the full set from the design: CSP (with `connect-src` pointing to workers.dev and supabase.co), HSTS, X-Frame-Options: DENY, X-Content-Type-Options, Referrer-Policy
    - _Requirements: 8.4_

- [ ] 10. Update Next.js frontend — navigation components
  - [ ] 10.1 Update `Header.tsx` navigation
    - Replace `NAV` array with the new set from the design: Home, Shows, Entertainment, Sports, Movies, Lifestyle, Technology, 🔥 Trending, 🔴 Live
    - Remove: News, Politics, Business, Health, Science, People
    - _Requirements: 4.1, 4.2_

  - [ ] 10.2 Update `MobileMenu.tsx` navigation links
    - Update `mainLinks` array to match the new `Header.tsx` NAV (remove Politics, News, Business, Health, Science; keep Entertainment, Sports, Movies, Lifestyle, Technology, Trending, Live)
    - _Requirements: 4.1, 4.2_

  - [ ] 10.3 Update `Footer.tsx` Browse column
    - Remove links to `/politics`, `/news`, `/health`, `/science`, `/business` from the Browse column
    - Add links to `/entertainment`, `/sports`, `/technology` if not already present
    - _Requirements: 4.1, 4.2_

- [ ] 11. Update Next.js frontend — delete removed category pages
  - Delete `src/app/politics/page.tsx`
  - Delete `src/app/news/page.tsx` (and `src/app/news/[slug]/` if it only serves the old KV-backed articles — keep if it serves the new Supabase-backed `/articles/:slug` route)
  - Delete `src/app/health/page.tsx`
  - Delete `src/app/science/page.tsx`
  - Delete `src/app/business/page.tsx`
  - _Requirements: 4.2, 4.6_

- [ ] 12. Update Next.js frontend — category pages and homepage
  - [ ] 12.1 Update `src/app/entertainment/page.tsx`
    - Remove `fetchArticles` calls for removed categories (News, Science, Business)
    - Add subcategory row sections using `subcategory` filter param: Celebrity, Music, Movies & TV, Fashion
    - _Requirements: 4.3, 4.7, 4.8_

  - [ ] 12.2 Update `src/app/sports/page.tsx`
    - Remove `fetchArticles` calls for removed categories (News)
    - Ensure subcategory rows align with the new subcategory slugs: football, basketball, athletics, rugby, boxing-mma, kenyan-sports
    - _Requirements: 4.4, 4.7, 4.8_

  - [ ] 12.3 Update `src/app/technology/page.tsx`
    - Remove `fetchArticles` calls for removed categories (Science, Business, News)
    - Add subcategory rows: tech-news, ai-innovation, african-tech, gaming
    - _Requirements: 4.5, 4.7, 4.8_

  - [ ] 12.4 Update `src/app/page.tsx` homepage
    - Remove removed categories from `CATEGORIES` array (Politics, News, Business, Health, Science)
    - Update to: Entertainment, Sports, Movies, Lifestyle, Technology, Trending
    - Update category quick links at bottom to match
    - _Requirements: 4.1, 4.2, 6.2, 6.3_

- [ ] 13. Update Next.js frontend — article display and worker lib
  - [ ] 13.1 Update `src/lib/worker.ts` to support `subcategory` filter
    - Add `subcategory` to `FetchArticlesOptions` and pass it as a query param to the Worker
    - _Requirements: 4.8, 9.3_

  - [ ] 13.2 Update article detail page (`src/app/news/[slug]/page.tsx`) to display new Supabase fields
    - Display `pptvVerdict` field in a styled "PPP TV Verdict" section below the article body
    - Display `tags` as clickable tag chips that link to `/search?q={tag}`
    - Display `rewrittenAt` timestamp alongside `publishedAt`
    - Ensure `sourceName` is NOT displayed in the article body (only in metadata if needed)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 14. Final checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The Worker must NOT use the Supabase Node.js SDK — all Supabase calls use native `fetch` against the PostgREST endpoint
- KV namespace is retained for subscriber data and health-check metadata only; all article reads/writes go to Supabase
- The `news/[slug]` route is kept (it serves individual article pages); only the `/news` listing page is deleted
- Deploy order: Worker first (with new env vars), then frontend (so redirects are live before old pages are removed)
