# Requirements Document

## Introduction

The Live Trending Dashboard is a real-time "What's Hot" page at `/trending` for PPP TV Kenya. It surfaces the most-viewed articles tracked via browser localStorage and a lightweight server-side hit store, Google Trends Kenya topics, recently published high-engagement articles (last 2 hours), a category heat map, and a 60-second auto-refresh countdown. A shareable snapshot URL lets users capture and share the current trending state. The feature is fully self-contained — no external analytics, no new npm packages.

---

## Glossary

- **HitTracker**: Client-side utility (`src/lib/hitTracker.ts`) that records article views in localStorage and POSTs to `/api/hit`.
- **HitAPI**: The `/api/hit` Next.js route that aggregates hit counts server-side in `/tmp/ppptv_hits.json`.
- **HitRecord**: A server-side record `{ slug, title, category, image, count, updatedAt }` representing one article's total hit count.
- **HitStore**: The JSON file at `/tmp/ppptv_hits.json` — a `Record<slug, HitRecord>` capped at 500 entries.
- **TrendingPage**: The Next.js client component at `src/app/trending/page.tsx` that renders the full dashboard.
- **Dashboard**: The complete live trending dashboard feature, comprising TrendingPage and all sub-components.
- **TopArticlesRail**: Sub-component showing the top 10 most-hit articles.
- **GoogleTrendsPanel**: Sub-component displaying top Google Trends Kenya topics.
- **RisingSection**: Sub-component showing articles published in the last 2 hours sorted by hit count.
- **CategoryHeatMap**: Sub-component showing per-category hit share as a visual heat grid.
- **RefreshCountdown**: Sub-component showing seconds until next auto-refresh with a pink progress arc.
- **TrendingSnapshot**: A base64url-encoded URL parameter encoding the top 5 slugs and a Unix timestamp.
- **Aggregator**: The `aggregateTrendingData()` pure function that derives dashboard data from raw API responses.
- **CATEGORIES**: The fixed set of 10 known article categories used across the site.
- **CAT_COLORS**: The mapping of category name to brand color used in the CategoryHeatMap.

---

## Requirements

### Requirement 1: Article Hit Recording

**User Story:** As a reader, I want my article views to be counted, so that the trending dashboard reflects real engagement.

#### Acceptance Criteria

1. WHEN a user opens an article page, THE HitTracker SHALL increment the article's hit count in localStorage under the key `ppptv_hits` by 1.
2. WHEN a user opens an article page, THE HitTracker SHALL dispatch a fire-and-forget POST to `/api/hit` with the article's `slug`, `title`, `category`, and `image`.
3. IF localStorage is unavailable (SSR context or private browsing mode), THEN THE HitTracker SHALL continue execution without throwing an exception.
4. THE HitTracker SHALL never block or delay the article page render while recording a hit.

---

### Requirement 2: Server-Side Hit Aggregation API

**User Story:** As the dashboard, I want a reliable hit count store, so that trending data reflects cumulative article views across all users.

#### Acceptance Criteria

1. WHEN POST `/api/hit` is called with a `slug` that does not exist in the HitStore, THE HitAPI SHALL create a new HitRecord with `count` equal to 1 and `updatedAt` set to the current ISO timestamp.
2. WHEN POST `/api/hit` is called with a `slug` that already exists in the HitStore, THE HitAPI SHALL increment the existing HitRecord's `count` by 1 and update `updatedAt` to the current ISO timestamp.
3. WHEN the HitStore contains more than 500 entries after an upsert, THE HitAPI SHALL evict the oldest entries by `updatedAt` until the store contains exactly 500 entries.
4. WHEN GET `/api/hit?limit=N` is called, THE HitAPI SHALL return a JSON response `{ hits: HitRecord[], updatedAt: number }` where `hits` is sorted by `count` descending and contains at most `N` records.
5. THE HitAPI SHALL never serve a cached response (`export const dynamic = 'force-dynamic'`).
6. IF `/tmp/ppptv_hits.json` is unreadable or malformed on a GET or POST request, THEN THE HitAPI SHALL treat the store as empty and continue without throwing.

---

### Requirement 3: Trending Data Aggregation

**User Story:** As a visitor, I want the dashboard to compute meaningful trending signals, so that I can discover what content is popular right now.

#### Acceptance Criteria

1. WHEN `aggregateTrendingData` is called with hits, articles, and trends arrays, THE Aggregator SHALL return `topArticles` containing at most 10 HitRecords sorted by `count` descending.
2. WHEN `aggregateTrendingData` is called, THE Aggregator SHALL return `risingArticles` containing only articles whose `publishedAt` timestamp is within the last 2 hours, sorted by hit count descending, with at most 8 entries.
3. WHEN `aggregateTrendingData` is called, THE Aggregator SHALL return `categoryHeat` containing exactly one `CategoryHeat` entry per entry in CATEGORIES.
4. WHEN `aggregateTrendingData` is called, THE Aggregator SHALL return `categoryHeat` where the sum of all `share` values is less than or equal to 1.0.
5. WHEN `aggregateTrendingData` is called with an empty hits array, THE Aggregator SHALL return `categoryHeat` where every entry has `share` equal to 0.
6. WHEN `aggregateTrendingData` is called, THE Aggregator SHALL return `googleTrends` containing at most 10 TrendItems from the input trends array.

---

### Requirement 4: Dashboard Page and Auto-Refresh

**User Story:** As a visitor, I want the trending dashboard to stay current automatically, so that I always see up-to-date trending data without manually refreshing.

#### Acceptance Criteria

