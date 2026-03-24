# Tasks: PPP TV Kenya Site (ppp-tv-site-final)

## Task List

- [x] 1. Project Scaffolding
  - [x] 1.1 Initialize Next.js 14 App Router project with TypeScript and Tailwind CSS in `ppp-tv-site-final/`
  - [x] 1.2 Install dependencies: rss-parser, date-fns
  - [x] 1.3 Configure `tailwind.config.ts` with design system colors, fonts, and custom scrollbar plugin
  - [x] 1.4 Configure `next.config.ts` with image domains (Cloudflare Worker proxy, common CDNs)
  - [x] 1.5 Create `.env.example` with all required environment variables
  - [x] 1.6 Create `vercel.json` with cron schedule for `/api/cron/refresh` (every 15 minutes)
  - [x] 1.7 Create `src/app/globals.css` with: fadeIn animation, custom scrollbar (4px pink), focus ring, font variables
  - [x] 1.8 Create `src/app/layout.tsx` with Bebas Neue + DM Sans fonts, global metadata, and layout shell
  - [x] 1.9 Create PWA manifest (`src/app/manifest.ts`) with correct name, theme_color, lang, categories

- [x] 2. Data Files
  - [x] 2.1 Create `src/data/shows.ts` with all 8 shows (slugs, names, schedules, categories, accent colors, host slugs)
  - [x] 2.2 Create `src/data/hosts.ts` with all 10 hosts (slugs, names, titles, bios, Instagram links, show slugs)
  - [x] 2.3 Create `src/data/artists.ts` with 12 Kenyan artists (name, genre, bio, initials, featured flag)
  - [x] 2.4 Create `src/data/staff.ts` with 10 staff members (name, role, bio, initials, on-air/behind-the-scenes)
  - [x] 2.5 Create `src/data/rssFeeds.ts` with all 45 RSS feed URLs (Kenyan + African sources)
  - [x] 2.6 Create `src/types/index.ts` with Article, Show, Host, Artist, Staff, NewsletterSubscriber, AnalyticsHit interfaces

- [x] 3. Utility Functions
  - [x] 3.1 Create `src/lib/utils.ts` with: slugify(), timeAgo(), formatDate(), truncate()
  - [x] 3.2 Create `src/lib/worker.ts` with: fetchArticles(), fetchTrending(), recordView(), searchArticles() — all wrapping Cloudflare Worker API calls
  - [x] 3.3 Create `src/lib/rss.ts` with: parseRSSFeed(), fetchAllFeeds() using rss-parser
  - [x] 3.4 Create `src/lib/localStorage.ts` with: getBookmarks(), toggleBookmark(), getRecentlyViewed(), addRecentlyViewed() — all with try/catch guards
  - [x] 3.5 Create `src/lib/schedule.ts` with: getCurrentShow() — returns current on-air show based on time of day

- [x] 4. Global Layout Components
  - [x] 4.1 Create `src/components/Header.tsx` — sticky header with logo, desktop nav (dropdowns), search icon
  - [x] 4.2 Create `src/components/MobileMenu.tsx` — full-screen overlay mobile nav (loaded with dynamic ssr:false)
  - [x] 4.3 Create `src/components/MobileBottomNav.tsx` — 5-item fixed bottom nav, md:hidden (dynamic ssr:false)
  - [x] 4.4 Create `src/components/Footer.tsx` — social icons (5 platforms), 2-col links grid, #080808 bg
  - [x] 4.5 Create `src/components/NewsletterBar.tsx` — email form POSTing to /api/newsletter (dynamic ssr:false)
  - [x] 4.6 Create `src/components/RecentlyViewed.tsx` — localStorage-based strip, links to /news/[slug] (dynamic ssr:false)
  - [x] 4.7 Create `src/components/BackToTop.tsx` — appears after 400px scroll (dynamic ssr:false)
  - [x] 4.8 Create `src/components/SectionLabel.tsx` — reusable section label with pink accent bar

- [x] 5. Article/Card Components
  - [x] 5.1 Create `src/components/ArticleCard.tsx` — 16:9 card with thumbnail, category badge, title (2-line clamp), time-ago, bookmark toggle, hover overlay
  - [x] 5.2 Create `src/components/HeroBanner.tsx` — full-bleed hero with gradient overlay, category badge, title, excerpt, CTAs
  - [x] 5.3 Create `src/components/CategoryRow.tsx` — horizontal scroll row with section label, "See All →" link, ArticleCard list
  - [x] 5.4 Create `src/components/TrendingSection.tsx` — top 5 articles by trending score
  - [x] 5.5 Create `src/components/OnAirStrip.tsx` — current show strip using getCurrentShow()

- [x] 6. Homepage
  - [x] 6.1 Create `src/app/page.tsx` — Netflix-style homepage: fetches articles (ISR revalidate:300), renders HeroBanner + CategoryRows + TrendingSection + OnAirStrip + RecentlyViewed + NewsletterBar

- [x] 7. News Article Page
  - [x] 7.1 Create `src/app/news/[slug]/page.tsx` — full article page: hero image, title, category, date, source, content, view recording on mount, ISR revalidate:3600
  - [x] 7.2 Create `src/app/news/[slug]/ViewRecorder.tsx` — client component that calls recordView() on mount

