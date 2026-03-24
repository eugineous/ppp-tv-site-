# RSS & Content Pipeline Debug Skill

Specialized skill for diagnosing and fixing issues in the PPP TV content pipeline.

## When to activate
Use when: articles aren't loading, wrong categories showing, images missing, AI rewrite failing, or store corruption.

---

## Diagnostic Checklist

### Articles Not Loading

1. **Check in-memory cache**
   - Is `articleCache` populated? Check `fetchArticles()` in `rss.ts`
   - Is TTL expired? TTL = 5 minutes (`5 * 60 * 1000`)
   - Is `refreshing` stuck at `true`? (race condition)

2. **Check persistent store**
   - Does `/tmp/ppptv_articles.json` exist on Vercel? (ephemeral — resets on cold start)
   - Is `STORE_VERSION` matching? Current version: check `rss.ts`
   - Is the store corrupted? Try bumping `STORE_VERSION` to force a fresh fetch

3. **Check feed fetching**
   - Are individual feeds timing out? (3s timeout per feed)
   - Is the 8s batch timeout too tight? Check `buildArticleCache()`
   - Are feed URLs still valid? Test one manually

4. **Check deduplication**
   - Is `seen` set working correctly? (dedupes by first 60 chars of title)
   - Are articles being filtered by `classifyCategory()` returning `__exclude__`?

### Wrong Categories

1. Check `classifyCategory()` — is the keyword regex matching correctly?
2. Check `EXCLUDE_KEYWORDS` — is it too aggressive and blocking valid content?
3. Check `CAT_KEYWORDS` — does the article text actually contain the keywords?
4. Remember: classifier only overrides if `bestScore >= 2` (2+ keyword matches)
5. **Fix**: bump `STORE_VERSION` after any classifier change to invalidate old store

### Images Missing / Showing Unsplash Fallbacks

1. **RSS image extraction** — check `extractImage()`:
   - `media:content` → `$['@']?.url`
   - `media:thumbnail` → `$['@']?.url`
   - `enclosure` → `.url` with image extension
   - `content:encoded` → first `<img src=...>`

2. **OG scraping** — check `scrapeOgImage()`:
   - Is the article URL accessible? (some sites block bots)
   - Is the 4s timeout too tight for slow sites?
   - Is `og:image` in the first 30KB of the page?

3. **YouTube thumbnails** — check `upgradeYtImage()`:
   - Should upgrade `hqdefault.jpg` → `maxresdefault.jpg`
   - Pattern: `i.ytimg.com/vi/[ID]/`

4. **Background enrichment** — articles beyond first 120 get enriched async:
   - Check `setImmediate` block in `buildArticleCache()`
   - Unsplash ratio check: if >50% are Unsplash, forces live fetch

### AI Rewrite Not Working

1. Check `GEMINI_API_KEY` is set in `.env.local` and Vercel dashboard
2. Check `rewriteWithAI()` — is the 8s timeout being hit?
3. Check Gemini response format — expects `{"title":"...","body":"..."}`
4. Check `raw.replace(/\`\`\`json|\`\`\`/g, '')` — is Gemini wrapping in code blocks?
5. Fallback: if AI fails, returns original `title` and `body` unchanged

### Store Corruption Recovery

```typescript
// Force store reset by bumping STORE_VERSION in rss.ts:
const STORE_VERSION = 3; // was 2 — increment to invalidate

// Or manually clear via API (if you add a /api/revalidate route):
// POST /api/revalidate with secret token
```

---

## Feed Health Check

Run this mentally for any new feed added to `FEEDS`:

1. Is the URL a valid RSS/Atom feed? (not a webpage)
2. Does it have `<item>` elements with `<link>` and `<title>`?
3. Does it have `<media:content>` or `<enclosure>` for images?
4. Is it entertainment-only, or does it need `classifyCategory()` to filter?
5. Is it already in the list under a different category? (duplicate feed = duplicate articles)

---

## Category System Reference

```
10 valid categories (FIXED — do not add or remove):
Celebrity | Music | TV & Film | Fashion | Events
East Africa | International | Awards | Comedy | Influencers

ROW_ORDER in NewsFeed.tsx must match exactly.
FALLBACK_IMG in rss.ts must have an entry for each.
CAT_KEYWORDS must have a regex for each.
```

---

## Performance Tuning

| Timeout | Location | Current | Notes |
|---|---|---|---|
| Per-feed fetch | `fetchOneFeed` | 3s | Increase if feeds are slow |
| Batch total | `buildArticleCache` | 8s | Hard cap for Vercel |
| OG scrape inline | `buildArticleCache` | 8s | First 120 articles |
| OG scrape per URL | `scrapeOgImage` | 4s | Per article |
| AI rewrite | `rewriteWithAI` | 8s | Per article |
| Trends fetch | `fetchTrends` | 4s | Google Trends RSS |
| Article body scrape | `scrapeBody` | 7s | Full page fetch |
