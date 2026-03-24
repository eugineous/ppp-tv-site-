# Requirements Document: PPP TV Kenya Site (ppp-tv-site-final)

## Introduction

This document defines the functional and non-functional requirements for the PPP TV Kenya website — a digital companion to the PPP TV Kenya TV channel (StarTimes Channel 430). The site is Africa-focused (Kenya primary) and serves as a Netflix-style news and entertainment hub. It replaces the deleted `eugineous/ppptv-v2` repo with a fully functional, production-ready build deployed on Vercel with a Cloudflare Worker backend.

---

## Requirements

### 1. Homepage — Netflix-Style News Feed

#### 1.1

The homepage (`/`) MUST render a full-bleed hero banner featuring the most recent article, including: a background image with gradient overlay, category badge, title, excerpt, "Read More" CTA linking to `/news/[slug]`, and "Watch Live" secondary CTA linking to `/live`.

**Acceptance Criteria**:

- Given the homepage loads with at least one article, the hero banner is visible with all required elements
- Given the homepage loads with zero articles, a fallback state is shown ("Content loading — check back soon")
- The "Read More" button href matches `/news/[article.slug]`

#### 1.2

The homepage MUST render horizontal scroll rows for each of the following categories: Breaking News, Entertainment, Sports, Music, Lifestyle, East Africa, Campus Life, Gospel.

**Acceptance Criteria**:

- Each row has a category label (9px, 900 weight, .2em letter-spacing, uppercase, pink) with a pink accent bar (4px × 32px) to its left
- Each row has a "See All →" link
- Each row is horizontally scrollable with hidden scrollbar
- Rows with zero articles for a category are hidden (not rendered as empty rows)

#### 1.3

Each article card in a category row MUST display: 16:9 thumbnail (via `next/image`), category badge, title (2-line clamp), and time-ago string.

**Acceptance Criteria**:

- Card links to `/news/[slug]`
- Hover state: scale(1.05) transition, excerpt overlay slides up
- Bookmark icon toggles saved state in localStorage under key `ppp_bookmarks`

#### 1.4

The homepage MUST include a Trending section showing the top 5 articles by trending score, fetched from the Cloudflare Worker `GET /trending` endpoint.

**Acceptance Criteria**:

- Trending section renders 5 article cards
- Articles are ordered by trending score (highest first)
- On fetch failure, section is hidden gracefully

#### 1.5

The homepage MUST include an "On Air Now" strip showing the current show based on time of day, derived from the broadcast schedule in `shows.ts`.

**Acceptance Criteria**:

- Strip shows show name, schedule string, and accent color
- Correct show is displayed for the current time slot
- If no show is currently airing, strip is hidden

---

### 2. Content Pages

#### 2.1

The `/news/[slug]` route MUST render a full article page with: hero image, category badge, title, publish date, source name, full content (or excerpt if content unavailable), and a "Back" link.

**Acceptance Criteria**:

- Page records a view via `POST /views` to the Cloudflare Worker on mount
- Page updates `ppp_recently_viewed` in localStorage on mount
- Page uses ISR with `revalidate: 3600`

#### 2.2

The `/shows` page MUST render a grid of all 8 shows defined in `shows.ts`, with a featured section for the first 3 shows and a broadcast schedule table.

**Acceptance Criteria**:

- All 8 shows are rendered
- Each show card links to `/shows/[slug]`
- Schedule table shows show name, day/time, and category

#### 2.3

The `/shows/[slug]` page MUST render an individual show page with: hero section, show description, hosts list, and sidebar with schedule info.

**Acceptance Criteria**:

- Page renders for all 8 show slugs defined in `shows.ts`
- Host names link to `/hosts/[slug]`
- Accent color from `shows.ts` is applied to the page

#### 2.4

The `/hosts` page MUST render a responsive grid (2-col mobile, 3-col tablet, 4-col desktop) of all 10 hosts from `hosts.ts`.

**Acceptance Criteria**:

- Each host card shows name, title, and image/initials fallback
- Each card links to `/hosts/[slug]`

#### 2.5

The `/hosts/[slug]` page MUST render an individual host page with bio, title, Instagram link (if available), and associated shows.

**Acceptance Criteria**:

- Page renders for all 10 host slugs in `hosts.ts`
- Instagram link opens in new tab with `rel="noopener noreferrer"`

#### 2.6

The `/artists` page MUST be a real page rendering artist cards from `artists.ts` data — NOT a redirect.

**Acceptance Criteria**:

- Page renders all 12 artists from `artists.ts`
- Featured artists are visually distinguished
- Each card shows name, genre, bio, and initials avatar

#### 2.7

The `/video` page MUST render real YouTube embeds from the PPP TV Kenya channel (`https://www.youtube.com/@PPPTVKENYA`).