- [x] 8. Shows Pages
  - [x] 8.1 Create `src/app/shows/page.tsx` — shows grid: featured 3 + all shows + broadcast schedule table
  - [x] 8.2 Create `src/app/shows/[slug]/page.tsx` — individual show page: hero, description, hosts, sidebar with schedule

- [x] 9. Hosts Pages
  - [x] 9.1 Create `src/app/hosts/page.tsx` — responsive grid (2/3/4-col) of all 10 hosts
  - [x] 9.2 Create `src/app/hosts/[slug]/page.tsx` — individual host page: bio, title, Instagram link, associated shows

- [x] 10. People & Content Pages
  - [x] 10.1 Create `src/app/artists/page.tsx` — real artists page using artists.ts (NOT a redirect), featured artists highlighted
  - [x] 10.2 Create `src/app/staff/page.tsx` — team page split into On-Air Talent + Behind the Scenes sections
  - [x] 10.3 Create `src/app/video/page.tsx` — real YouTube embeds from PPP TV Kenya channel (responsive 16:9 iframes)
  - [x] 10.4 Create `src/app/live/page.tsx` — YouTube live embed + sidebar with upcoming schedule
  - [x] 10.5 Create `src/app/schedule/page.tsx` — broadcast schedule table + show cards
  - [x] 10.6 Create `src/app/events/page.tsx` — events category page with cyan accent, fetches category=Events articles

- [x] 11. Utility Pages
  - [x] 11.1 Create `src/app/search/page.tsx` — search page with debounced input (300ms), fetches from Worker /search?q=, renders ArticleCard results
  - [x] 11.2 Create `src/app/saved/page.tsx` — bookmarked articles from localStorage ppp_bookmarks (client-side only)
  - [x] 11.3 Create `src/app/about/page.tsx` — channel stats, mission, values, shows preview, team preview
  - [x] 11.4 Create `src/app/contact/page.tsx` — 4 contact cards + socials sidebar
  - [x] 11.5 Create `src/app/analytics/page.tsx` — password-protected dashboard (client-side gate, fallback: ppptv2026)
  - [x] 11.6 Create `src/app/privacy/page.tsx` — privacy policy
  - [x] 11.7 Create `src/app/terms/page.tsx` — terms of use
  - [x] 11.8 Create `src/app/not-found.tsx` — 404 page with "Browse News" button linking to /

- [x] 12. API Routes
  - [x] 12.1 Create `src/app/api/newsletter/route.ts` — POST {email}, validate format, rate-limit 5/min/IP, forward to Worker /subscribe
  - [x] 12.2 Create `src/app/api/analytics/route.ts` — Bearer token protected, proxies to Worker /analytics
  - [x] 12.3 Create `src/app/api/cron/refresh/route.ts` — CRON_SECRET protected, fetches 45 RSS feeds (Promise.allSettled), deduplicates by URL hash, POSTs to Worker /articles
  - [x] 12.4 Create `src/app/api/revalidate/route.ts` — ISR revalidation endpoint

- [x] 13. Cloudflare Worker
  - [x] 13.1 Create `worker/index.ts` — main Worker entry point with router
  - [x] 13.2 Implement `GET /articles` — fetch from KV with category filter, sort (recent/trending), limit, offset
  - [x] 13.3 Implement `POST /articles` — auth required, batch save to KV, skip duplicates, return {saved, skipped}
  - [x] 13.4 Implement `POST /views` + `GET /views/:slug` — view count with rate limiting (1/slug/IP/hour)
  - [x] 13.5 Implement `GET /trending` — top 5 by trending score (gravity decay formula), exclude articles >7 days old
  - [x] 13.6 Implement `GET /search?q=` — keyword search across title/excerpt/tags/category, relevance scoring, max 20 results
  - [x] 13.7 Implement `GET /image?url=` — image proxy with Cache-Control: public, max-age=86400
  - [x] 13.8 Implement `POST /subscribe` + `GET /subscribers` — newsletter email storage with hashed IP
  - [x] 13.9 Implement `GET /analytics` — auth required, return total views, top articles, subscriber count, recent hits
  - [x] 13.10 Create `worker/wrangler.toml` — KV namespace binding (PPP_TV_KV), worker name, compatibility date

- [x] 14. Final Polish & Validation
  - [x] 14.1 Verify all ArticleCard and RecentlyViewed hrefs use /news/[slug] (not /articles/[slug])
  - [x] 14.2 Verify all next/image usages have width, height, and non-empty alt props
  - [x] 14.3 Verify all client-only components use dynamic({ ssr: false })
  - [x] 14.4 Verify not-found.tsx "Browse News" links to /
  - [x] 14.5 Verify /live page uses real YouTube channel URL (https://www.youtube.com/@PPPTVKENYA)
  - [x] 14.6 Run getDiagnostics on all TypeScript files and fix any type errors
  - [x] 14.7 Verify vercel.json cron schedule is correct (_/15 _ \* \* \*)
  - [x] 14.8 Verify PWA manifest has all required fields (name, short_name, theme_color, background_color, display, lang, categories)
