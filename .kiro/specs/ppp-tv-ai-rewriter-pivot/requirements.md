# Requirements Document

## Introduction

PPP TV Kenya is pivoting from a general news platform to an **Entertainment, Sports, and Technology** focused media brand targeting audiences in Kenya, Tanzania, Uganda, Nigeria, and globally (with emphasis on US celebrity culture). The pivot introduces an **AI Journalist Agent** embedded in the existing Cloudflare Worker that automatically scrapes RSS feeds, translates non-English content, rewrites every article in a Gen Z voice using Gemini, and persists results to Supabase. The frontend navigation and category structure are updated to reflect the new editorial focus, and the platform is hardened with security controls.

---

## Glossary

- **AI_Agent**: The automated pipeline running inside the Cloudflare Worker that fetches, translates, rewrites, and stores articles.
- **Worker**: The Cloudflare Worker that hosts the AI_Agent, cron scheduler, and REST API.
- **Gemini**: Google's Gemini generative AI API used for translation and article rewriting.
- **Supabase**: The PostgreSQL-backed database (accessed via REST API) that replaces Cloudflare KV for article storage.
- **RSS_Fetcher**: The component of the Worker responsible for fetching and parsing RSS feeds.
- **Rewriter**: The component of the Worker responsible for calling Gemini to rewrite article content.
- **Translator**: The component of the Worker responsible for detecting non-English content and translating it to English via Gemini before rewriting.
- **Article**: A single piece of content stored in Supabase with both original and rewritten fields.
- **PPP_TV_Verdict**: A 1–2 sentence editorial hot take appended to every rewritten article.
- **Slug**: A URL-safe unique identifier derived from the rewritten article title.
- **Trending_Score**: A computed numeric score used to rank articles by recency and view count.
- **WAF**: Cloudflare Web Application Firewall used to protect the platform.
- **CSP**: Content Security Policy HTTP header.
- **HSTS**: HTTP Strict Transport Security HTTP header.
- **Frontend**: The Next.js 14 application deployed on Vercel that renders articles to site visitors.
- **Admin**: An authenticated operator who monitors the AI pipeline and platform health.
- **Visitor**: An unauthenticated end user browsing the PPP TV website.

---

## Requirements

### Requirement 1: AI Article Rewriting Pipeline

**User Story:** As the system, I want to automatically fetch, translate, and rewrite articles from RSS feeds in a Gen Z voice, so that PPP TV always has fresh, on-brand content without manual editorial work.

#### Acceptance Criteria

1. WHEN the Worker cron trigger fires, THE AI_Agent SHALL fetch new articles from all configured RSS feeds.
2. WHEN an article is fetched, THE AI_Agent SHALL detect the language of the article title and body.
3. WHEN the detected language is not English, THE Translator SHALL call Gemini to translate the title and body to English before rewriting.
4. WHEN an article is ready for rewriting, THE Rewriter SHALL call Gemini with the Gen Z journalist persona prompt and produce: `rewritten_title`, `rewritten_excerpt` (maximum 2 sentences), `rewritten_body` (full article), `pptv_verdict` (1–2 sentence hot take), and `tags` (array of exactly 5 relevant tags).
5. WHEN the Rewriter produces output, THE AI_Agent SHALL preserve all factual claims from the original article in the rewritten version.
6. WHEN the Rewriter produces output, THE AI_Agent SHALL NOT include the name of the original source publication in the rewritten body.
7. WHEN an article has already been processed in a previous cron cycle (duplicate slug), THE AI_Agent SHALL skip rewriting and not create a duplicate record in Supabase.
8. WHEN a cron cycle runs, THE AI_Agent SHALL process up to 10 articles concurrently per cycle.
9. IF the Gemini API returns an error for a specific article, THEN THE AI_Agent SHALL log the error, skip that article, and continue processing remaining articles.
10. IF the Gemini API returns a response that does not contain all required fields (`rewritten_title`, `rewritten_excerpt`, `rewritten_body`, `pptv_verdict`, `tags`), THEN THE AI_Agent SHALL discard the response and skip saving that article.

---

### Requirement 2: Supabase Article Storage

**User Story:** As the system, I want to store all rewritten articles in Supabase, so that the frontend can query articles by category, subcategory, date, and trending score using SQL.

#### Acceptance Criteria