**Acceptance Criteria**:

- Page contains at least one `<iframe>` with a `youtube.com` src
- Embeds are responsive (16:9 aspect ratio)
- Page is NOT a placeholder

#### 2.8

The `/live` page MUST embed the PPP TV Kenya YouTube live stream.

**Acceptance Criteria**:

- Page contains an iframe pointing to the PPP TV Kenya YouTube channel live stream
- Sidebar shows upcoming schedule from `shows.ts`

#### 2.9

The `/schedule` page MUST render a full broadcast schedule table and show cards.

**Acceptance Criteria**:

- Table shows all 8 shows with day, time, and category
- Show cards link to `/shows/[slug]`

#### 2.10

The `/events` page MUST render an events category page with cyan accent color.

**Acceptance Criteria**:

- Page fetches articles with `category=Events` from the Cloudflare Worker
- Accent color is cyan (not pink)

#### 2.11

The `/staff` page MUST render all 10 staff members from `staff.ts` in two sections: On-Air Talent and Behind the Scenes.

**Acceptance Criteria**:

- Each staff card shows name, role, bio, and initials avatar

#### 2.12

The `/about` page MUST include channel stats, mission statement, values, shows preview, and team preview.

**Acceptance Criteria**:

- Channel stats include: StarTimes Channel 430, broadcast reach, founding info
- Links to `/shows` and `/staff` are present

#### 2.13

The `/contact` page MUST render 4 contact cards (General, News Tips, Advertising, Show Pitches) and a socials sidebar.

**Acceptance Criteria**:

- All contact emails are correct per spec
- Social links open in new tab

#### 2.14

The `/saved` page MUST render bookmarked articles read from localStorage key `ppp_bookmarks`.

**Acceptance Criteria**:

- Page is loaded with `dynamic({ ssr: false })` or equivalent client-side guard
- Empty state shown when no bookmarks exist
- Each saved article links to `/news/[slug]`

#### 2.15

The `/search` page MUST perform live search against the Cloudflare Worker `GET /search?q=` endpoint.

**Acceptance Criteria**:

- Search input is debounced 300ms before firing request
- Results render as article cards linking to `/news/[slug]`
- Empty query shows no results (not an error)
- Loading state is shown while fetching

---

### 3. Global Layout & Navigation

#### 3.1

The global header MUST be sticky (z-50), black background, with a 3px pink bottom border, height 64px (h-16).

**Acceptance Criteria**:

- Header remains visible when scrolling
- Left: PPP TV logo (icon.png, 52×52) links to `/`
- Center (desktop): Shows dropdown, People dropdown, Events, Video, 🔴 Live, Contact
- Right (desktop): search icon

#### 3.2

The `MobileMenu` component MUST be loaded with `dynamic(() => import('./MobileMenu'), { ssr: false })`.

**Acceptance Criteria**:

- Mobile menu renders as full-screen overlay
- All nav links are accessible in mobile menu
- Menu closes on link click or close button

#### 3.3

The `MobileBottomNav` component MUST render 5 items (Home, Shows, Video, Live, Search) and be hidden on desktop (`md:hidden`).

**Acceptance Criteria**:

- Fixed to bottom of viewport on mobile
- Active item is highlighted with pink accent
- Each item links to the correct route

#### 3.4

The global footer MUST include social icons for Instagram, X, YouTube, Facebook, and TikTok with the correct URLs, and a 2-column links grid.

**Acceptance Criteria**:

- Instagram: `https://www.instagram.com/ppptvke`
- Twitter/X: `https://twitter.com/PPPTV_ke`
- YouTube: `https://www.youtube.com/@PPPTVKENYA`
- Facebook: `https://www.facebook.com/PPPTVKENYA`
- TikTok: `https://www.tiktok.com/@ppptvkenya`
- All social links open in new tab with `rel="noopener noreferrer"`
- Footer background is `#080808`

#### 3.5

The `RecentlyViewed` component MUST link to `/news/[slug]` (NOT `/articles/[slug]`).

**Acceptance Criteria**:

- Component is loaded with `dynamic({ ssr: false })`
- Reads from `ppp_recently_viewed` localStorage key
- Shows max 10 items
- All hrefs start with `/news/`

#### 3.6

The `BackToTop` button MUST appear after scrolling 400px and scroll to top on click.

**Acceptance Criteria**:

- Hidden when scroll position < 400px
- Visible when scroll position >= 400px
- Loaded with `dynamic({ ssr: false })`

#### 3.7

The `NewsletterBar` component MUST POST to `/api/newsletter` with `{email}` and show success/error feedback.

**Acceptance Criteria**:

- Loaded with `dynamic({ ssr: false })`
- Shows success message on 200 response
- Shows error message on 4xx/5xx response
- Input is cleared after successful submission

#### 3.8

