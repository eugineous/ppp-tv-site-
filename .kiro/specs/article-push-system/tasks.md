# Implementation Plan: Article Push System

## Overview

Implement the article push pipeline entirely within `ppp-tv-site-final/`. The Cloudflare Worker fires a POST to `/api/push-article` after saving each article; the API route delegates to `src/lib/pusher.ts` which upserts to `ingest_queue` and forwards to the auto-news-station endpoint. A startup batch push via `src/instrumentation.ts` seeds the auto-poster with the 50 most recent articles on every cold start.

## Tasks

- [x] 1. Create the Supabase `ingest_queue` table
  - Run the following SQL in the Supabase SQL editor (or migration file):
    ```sql
    create table if not exists ingest_queue (
      id text primary key,
      title text not null,
      excerpt text default '',
      content text default '',
      category text default 'ENTERTAINMENT',
      source_name text default 'PPP TV Kenya',
      source_url text not null,
      article_url text not null,
      published_at timestamptz default now(),
      image_url text default '',
      image_url_direct text default '',
      video_url text,
      video_embed_url text,
      is_breaking boolean default false,
      tags text[] default '{}',
      ingested_at timestamptz default now(),
      posted boolean default false
    );
    create index if not exists ingest_queue_posted_idx
      on ingest_queue(posted, published_at desc);
    ```
  - _Requirements: 1.1, 1.5_

- [x] 2. Add environment variables to `.env.example`
  - Append `PUSH_SECRET` and `INGEST_SECRET` entries to `ppp-tv-site-final/.env.example`
  - _Requirements: 6.3, 7.1, 7.2_

- [x] 3. Implement `src/lib/pusher.ts`
  - [x] 3.1 Implement `mapToIngestPayload(article: Article): IngestArticle`
    - Define the `IngestArticle` interface inline (or import from types)
    - Apply `CATEGORY_MAP` with `'ENTERTAINMENT'` fallback for unknown categories
    - Set `title` to `article.title.toUpperCase()`
    - Strip HTML from `article.content` for the plain-text `content` field
    - Set `excerpt` to `article.excerpt` if non-empty, else first 300 chars of stripped content; always slice to 300
    - Set `imageUrl` and `imageUrlDirect` to `article.imageUrl ?? ''`
    - Set `videoUrl` to `null`, `isBreaking` to `false`, `sourceName` to `"PPP TV Kenya"`
    - Set `id`, `sourceUrl`, and `articleUrl` to slug-based values
    - _Requirements: 4.1, 4.2, 4.3, 8.1–8.9_

  - [ ]* 3.2 Write property tests for `mapToIngestPayload` using fast-check
    - **Property 1: Category mapping is always valid** — for any Article input, `result.category` is one of the 13 valid ingest category strings
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - **Property 2: Payload output shape invariants** — for any Article input, all of: `result.title === article.title.toUpperCase()`, `result.excerpt.length <= 300`, `result.imageUrl === result.imageUrlDirect`, `result.videoUrl === null`, `result.isBreaking === false`, `result.sourceName === "PPP TV Kenya"`, `result.id === article.slug`
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8**
    - Place tests in `src/lib/pusher.test.ts`; install `fast-check` as a dev dependency first

  - [x] 3.3 Implement `checkIngestHealth(): Promise<boolean>`
    - GET `https://auto-news-station.vercel.app/api/ingest` with `Authorization: Bearer <INGEST_SECRET>`
    - Return `true` only if response is 200 and body contains `{ ok: true }`
    - Catch all errors and return `false`; never throw
    - _Requirements: 3.2, 5.3_

  - [x] 3.4 Implement `pushArticle(article: Article): Promise<{ ok: boolean; error?: string }>`
    - Call `mapToIngestPayload` to build the payload
    - Upsert a row into `ingest_queue` with `posted=false` using Supabase REST API (`resolution=merge-duplicates`)
    - If upsert fails, log the error and continue (best-effort queue)
    - POST `{ article: payload }` to `https://auto-news-station.vercel.app/api/ingest` with `Authorization: Bearer <INGEST_SECRET>` and a 10-second timeout
    - On 2xx: update `ingest_queue` row to `posted=true`, return `{ ok: true }`
    - On non-2xx or timeout: return `{ ok: false, error: statusText | 'timeout' }`
    - Wrap entire function in try/catch; never throw
    - _Requirements: 1.2, 1.3, 1.4, 2.4, 2.5, 5.1, 7.1, 7.3, 9.1, 9.3, 10.1, 10.2, 10.3_

  - [x] 3.5 Implement `pushBatch(): Promise<{ ok: boolean; pushed: number; error?: string }>`
    - Call `checkIngestHealth()`; if `false`, return `{ ok: false, pushed: 0, error: 'Ingest endpoint unavailable' }`
    - Fetch at most 50 articles from Supabase `articles` table ordered by `published_at DESC`
    - Map each article with `mapToIngestPayload`
    - POST `{ articles: payloads }` to the ingest endpoint with a 30-second timeout
    - On success: upsert all payloads into `ingest_queue` with `posted=true`
    - On failure: return `{ ok: false, pushed: 0, error: statusText }`
    - Wrap entire function in try/catch; never throw
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 5.2, 10.2_

  - [ ]* 3.6 Write property test for `pushArticle` idempotence
    - **Property 3: pushArticle idempotence** — calling `pushArticle` twice for the same article results in exactly one row in `ingest_queue`
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Use a mocked Supabase client to assert upsert is called with `resolution=merge-duplicates`

  - [ ]* 3.7 Write property test for `pushBatch` batch size bound
    - **Property 4: Batch size bound** — `pushBatch` fetches and pushes at most 50 articles regardless of table size
    - **Validates: Requirements 3.4**

  - [ ]* 3.8 Write property test for no-throw guarantee
    - **Property 5: No-throw guarantee** — for any input (malformed articles, network failures, missing env vars), `pushArticle`, `pushBatch`, and `checkIngestHealth` never throw
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 4. Checkpoint — ensure `pusher.ts` compiles and all property tests pass
  - Run `cd ppp-tv-site-final && npx tsc --noEmit` to check types
  - Run `npm test` to execute property tests
  - Ask the user if any questions arise before continuing

