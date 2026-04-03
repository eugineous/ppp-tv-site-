# Requirements Document

## Introduction

The Article Push System automatically forwards every new or updated article published on the PPP TV site to an external social media auto-poster at `https://auto-news-station.vercel.app/api/ingest`. It persists a local audit queue in a Supabase `ingest_queue` table, performs a bulk backfill of the 50 most recent articles on site startup/build, and ensures that push failures never block article ingestion.

## Glossary

- **System**: The Article Push System as a whole, spanning the Cloudflare Worker, Next.js API route, and pusher library
- **Cloudflare_Worker**: The existing `worker/index.ts` Cloudflare Worker that ingests RSS feeds and saves articles to Supabase
- **API_Route**: The Next.js API route at `/api/push-article`
- **Pusher**: The `src/lib/pusher.ts` shared library responsible for mapping, queuing, and forwarding articles
- **Ingest_Endpoint**: The external auto-news-station endpoint at `https://auto-news-station.vercel.app/api/ingest`
- **ingest_queue**: The Supabase table that stores all pushed articles for auditability and retry
- **IngestArticle**: The payload format expected by the Ingest_Endpoint
- **PUSH_SECRET**: The Bearer token used to authenticate requests to the API_Route
- **INGEST_SECRET**: The environment variable holding the Bearer token used to authenticate requests to the Ingest_Endpoint

---

## Requirements

### Requirement 1: Audit Queue Persistence

**User Story:** As a site operator, I want every pushed article recorded in Supabase, so that I have a full audit trail and can retry failed pushes.

#### Acceptance Criteria

1. THE System SHALL maintain an `ingest_queue` table in Supabase with columns: `id`, `title`, `excerpt`, `content`, `category`, `source_name`, `source_url`, `article_url`, `published_at`, `image_url`, `image_url_direct`, `video_url`, `video_embed_url`, `is_breaking`, `tags`, `ingested_at`, and `posted`
2. WHEN an article push is attempted, THE Pusher SHALL upsert a row into `ingest_queue` with `posted=false` before calling the Ingest_Endpoint
3. IF the Ingest_Endpoint returns a 2xx response, THEN THE Pusher SHALL update the `ingest_queue` row to `posted=true`
4. IF the Ingest_Endpoint returns a non-2xx response or times out, THEN THE Pusher SHALL leave the `ingest_queue` row with `posted=false`
5. THE `ingest_queue` table SHALL have an index on `(posted, published_at DESC)` to support efficient retry queries

---

### Requirement 2: Single Article Push on New or Updated Article

**User Story:** As a site operator, I want every new or updated article automatically forwarded to the auto-poster, so that social media content is always up to date.

#### Acceptance Criteria

1. WHEN the Cloudflare_Worker successfully saves an article to Supabase, THE Cloudflare_Worker SHALL send a POST request to `${VERCEL_URL}/api/push-article` with the article payload and a `Authorization: Bearer PUSH_SECRET` header
2. THE Cloudflare_Worker SHALL send the push notification as a fire-and-forget call — it SHALL NOT await the result before continuing article processing
3. IF the API_Route is unreachable or returns an error, THE Cloudflare_Worker SHALL log the failure and continue without interrupting article ingestion
4. WHEN the API_Route receives a valid request, THE API_Route SHALL call `pushArticle()` from the Pusher and return `{ ok: true }` on success
5. THE Pusher SHALL POST the article payload to the Ingest_Endpoint with header `Authorization: Bearer INGEST_SECRET`

---

### Requirement 3: Startup Batch Push

**User Story:** As a site operator, I want the 50 most recent articles pushed to the auto-poster on every site startup or build, so that the auto-poster is seeded with current content even after a cold start.

#### Acceptance Criteria

1. WHEN the Next.js server starts, THE System SHALL invoke `pushBatch()` via `src/instrumentation.ts`
2. THE `pushBatch` function SHALL perform a health check on the Ingest_Endpoint before fetching articles
3. IF the health check fails, THEN THE `pushBatch` function SHALL return `{ ok: false, pushed: 0 }` without fetching or pushing any articles
4. THE `pushBatch` function SHALL fetch at most 50 articles from Supabase ordered by `published_at DESC`
5. THE `pushBatch` function SHALL send the fetched articles as a single batch POST to the Ingest_Endpoint
6. IF the batch POST succeeds, THEN THE Pusher SHALL upsert all pushed articles into `ingest_queue` with `posted=true`
7. THE `instrumentation.ts` register function SHALL only execute in the `nodejs` runtime, not the edge runtime
8. IF `pushBatch` fails for any reason, THE `instrumentation.ts` register function SHALL log the error and return without throwing, so that site startup is never blocked

---

### Requirement 4: Category Mapping

**User Story:** As a site operator, I want PPP TV article categories mapped to valid auto-poster categories, so that articles are correctly classified in the auto-poster system.

#### Acceptance Criteria

