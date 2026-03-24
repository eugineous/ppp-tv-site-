# Implementation Plan: Live Trending Dashboard

## Overview

Implement the `/trending` live dashboard in incremental steps: hit tracking utility → API route → aggregation logic → UI components → page wiring → nav/sitemap integration. Property-based tests (fast-check) are placed immediately after the logic they validate.

## Tasks

- [x] 1. Create `src/lib/hitTracker.ts` — client-side hit recording utility
  - Implement `recordHit(payload: HitPayload): void` — reads/writes `ppptv_hits` key in localStorage, fires a fire-and-forget POST to `/api/hit`
  - Implement `getLocalHits(): Record<string, number>` — returns the current localStorage hit map
  - Wrap all localStorage access in try/catch so the function never throws
  - Export `HitPayload` interface: `{ slug, title, category, image }`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 1.1 Write property test for `recordHit` localStorage increment (Property 1)
    - **Property 1: Hit count increment**
    - Use `fc.string()` for slug and arbitrary initial localStorage state; assert `ppptv_hits[slug]` is exactly 1 greater than its prior value (or equals 1 if absent)
    - **Validates: Requirements 1.1**

  - [ ]* 1.2 Write property test for `recordHit` never throws (Property 9)
    - **Property 9: recordHit never throws**
    - Simulate unavailable localStorage by deleting `window.localStorage`; assert no exception is thrown for any `HitPayload`
    - **Validates: Requirements 1.3**

- [x] 2. Create `src/app/api/hit/route.ts` — hit aggregation API
  - Add `export const dynamic = 'force-dynamic'`
  - Implement `POST /api/hit`: parse body, call `upsertHit()`, return `{ ok: true }`
  - Implement `GET /api/hit?limit=N`: read `/tmp/ppptv_hits.json`, sort by `count` desc, return `{ hits: HitRecord[], updatedAt: number }`
  - Implement `upsertHit()`: read store, increment or create record, evict oldest entries when store exceeds 500, write back
  - Gracefully treat unreadable/malformed `/tmp/ppptv_hits.json` as empty store
  - Export `HitRecord` interface: `{ slug, title, category, image, count, updatedAt }`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 2.1 Write property test for server-side upsert correctness (Property 2)
    - **Property 2: Server-side upsert correctness**
    - Use `fc.array(fc.string())` as a sequence of slugs; assert `store[slug].count` equals the number of times that slug appeared in the sequence
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 2.2 Write property test for HitStore size invariant (Property 3)
    - **Property 3: HitStore size invariant**
    - Use `fc.array(fc.record({ slug: fc.string(), title: fc.string(), category: fc.string(), image: fc.option(fc.string()) }), { maxLength: 600 })`; assert `Object.keys(store).length <= 500` after all upserts
    - **Validates: Requirements 2.3**

  - [ ]* 2.3 Write property test for GET sort and limit (Property 4)
    - **Property 4: GET /api/hit sort and limit**
    - Use `fc.array(fc.record({ slug: fc.string(), count: fc.nat() }))` and `fc.nat({ max: 50 })` for limit N; assert response length ≤ N and records are sorted by `count` descending
    - **Validates: Requirements 2.4**

- [x] 3. Checkpoint — core data layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement `aggregateTrendingData()` pure function
  - Create `src/lib/trendingAggregator.ts` exporting `aggregateTrendingData(hits, articles, trends)` and the `CategoryHeat` interface
  - Implement the four derivations from the design pseudocode: `topArticles` (top 10), `risingArticles` (last 2h, sorted by hit count, max 8), `categoryHeat` (one entry per CATEGORIES entry, share = count/total), `googleTrends` (top 10 pass-through)
  - Export `CATEGORIES` constant (the 10 known categories) and `CAT_COLORS` map
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.1 Write property test for rising articles time window (Property 5)
    - **Property 5: Rising articles time window**
    - Use `fc.array(fc.record({ slug: fc.string(), publishedAt: fc.date().map(d => d.toISOString()), category: fc.string() }))`; assert every article in `risingArticles` has `publishedAt >= now - 2h`
    - **Validates: Requirements 3.2**

  - [ ]* 4.2 Write property test for category heat map completeness (Property 6)
    - **Property 6: Category heat map completeness**
    - Use `fc.array(fc.record({ slug: fc.string(), category: fc.constantFrom(...CATEGORIES), count: fc.nat() }))`; assert `categoryHeat.length === CATEGORIES.length` and every CATEGORIES entry appears exactly once
    - **Validates: Requirements 3.3**

  - [ ]* 4.3 Write property test for category share sum invariant (Property 7)
    - **Property 7: Category share sum invariant**
    - Use same arbitrary hits array; assert `categoryHeat.reduce((s, c) => s + c.share, 0) <= 1.0 + Number.EPSILON`
    - **Validates: Requirements 3.4, 3.5**