- [x] 5. Create `src/app/api/push-article/route.ts`
  - Read `PUSH_SECRET` from `process.env.PUSH_SECRET`
  - On missing or mismatched `Authorization: Bearer` header, return HTTP 401 `{ error: 'Unauthorized' }`
  - Parse `{ article }` from request body
  - Call `pushArticle(article)` from `pusher.ts`
  - Return `{ ok: true }` on success or `{ ok: false, error }` on failure with HTTP 200 in both cases
  - _Requirements: 2.4, 6.1, 6.2, 6.3_

- [x] 6. Enable `instrumentationHook` in `next.config.js`
  - Add `instrumentationHook: true` to the `experimental` block in `ppp-tv-site-final/next.config.js`
  - _Requirements: 3.1_

- [x] 7. Create `src/instrumentation.ts`
  - Export an async `register()` function
  - Guard with `if (process.env.NEXT_RUNTIME !== 'nodejs') return;` so it only runs in the Node.js runtime
  - Dynamically import `pushBatch` from `@/lib/pusher` inside the guard
  - Call `pushBatch()`, log the result (`pushed` count or error)
  - Wrap in try/catch; log errors and return without throwing
  - _Requirements: 3.1, 3.7, 3.8_

- [x] 8. Modify `worker/index.ts` to fire-and-forget push after saving articles
  - Add `PUSH_SECRET` and `VERCEL_URL` to the `Env` interface (if not already present)
  - After each successful `saveArticleToSupabase()` call, fire a non-blocking POST to `${env.VERCEL_URL}/api/push-article` with `Authorization: Bearer ${env.PUSH_SECRET}` and the article as JSON body
  - Use `.catch(err => console.error('[push]', err))` — do NOT await the fetch
  - Ensure the article save path is never blocked or interrupted by push failures
  - _Requirements: 2.1, 2.2, 2.3, 5.4, 10.4_

- [x] 9. Final checkpoint — wire-up verification
  - Run `cd ppp-tv-site-final && npx tsc --noEmit` to confirm no type errors across all new files
  - Run `npm test` to confirm all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `fast-check` must be installed as a dev dependency before running property tests: `npm install -D fast-check`
- The Supabase SQL in task 1 must be run manually in the Supabase dashboard or via a migration tool
- `PUSH_SECRET` and `INGEST_SECRET` must be set in both Vercel environment variables and the Cloudflare Worker secrets
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