1. WHEN a rewritten article is ready, THE AI_Agent SHALL save it to the Supabase `articles` table using the Supabase REST API via `fetch` calls (no Node.js SDK).
2. THE Supabase `articles` table SHALL store the following fields: `id`, `slug`, `original_title`, `rewritten_title`, `rewritten_excerpt`, `rewritten_body`, `pptv_verdict`, `category`, `subcategory`, `tags` (array), `image_url`, `source_name`, `source_url`, `published_at`, `rewritten_at`, `language_detected`, `views`, `trending_score`.
3. WHEN an article is saved, THE AI_Agent SHALL generate a unique `slug` derived from the `rewritten_title`.
4. WHEN an article is saved, THE AI_Agent SHALL set `rewritten_at` to the current UTC timestamp.
5. WHEN a visitor views an article, THE Worker SHALL increment the `views` counter for that article's record in Supabase.
6. WHEN the `views` counter is updated, THE Worker SHALL recalculate and update the `trending_score` using recency and view count.
7. IF a Supabase write operation fails, THEN THE AI_Agent SHALL log the error with the article slug and retry once before skipping.

---

### Requirement 3: RSS Feed Configuration

**User Story:** As the system, I want to pull content from a curated set of East African and global entertainment RSS feeds, so that PPP TV covers the topics its target audience cares about.

#### Acceptance Criteria

1. THE RSS_Fetcher SHALL support feeds from the following regions and categories:
   - Kenya Entertainment: Mpasho, Ghafla, Nairobi News (Nation), Standard Entertainment, Capital FM Entertainment
   - Tanzania: Mwanaspoti (sports), Bongo5, Michezo Afrika
   - Uganda: Sqoop, Chimp Reports
   - Nigeria: BellaNaija, Pulse Nigeria Entertainment
   - Global Entertainment: TMZ, E! Online, People, Billboard, ESPN
2. WHEN an RSS feed URL is unreachable or returns a non-200 response, THE RSS_Fetcher SHALL log the failure and continue processing remaining feeds.
3. WHEN parsing an RSS feed, THE RSS_Fetcher SHALL extract: article URL, title, excerpt/description, publication date, and source name.
4. WHEN an article URL matches a known promotional content URL pattern (e.g., `/press-release`, `/sponsored`, `/advertorial`), THE RSS_Fetcher SHALL skip that article.
5. WHEN an article title or excerpt matches a promotional content pattern, THE RSS_Fetcher SHALL skip that article.

---

### Requirement 4: Site Category Pivot

**User Story:** As a visitor, I want to browse PPP TV's new Entertainment, Sports, and Technology focused categories, so that I can find the content I care about without seeing irrelevant news categories.

#### Acceptance Criteria

1. THE Frontend SHALL display the following top-level categories in navigation: Entertainment, Sports, Technology, Movies, Lifestyle, Trending.
2. THE Frontend SHALL NOT display the following categories in navigation: Politics, News (general), Health, Science, Business.
3. THE Frontend SHALL display the following Entertainment sub-categories: Celebrity Gossip & Drama, Music (Afrobeats, Bongo, Gengetone, Hip-Hop, Pop, R&B), Movies & TV Shows (Netflix, Hollywood, Nollywood, Kenyan films), Fashion & Style, Relationships & Dating, Social Media Trends, Comedy & Memes, Reality TV, Awards & Events.
4. THE Frontend SHALL display the following Sports sub-categories: Football (EPL, La Liga, Serie A, Kenyan Premier League, AFCON), Basketball (NBA, FIBA Africa), Athletics & Track, Rugby, Cricket, Boxing & MMA, Kenyan Sports Heroes.
5. THE Frontend SHALL display the following Technology sub-categories: Tech News, Gaming, Social Media, AI & Innovation, African Tech (M-Pesa, startups).
6. WHEN a visitor navigates to a removed category URL (e.g., `/politics`, `/health`), THE Frontend SHALL redirect the visitor to the home page.
7. WHEN a visitor navigates to a category page, THE Frontend SHALL display articles filtered to that category, sorted by `published_at` descending.
8. WHEN a visitor navigates to a sub-category page, THE Frontend SHALL display articles filtered to that sub-category, sorted by `published_at` descending.

---

### Requirement 5: Article Reading Experience

**User Story:** As a visitor, I want to read rewritten articles in a Gen Z voice with a PPP TV Verdict section, so that I get entertaining, opinionated content that feels native to the platform.

#### Acceptance Criteria

