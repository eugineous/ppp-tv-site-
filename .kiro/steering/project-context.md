---
inclusion: auto
---

# PPP TV Kenya — Project Context

## What This Is

PPP TV Kenya is a Next.js 14 (App Router) entertainment news website for StarTimes Channel 430.
Live URL: `ppptv-v2.vercel.app`
GitHub: `eugineous/ppptv-v2` on branch `main`
Working directory: `C:\Users\eugin\OneDrive\Pictures\ppptv-v2`
Dev server: `localhost:3002`

## Tech Stack

- **Framework**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS + custom CSS in `globals.css`
- **Fonts**: Bebas Neue (display), DM Sans (body) via `next/font/google`
- **AI**: Gemini 2.0 Flash via `GEMINI_API_KEY` env var
- **RSS**: `rss-parser` + custom `rss.ts` aggregator
- **Scraping**: Cheerio for article body, inline OG image scraping
- **Storage**: `/tmp/ppptv_articles.json` (Vercel serverless)
- **Deployment**: Vercel (auto-deploy on push to main)
- **Testing**: Vitest

## Content Categories (10 total — FIXED, do not change)

Celebrity, Music, TV & Film, Fashion, Events, East Africa, International, Awards, Comedy, Influencers

## Key Files

- `src/lib/rss.ts` — RSS fetching, AI rewrite, OG scraping, article store
- `src/components/NewsFeed.tsx` — Netflix-style homepage (hero + category rows)
- `src/app/layout.tsx` — Header (TMZ-style), Footer, global metadata
- `src/app/globals.css` — All custom CSS (Netflix UI, cards, animations)
- `src/app/news/[slug]/page.tsx` — Article detail page
- `src/components/BreakingTicker.tsx` — Breaking news ticker
- `src/app/trending/page.tsx` — Live trending dashboard
- `src/lib/hitTracker.ts` — Article view tracking
- `src/lib/trendingAggregator.ts` — Trending data aggregation

## Hard Rules

1. **Mobile-first** — every component must work on 320px screens
2. **Entertainment only** — no sports, politics, weather, crime
3. **No source attribution** in article bodies
4. **No "LIVE"** in ticker — always "BREAKING"
5. **No artists page** — it was deleted, never reference it
6. **No Unsplash fallbacks** if real OG images are available
7. **No external article links** — movies/articles always open at `/news/[slug]`
8. **No "Read more from original site"** links
9. **Homepage stays Netflix-style** — do not change the layout
10. **Images must be real** — use `maxresdefault` for YouTube thumbnails
11. **RSS feeds update every 5 minutes** (TTL = 300s)
12. **STORE_VERSION** in `rss.ts` must be bumped when category classifier changes

## Deploy Command

```powershell
npx vercel --prod --yes
```

## Environment Variables

- `GEMINI_API_KEY` — Gemini 2.0 Flash for AI article rewriting
- Set in `.env.local` and Vercel dashboard

## Category Colors

```
Celebrity:     #ec4899
Music:         #a855f7
TV & Film:     #FF007A
Fashion:       #f59e0b
Events:        #FF007A
East Africa:   #10b981
International: #6366f1
Awards:        #FF007A
Comedy:        #FF007A
Influencers:   #FF007A
```

## RSS Feed Architecture

- `FEEDS` array in `rss.ts` — 60+ feeds mapped to categories
- `classifyCategory()` — keyword-based classifier overrides feed category
- `EXCLUDE_KEYWORDS` — blocks sports/politics/weather content
- `buildArticleCache()` — fetches all feeds, dedupes, scrapes OG images
- `upsertStore()` — merges fresh + stored articles, max 2000
- `fetchArticles(limit)` — serves from cache, background refresh
- `scrapeOgImage()` — reads first 30KB of article page for og:image
- `rewriteWithAI()` — Gemini rewrites title + body in PPP TV voice

## Vercel Config

`vercel.json` sets `maxDuration: 60` for API routes that do heavy scraping.