1. THE Pusher SHALL map PPP TV categories to valid ingest categories using the following mapping: `Entertainment → ENTERTAINMENT`, `Celebrity → CELEBRITY`, `Music → MUSIC`, `Sports → SPORTS`, `Movies → MOVIES`, `Lifestyle → LIFESTYLE`, `Technology → GENERAL`, `News → GENERAL`, `Events → EVENTS`, `Fashion → FASHION`, `Comedy → COMEDY`
2. IF an article's category does not match any entry in the mapping, THEN THE Pusher SHALL use `ENTERTAINMENT` as the default category
3. THE valid ingest category values SHALL be: `ENTERTAINMENT`, `CELEBRITY`, `MUSIC`, `SPORTS`, `TV & FILM`, `MOVIES`, `FASHION`, `COMEDY`, `AWARDS`, `EVENTS`, `EAST AFRICA`, `LIFESTYLE`, `GENERAL`

---

### Requirement 5: Fire-and-Forget Push Safety

**User Story:** As a site operator, I want push failures to never block or crash article ingestion, so that the site remains reliable regardless of the auto-poster's availability.

#### Acceptance Criteria

1. THE `pushArticle` function SHALL catch all exceptions internally and return `{ ok: false, error: string }` rather than throwing
2. THE `pushBatch` function SHALL catch all exceptions internally and return `{ ok: false, pushed: 0, error: string }` rather than throwing
3. THE `checkIngestHealth` function SHALL return `false` on any network error or non-200 response and SHALL NOT throw
4. WHILE the Ingest_Endpoint is unavailable, THE Cloudflare_Worker SHALL continue to save articles to Supabase normally

---

### Requirement 6: API Route Authentication

**User Story:** As a site operator, I want the `/api/push-article` route protected by a secret token, so that only the Cloudflare Worker can trigger article pushes.

#### Acceptance Criteria

1. WHEN a POST request arrives at `/api/push-article` without an `Authorization: Bearer PUSH_SECRET` header, THE API_Route SHALL return HTTP 401
2. WHEN a POST request arrives at `/api/push-article` with a valid `Authorization: Bearer PUSH_SECRET` header, THE API_Route SHALL process the request
3. THE `PUSH_SECRET` value SHALL be read from the `PUSH_SECRET` environment variable and SHALL NOT be hardcoded in source code

---

### Requirement 7: Ingest Token Security

**User Story:** As a site operator, I want the auto-poster authentication token stored securely, so that it is never exposed in source code or client-side bundles.

#### Acceptance Criteria

1. THE Pusher SHALL read the ingest Bearer token from the `INGEST_SECRET` environment variable
2. THE `INGEST_SECRET` value SHALL NOT be hardcoded in any committed source file
3. THE Pusher SHALL include the token as `Authorization: Bearer <INGEST_SECRET>` on every request to the Ingest_Endpoint

---

### Requirement 8: Article Payload Mapping

**User Story:** As a site operator, I want PPP TV articles correctly transformed into the IngestArticle format, so that the auto-poster receives well-formed payloads.

#### Acceptance Criteria

1. THE `mapToIngestPayload` function SHALL set `id` to `article.slug`
2. THE `mapToIngestPayload` function SHALL set `title` to `article.title.toUpperCase()`
3. THE `mapToIngestPayload` function SHALL set `excerpt` to at most 300 characters, using `article.excerpt` if available, otherwise the first 300 characters of the stripped content
4. THE `mapToIngestPayload` function SHALL strip HTML tags from `article.content` to produce the plain-text `content` field
5. THE `mapToIngestPayload` function SHALL set `imageUrl` and `imageUrlDirect` to the same value (`article.imageUrl ?? ''`)
6. THE `mapToIngestPayload` function SHALL set `videoUrl` to `null`
7. THE `mapToIngestPayload` function SHALL set `isBreaking` to `false`
8. THE `mapToIngestPayload` function SHALL set `sourceName` to `"PPP TV Kenya"`
9. THE `mapToIngestPayload` function SHALL set `sourceUrl` and `articleUrl` to `https://ppp-tv-site.vercel.app/news/{slug}`

---

### Requirement 9: Idempotent Queue Upsert

**User Story:** As a site operator, I want repeated pushes of the same article to be idempotent, so that duplicate rows are never created in the audit queue.

#### Acceptance Criteria

1. THE Pusher SHALL upsert `ingest_queue` rows using `id` (article slug) as the primary key with `resolution=merge-duplicates`
2. WHEN `pushArticle` is called twice for the same article, THE `ingest_queue` table SHALL contain exactly one row for that article after both calls complete
3. THE upsert operation SHALL update all fields on conflict, so that the latest article data is always reflected

---

### Requirement 10: Error Handling and Graceful Degradation

**User Story:** As a site operator, I want all push errors handled gracefully with clear logging, so that failures are observable and recoverable without manual intervention.

#### Acceptance Criteria

1. IF the Ingest_Endpoint returns a non-2xx response, THEN THE Pusher SHALL log the status code and return `{ ok: false, error: statusText }`
2. IF the Ingest_Endpoint request times out (after 10 seconds for single push, 30 seconds for batch), THEN THE Pusher SHALL return `{ ok: false, error: 'timeout' }`
3. IF Supabase is unavailable during an upsert, THEN THE Pusher SHALL log the error and proceed to call the Ingest_Endpoint anyway (best-effort queue)
4. IF the Cloudflare_Worker cannot reach the API_Route, THE Cloudflare_Worker SHALL log the failure and the article SHALL still be saved to Supabase
5. IF `pushBatch` fails the health check, THE System SHALL log the failure and the site startup SHALL continue normally