1. THE TrendingPage SHALL be accessible at the route `/trending`.
2. WHEN the TrendingPage mounts, THE TrendingPage SHALL fetch `/api/hit?limit=20`, `/api/trends`, and `/api/news?limit=120` in parallel.
3. WHEN the TrendingPage mounts, THE TrendingPage SHALL start a 60-second countdown displayed via the RefreshCountdown component.
4. WHEN the countdown reaches 0, THE TrendingPage SHALL re-fetch `/api/hit` and `/api/trends` and reset the countdown to 60.
5. WHILE the countdown is running, THE TrendingPage SHALL decrement `secondsLeft` by 1 each second.
6. WHEN the TrendingPage unmounts, THE TrendingPage SHALL clear the countdown interval to prevent memory leaks.
7. THE TrendingPage SHALL render the following sections: TopArticlesRail, GoogleTrendsPanel, RisingSection, CategoryHeatMap, and RefreshCountdown.

---

### Requirement 5: Shareable Snapshot URL

**User Story:** As a visitor, I want to share a snapshot of the current trending state, so that others can see what was trending at a specific moment.

#### Acceptance Criteria

1. WHEN a user clicks the share button, THE TrendingPage SHALL generate a `TrendingSnapshot` object containing the current Unix timestamp and the top 5 article slugs.
2. WHEN generating a snapshot URL, THE TrendingPage SHALL encode the `TrendingSnapshot` as a base64url string and append it as the `snap` query parameter to the `/trending` URL.
3. WHEN the TrendingPage loads with a `snap` query parameter, THE TrendingPage SHALL decode the base64url value and display the snapshot's top articles.
4. THE TrendingSnapshot SHALL contain only article slugs and a Unix timestamp — no personally identifiable information.

---

### Requirement 6: Error Handling and Fallback States

**User Story:** As a visitor, I want the dashboard to degrade gracefully when data is unavailable, so that I always see something useful even during failures.

#### Acceptance Criteria

1. IF all three dashboard APIs (`/api/hit`, `/api/trends`, `/api/news`) fail simultaneously, THEN THE TrendingPage SHALL display skeleton loaders, an "Unable to load trending data" message, and a manual refresh button.
2. IF the RisingSection has no articles published in the last 2 hours, THEN THE TrendingPage SHALL display the 3 most recently published articles as a fallback with a "Nothing new in the last 2 hours — check back soon" message.
3. IF the HitStore is empty on initial load, THEN THE TopArticlesRail SHALL display the most recently published articles from `/api/news` as a fallback.
4. WHEN a dashboard API call fails individually, THE TrendingPage SHALL continue rendering all sections that have data available.

---

### Requirement 7: Dashboard UI Components

**User Story:** As a visitor, I want a visually clear and branded dashboard, so that I can quickly scan trending content in PPP TV Kenya's black/hot-pink style.

#### Acceptance Criteria

1. THE TopArticlesRail SHALL display the top 10 most-hit articles as a horizontally scrollable rail with rank badges.
2. THE GoogleTrendsPanel SHALL display the top 10 Google Trends Kenya topics with traffic volume badges.
3. THE RisingSection SHALL display articles published in the last 2 hours sorted by hit count descending.
4. THE CategoryHeatMap SHALL display each category's hit share as a percentage of total hits using CAT_COLORS and a heat intensity overlay.
5. THE RefreshCountdown SHALL display the seconds remaining until the next auto-refresh with a pink progress arc.
6. THE TrendingPage SHALL apply the existing black/hot-pink brand tokens (`--pink`, `--card`, `--border`) from `globals.css`.
7. THE TrendingPage SHALL be mobile-first and responsive.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Hit count increment

*For any* article slug and any initial localStorage state, calling `recordHit` with that slug should result in `ppptv_hits[slug]` being exactly 1 greater than its previous value (or equal to 1 if it was absent).

**Validates: Requirements 1.1**

---

### Property 2: Server-side upsert correctness

*For any* sequence of POST `/api/hit` calls with the same slug, the resulting `HitRecord.count` should equal the number of times that slug was posted.

**Validates: Requirements 2.1, 2.2**

---

### Property 3: HitStore size invariant

*For any* sequence of upsert operations, the number of entries in the HitStore should never exceed 500.

**Validates: Requirements 2.3**

---

### Property 4: GET /api/hit sort and limit

*For any* HitStore state and any limit N, the response from GET `/api/hit?limit=N` should contain at most N records and those records should be sorted by `count` in descending order.

**Validates: Requirements 2.4**

---

### Property 5: Rising articles time window

*For any* articles array, the `risingArticles` returned by `aggregateTrendingData` should contain only articles whose `publishedAt` is greater than or equal to `now - 2 hours`.

**Validates: Requirements 3.2**

---

### Property 6: Category heat map completeness

*For any* hits array, the `categoryHeat` returned by `aggregateTrendingData` should contain exactly one entry for every category in CATEGORIES.

**Validates: Requirements 3.3**

---

### Property 7: Category share sum invariant

*For any* hits array, the sum of all `share` values in `categoryHeat` should be less than or equal to 1.0 (within floating-point epsilon).

**Validates: Requirements 3.4, 3.5**

---

### Property 8: Snapshot round-trip

*For any* list of up to 5 article slugs and any Unix timestamp, encoding a `TrendingSnapshot` to base64url and then decoding it should produce an equivalent object with the same slugs and timestamp.

**Validates: Requirements 5.1, 5.2, 5.3**

---

### Property 9: recordHit never throws

*For any* HitPayload, calling `recordHit` in an environment where localStorage is unavailable should complete without throwing any exception.

**Validates: Requirements 1.3**