1. WHEN a visitor opens an article, THE Frontend SHALL display the `rewritten_title`, `rewritten_body`, and `pptv_verdict` fields from Supabase.
2. WHEN a visitor opens an article, THE Frontend SHALL display the `rewritten_excerpt` as the article summary or meta description.
3. WHEN a visitor opens an article, THE Frontend SHALL display the article's `tags` as clickable tag chips.
4. WHEN a visitor clicks a tag chip, THE Frontend SHALL navigate to a filtered view showing all articles with that tag.
5. WHEN a visitor opens an article, THE Frontend SHALL NOT display the original source publication name in the article body.
6. WHEN a visitor opens an article, THE Frontend SHALL display the `image_url` as the article hero image.
7. WHEN an article has no `image_url`, THE Frontend SHALL display a branded placeholder image.

---

### Requirement 6: Trending and Discovery

**User Story:** As a visitor, I want to discover trending and popular articles, so that I can quickly find what everyone is talking about.

#### Acceptance Criteria

1. WHEN a visitor visits the Trending page, THE Frontend SHALL display articles sorted by `trending_score` descending.
2. WHEN a visitor visits the home page, THE Frontend SHALL display a "Trending Now" section showing the top 12 most recently published articles.
3. WHEN a visitor visits the home page, THE Frontend SHALL display a "Top 10" section showing the 10 articles with the highest combined `views` and `trending_score`.
4. WHEN a visitor searches for a keyword, THE Frontend SHALL return articles whose `rewritten_title`, `rewritten_excerpt`, or `tags` contain the keyword.
5. WHEN no search results are found, THE Frontend SHALL display a message indicating no results and suggest browsing a category.

---

### Requirement 7: Admin Pipeline Monitoring

**User Story:** As an admin, I want to monitor the AI rewriting pipeline, so that I can detect failures, track throughput, and ensure content quality.

#### Acceptance Criteria

1. WHEN a cron cycle completes, THE Worker SHALL log: total articles fetched, total articles rewritten, total articles skipped (duplicates), total articles failed (Gemini errors), and cycle duration in milliseconds.
2. WHEN a Gemini API call fails, THE Worker SHALL log the article URL, error message, and HTTP status code.
3. WHEN a Supabase write fails, THE Worker SHALL log the article slug and error message.
4. THE Worker SHALL expose a `/health` endpoint that returns the timestamp of the last successful cron cycle and the count of articles processed in that cycle.
5. WHEN the `/health` endpoint is called without a valid `Authorization: Bearer <WORKER_SECRET>` header, THE Worker SHALL return HTTP 401.

---

### Requirement 8: Security Hardening

**User Story:** As an admin, I want the platform to be protected against common web attacks and credential exposure, so that PPP TV's infrastructure and user data remain secure.

#### Acceptance Criteria

1. THE Worker SHALL include the following HTTP response headers on all responses: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
2. THE Worker SHALL enforce rate limiting on all API endpoints, returning HTTP 429 when a single IP exceeds 60 requests per minute.
3. WHEN a request to a protected Worker endpoint is made without a valid `Authorization: Bearer <WORKER_SECRET>` header, THE Worker SHALL return HTTP 401.
4. THE Frontend SHALL include the following HTTP response headers on all pages: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
5. THE Worker SHALL NOT expose the Gemini API key, Supabase service key, or any other secret in HTTP responses or logs.
6. IF a request originates from an IP address on the Cloudflare WAF blocklist, THEN THE WAF SHALL block the request before it reaches the Worker.

---

### Requirement 9: Cloudflare KV to Supabase Migration

**User Story:** As the system, I want to migrate article storage from Cloudflare KV to Supabase, so that the platform can support SQL queries, full-text search, and analytics without KV size limitations.

#### Acceptance Criteria

1. WHEN the migration is complete, THE Worker SHALL read and write all article data exclusively from Supabase and SHALL NOT read from or write to Cloudflare KV for article storage.
2. THE Worker SHALL query Supabase using the REST API (`fetch` calls to the Supabase PostgREST endpoint) and SHALL NOT use the Supabase Node.js client SDK.
3. WHEN the Frontend requests articles by category, THE Worker SHALL query Supabase with a `category` filter and return results ordered by `published_at` descending.
4. WHEN the Frontend requests trending articles, THE Worker SHALL query Supabase ordered by `trending_score` descending with a configurable limit.
5. WHEN the Frontend performs a full-text search, THE Worker SHALL use Supabase's built-in full-text search on the `rewritten_title`, `rewritten_excerpt`, and `tags` columns.
