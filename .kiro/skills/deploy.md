# Deploy Skill

Pre-deployment checklist and deployment procedure for PPP TV Kenya.

## When to activate

Use before every production deployment to Vercel.

---

## Pre-Deploy Checklist

### TypeScript

- [ ] Run `getDiagnostics` on all changed files — zero errors
- [ ] No `any` types introduced without justification
- [ ] All new interfaces exported if used across files

### Next.js Rules

- [ ] No `'use client'` + `export const metadata` in same file
- [ ] No `Buffer`/`process.env` in client components
- [ ] No `window`/`document` outside `useEffect`
- [ ] All `dynamic()` imports for browser-only components have `{ ssr: false }`

### Content Rules

- [ ] Breaking ticker says "BREAKING" not "LIVE"
- [ ] No artists page references anywhere
- [ ] No sports/politics/weather content in categories
- [ ] No source attribution in article bodies
- [ ] No "Read more from original site" links

### Performance

- [ ] All images have `loading="lazy"` (except hero/LCP)
- [ ] All external fetches have `AbortSignal.timeout()`
- [ ] `next: { revalidate: 300 }` on feed fetches
- [ ] No blocking operations in server component render path

### Vercel Config

- [ ] `vercel.json` has `maxDuration: 60` for heavy API routes
- [ ] `GEMINI_API_KEY` set in Vercel dashboard environment variables
- [ ] No new environment variables needed that aren't set

### Links & Navigation

- [ ] New pages added to sitemap (`src/app/sitemap.ts`)
- [ ] New top-level pages added to mobile menu
- [ ] Footer links updated if needed
- [ ] All internal links use `/path` not `https://ppptv-website.vercel.app/path`

---

## Deploy Command

```powershell
npx vercel --prod --yes
```

Run from: `ppp-tv-site-final/`

---

## Post-Deploy Verification

Check these URLs after deploy:

1. `https://ppptv-v2.vercel.app/` — homepage loads, hero shows, category rows visible
2. `https://ppptv-v2.vercel.app/news` — news index loads with articles
3. `https://ppptv-v2.vercel.app/api/news?limit=5` — returns JSON with articles
4. `https://ppptv-v2.vercel.app/api/trends` — returns trending data
5. `https://ppptv-v2.vercel.app/trending` — trending dashboard loads
6. `https://ppptv-v2.vercel.app/api/rss` — returns valid RSS XML

---

## Common Deploy Failures & Fixes

| Error                                 | Cause                             | Fix                                                         |
| ------------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `Buffer is not defined`               | `Buffer` used in client component | Replace with `btoa`/`atob`                                  |
| `export const metadata` ignored       | `'use client'` in same file       | Remove `'use client'` or move metadata to parent            |
| Build timeout                         | Heavy computation at build time   | Move to runtime with `revalidate`                           |
| `Cannot read properties of undefined` | Dynamic import issue              | Add `{ ssr: false }` to `dynamic()`                         |
| 504 Gateway Timeout                   | API route too slow                | Add `maxDuration: 60` to `vercel.json`                      |
| Missing env var                       | Not set in Vercel dashboard       | Add via Vercel dashboard → Settings → Environment Variables |

---

## Rollback

If deploy breaks production:

```powershell
# List recent deployments
npx vercel ls --token $env:VERCEL_TOKEN

# Promote a previous deployment
npx vercel promote [deployment-url] --token $env:VERCEL_TOKEN
```