The `not-found.tsx` (404 page) "Browse News" button MUST link to `/` (homepage).

**Acceptance Criteria**:

- 404 page renders for unknown routes
- "Browse News" button href is `/`

---

### 4. API Routes

#### 4.1

`/api/newsletter` MUST accept POST requests with `{email}`, validate email format, rate-limit to 5 requests/min/IP, and forward to the Cloudflare Worker `POST /subscribe`.

**Acceptance Criteria**:

- Returns 400 for invalid email format
- Returns 429 after 5 requests from same IP within 60 seconds
- Returns 200 on successful subscription
- Returns 500 if Worker is unreachable

#### 4.2

`/api/analytics` MUST be protected by Bearer token and return hit data from the Cloudflare Worker `GET /analytics`.

**Acceptance Criteria**:

- Returns 401 without valid Authorization header
- Returns analytics JSON on valid request

#### 4.3

`/api/cron/refresh` MUST be protected by `CRON_SECRET`, fetch all 45 RSS feeds in parallel, deduplicate by URL hash, and POST new articles to the Cloudflare Worker.

**Acceptance Criteria**:

- Returns 401 without valid `Authorization: Bearer CRON_SECRET` header
- Fetches all feeds using `Promise.allSettled` (individual failures don't abort the run)
- Deduplicates articles by URL hash before posting
- Returns `{ok: true, saved: N, skipped: M, errors: E}`

#### 4.4

`/api/revalidate` MUST trigger ISR revalidation for specified paths.

**Acceptance Criteria**:

- Accepts `path` query parameter
- Returns 200 on successful revalidation

---

### 5. Cloudflare Worker

#### 5.1

The Worker MUST implement `GET /articles` supporting `category`, `sort` (recent|trending), `limit`, and `offset` query parameters.

**Acceptance Criteria**:

- Returns array of Article objects
- `sort=trending` returns articles sorted by trending score
- `sort=recent` returns articles sorted by `publishedAt` descending
- `category` filter is case-insensitive

#### 5.2

The Worker MUST implement `POST /articles` requiring `Authorization: Bearer WORKER_SECRET`.

**Acceptance Criteria**:

- Returns 401 without valid Authorization header
- Accepts array of Article objects
- Skips articles with duplicate slugs (already in KV)
- Returns `{saved: N, skipped: M}`

#### 5.3

The Worker MUST implement `POST /views` to record a page view and `GET /views/:slug` to return view count.

**Acceptance Criteria**:

- `POST /views` accepts `{slug}` and increments view count in KV
- `GET /views/:slug` returns `{slug, count}`
- View recording is rate-limited (max 1 view per slug per IP per hour)

#### 5.4

The Worker MUST implement `GET /trending` returning the top 5 articles by trending score.

**Acceptance Criteria**:

- Returns exactly 5 articles (or fewer if less than 5 exist)
- Trending score uses gravity decay: `viewCount / (ageHours + 2)^1.8`
- Articles older than 7 days are excluded from trending

#### 5.5

The Worker MUST implement `GET /search?q=` performing keyword search across title, excerpt, tags, and category.

**Acceptance Criteria**:

- Empty `q` returns `[]`
- Results are sorted by relevance score (title match = 3pts, excerpt = 2pts, category = 2pts, tags = 1pt)
- Returns at most 20 results by default

#### 5.6

The Worker MUST implement `GET /image?url=` as an image proxy with caching.

**Acceptance Criteria**:

- Proxies image from external URL
- Response includes `Cache-Control: public, max-age=86400`
- Returns 400 if `url` param is missing or invalid

#### 5.7

The Worker MUST implement `POST /subscribe` to save newsletter emails and `GET /subscribers` (auth required) to list them.

**Acceptance Criteria**:

- `POST /subscribe` validates email format, returns 400 for invalid
- Email is stored in KV with hashed IP
- `GET /subscribers` requires Authorization header, returns 401 without it

#### 5.8

The Worker MUST implement `GET /analytics` (auth required) returning dashboard stats.

**Acceptance Criteria**:

- Returns 401 without valid Authorization header
- Returns: total views, unique articles, top articles by views, subscriber count, recent hits

---

### 6. Design System

#### 6.1

The site MUST use the defined color palette throughout.

**Acceptance Criteria**:

- Background: `#000000`
- Primary accent: `#FF007A`
- Card background: `#0d0d0d` / `#0f0f0f`
- Borders: `#1a1a1a`
- Footer background: `#080808`

#### 6.2

The site MUST use Bebas Neue for display headings and DM Sans for body text, loaded via `next/font/google`.

**Acceptance Criteria**:

- Both fonts are loaded in `layout.tsx` via `next/font/google`
- Bebas Neue applied to headings, section titles, hero text
- DM Sans applied to body, cards, nav

#### 6.3

Section labels MUST follow the spec: 9px, font-weight 900, letter-spacing .2em, uppercase, pink (`#FF007A`), with a 4px × 32px pink accent bar (borderRadius 2px) to the left.

**Acceptance Criteria**:

- All category row labels match this style
- All page section labels match this style

#### 6.4

The custom scrollbar MUST be 4px wide with a pink thumb.

**Acceptance Criteria**:

- Applied globally via CSS (`::-webkit-scrollbar`, `scrollbar-width: thin`)
- Thumb color is `#FF007A`

#### 6.5

Focus rings MUST be `2px solid #FF007A`.

**Acceptance Criteria**:

- Applied globally via Tailwind `ring` utilities or CSS
- Visible on keyboard navigation for all interactive elements

#### 6.6

Page transitions MUST use a `fadeIn` animation (0.25s ease).

**Acceptance Criteria**:

- Applied to main page content wrapper
- CSS keyframe: `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`

#### 6.7

Hover image zoom MUST use `scale(1.05)` with `transition-duration: 500ms`.

**Acceptance Criteria**:

- Applied to all article card thumbnails
- Applied to show and host card images

#### 6.8

Max content width MUST be 1280px, centered.

**Acceptance Criteria**:

- Applied via `max-w-[1280px] mx-auto` on all page content wrappers

---

### 7. PWA

#### 7.1

The site MUST include a valid PWA manifest.

**Acceptance Criteria**:

- `manifest.json` (or `app/manifest.ts`) includes:
  - `name: "PPP TV Kenya"`
  - `short_name: "PPP TV"`
  - `theme_color: "#FF007A"`
  - `background_color: "#000000"`
  - `display: "standalone"`
  - `lang: "en-KE"`
  - `categories: ["news", "entertainment"]`

---

### 8. Performance & SEO

#### 8.1

All pages using article data MUST use ISR (Incremental Static Regeneration).

**Acceptance Criteria**:

- Homepage: `revalidate: 300` (5 minutes)
- Article pages `/news/[slug]`: `revalidate: 3600` (1 hour)
- Show/host pages: `revalidate: 86400` (24 hours)

#### 8.2

All images MUST use `next/image` with `width`, `height`, and `alt` props.

**Acceptance Criteria**:

- No raw `<img>` tags in the codebase (except inside SVGs)
- All `next/image` usages have non-empty `alt` text

#### 8.3

All client-only components (those using localStorage, window, or browser APIs) MUST be loaded with `dynamic({ ssr: false })`.

**Acceptance Criteria**:

- `MobileMenu`, `MobileBottomNav`, `RecentlyViewed`, `BackToTop`, `NewsletterBar` all use `dynamic({ ssr: false })`
- No hydration mismatch errors in production

#### 8.4

Each page MUST have appropriate `<title>` and `<meta name="description">` tags via Next.js `metadata` export.

**Acceptance Criteria**:

- Homepage title: "PPP TV Kenya — Africa's Entertainment Hub"
- Article pages: title is article title
- All pages have unique, descriptive meta descriptions

---

### 9. Data Files

#### 9.1

`src/data/shows.ts` MUST export all 8 shows with correct slugs, names, schedules, categories, accent colors, and host slugs.

**Acceptance Criteria**:

- Shows: urban-news, juu-ya-game, campus-xposure, gospel-10, top-15-countdown, kenyan-drive-show, bongo-quiz, tushinde-charity-show
- Each show has: slug, name, tagline, description, schedule, category, accentColor, hosts[]

#### 9.2

`src/data/hosts.ts` MUST export all 10 hosts with slugs, names, titles, bios, and Instagram links.

**Acceptance Criteria**:

- 10 hosts total
- Each host has: slug, name, title, bio, instagramUrl (optional), shows[]

#### 9.3

`src/data/artists.ts` MUST export 12 Kenyan artists with name, genre, bio, initials, and featured flag.

**Acceptance Criteria**:

- 12 artists total
- At least 3 artists have `featured: true`

#### 9.4

`src/data/staff.ts` MUST export 10 staff members split into on-air and behind-the-scenes roles.

**Acceptance Criteria**:

- 10 staff members total
- Each has: name, role, bio, initials, category ('on-air' | 'behind-the-scenes')

---

### 10. Deployment

#### 10.1

The project MUST include a `vercel.json` with cron configuration for `/api/cron/refresh` running every 15 minutes.

**Acceptance Criteria**:

- `vercel.json` contains `crons` array with path `/api/cron/refresh` and schedule `*/15 * * * *`

#### 10.2

The project MUST include a `.env.example` file documenting all required environment variables.

**Acceptance Criteria**:

- Documents: `WORKER_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_ANALYTICS_PASSWORD`, `NEXT_PUBLIC_WORKER_URL`