- [x] 5. Create trending sub-components
  - [x] 5.1 Create `src/components/trending/TopArticlesRail.tsx`
    - Horizontally scrollable rail; render rank badge (1–10), article thumbnail, title, category badge, and hit count for each `HitRecord`
    - Show skeleton loaders when `loading` is true
    - When `articles` is empty, render a "No trending data yet" placeholder
    - _Requirements: 7.1_

  - [x] 5.2 Create `src/components/trending/GoogleTrendsPanel.tsx`
    - List of up to 10 `TrendItem` entries; each row shows rank, topic title, and traffic volume badge
    - Show skeleton loaders when `loading` is true
    - _Requirements: 7.2_

  - [x] 5.3 Create `src/components/trending/RisingSection.tsx`
    - Card grid of articles published in the last 2 hours; show thumbnail, title, category, and `timeAgo`
    - When `articles` is empty, show "Nothing new in the last 2 hours — check back soon" and the 3 most-recent fallback articles passed via a `fallback` prop
    - _Requirements: 3.2, 6.2, 7.3_

  - [x] 5.4 Create `src/components/trending/CategoryHeatMap.tsx`
    - Grid of `CategoryHeat` entries; each cell uses `CAT_COLORS[category]` as accent and overlays heat intensity via opacity proportional to `share`
    - Show skeleton loaders when `loading` is true
    - _Requirements: 7.4_

  - [x] 5.5 Create `src/components/trending/RefreshCountdown.tsx`
    - SVG circle progress arc (pink stroke) that depletes over 60 seconds; display `secondsLeft` in the centre
    - Expose `onRefresh` prop as a manual-refresh click handler
    - _Requirements: 4.3, 4.5, 7.5_

- [x] 6. Checkpoint — all sub-components render without errors
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create `src/app/trending/page.tsx` — main dashboard page
  - Add `'use client'` directive
  - On mount, fetch `/api/hit?limit=20`, `/api/trends`, and `/api/news?limit=120` in parallel via `Promise.all`
  - Call `aggregateTrendingData()` to derive `topArticles`, `risingArticles`, `categoryHeat`, `googleTrends`
  - Start a `setInterval` (1s tick) that decrements `secondsLeft`; when it reaches 0, re-fetch `/api/hit` and `/api/trends` and reset to 60
  - Clear the interval in the `useEffect` cleanup to prevent memory leaks
  - Render `<TopArticlesRail>`, `<GoogleTrendsPanel>`, `<RisingSection>`, `<CategoryHeatMap>`, `<RefreshCountdown>`
  - If all three API calls fail, show skeleton loaders, "Unable to load trending data" message, and a manual refresh button
  - Implement snapshot: share button encodes `{ ts: Date.now(), top: top5Slugs }` as base64url `?snap=` param; on load, decode `snap` param and display snapshot articles
  - Apply brand tokens (`--pink`, `--card`, `--border`) from `globals.css`; mobile-first responsive layout
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 6.1, 6.3, 6.4, 7.6, 7.7_

  - [ ]* 7.1 Write property test for snapshot round-trip (Property 8)
    - **Property 8: Snapshot round-trip**
    - Use `fc.array(fc.string(), { maxLength: 5 })` for slugs and `fc.nat()` for timestamp; assert that encoding then decoding a `TrendingSnapshot` produces an object with identical `ts` and `top` values
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 8. Wire `recordHit()` into `src/app/news/[slug]/page.tsx`
  - Convert the article page to a client component or add a thin `'use client'` child wrapper that calls `recordHit({ slug, title, category, image })` inside a `useEffect` with an empty dependency array
  - Import `recordHit` from `@/lib/hitTracker`
  - Ensure the `useEffect` fires only once per page load and does not block rendering
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 9. Add `/trending` link to navigation in `src/app/layout.tsx`
  - Add a `{ href: '/trending', label: 'Trending' }` entry to the flat nav link list (alongside Events, Video, Contact)
  - _Requirements: 4.1_

- [x] 10. Add `/trending` entry to `src/app/sitemap.ts`
  - Insert `{ path: '/trending', priority: 0.8, freq: 'always' }` into the `staticPages` array
  - _Requirements: 4.1_

- [x] 11. Final checkpoint — full feature wired end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` (`fc`) — install with `npm install --save-dev fast-check` if not already present
- Each property test task references the exact property number from `design.md` for traceability
- The article page (`/news/[slug]/page.tsx`) is currently a server component; task 8 should add a minimal `'use client'` child component rather than converting the entire page
- `/tmp/ppptv_hits.json` is ephemeral (Vercel serverless) — the store resets on cold starts, which is acceptable per the design
