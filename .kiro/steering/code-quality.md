---
inclusion: auto
---

# Code Quality & Security Standards

Adapted from oh-my-claudecode security review skill and agency-agents code review persona.

## TypeScript Standards

- Strict mode is on — no `any` types unless absolutely unavoidable
- Always type API response shapes with interfaces
- Use `unknown` + type narrowing instead of `any` for external data
- Prefer `const` over `let`, never `var`
- Arrow functions for callbacks, named functions for exports
- No unused imports or variables

## Next.js App Router Rules

- Server components by default — only add `'use client'` when you need:
  - `useState`, `useEffect`, `useRef`, `useCallback`
  - Browser APIs (`window`, `document`, `localStorage`)
  - Event handlers that can't be server actions
- `export const metadata` ONLY in server components (never in `'use client'` files)
- `dynamic(() => import(...), { ssr: false })` for browser-only components
- API routes: always handle errors, always return proper status codes
- `next: { revalidate: 300 }` on all external fetch calls

## Security Checklist

- No API keys in client-side code — use `NEXT_PUBLIC_` prefix only for truly public values
- `GEMINI_API_KEY` stays server-side only (no `NEXT_PUBLIC_` prefix)
- Sanitize all user inputs before using in queries or HTML
- `rel="noopener noreferrer"` on all `target="_blank"` links
- No `dangerouslySetInnerHTML` unless content is sanitized
- AbortSignal timeouts on ALL external fetch calls (prevent hanging)
- Rate limiting consideration for `/api/hit` endpoint

## Error Handling Patterns

```typescript
// Always use try/catch with specific fallbacks
try {
  const data = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!data.ok) return fallback;
  return await data.json();
} catch { return fallback; }  // never swallow errors silently in production paths
```

- Every API route must return a response even on error
- Client components must handle loading and error states
- Images must have `onError` fallback handlers
- RSS feeds: individual feed failures must not crash the whole batch

## Performance Rules

- `loading="lazy"` on all images below the fold
- `priority` only on hero/LCP images
- Avoid `useEffect` for data that can be server-fetched
- Debounce search inputs (300ms minimum)
- `setImmediate` for background work that shouldn't block response
- Keep API route response time under 10s (Vercel hobby limit is 60s but aim lower)

## CSS/Styling Rules

- Tailwind utility classes for layout and spacing
- Custom CSS in `globals.css` for complex animations and component-specific styles
- No inline `style` objects for static values — use CSS classes
- Inline `style` is acceptable for dynamic values (colors, widths from JS)
- Never use `!important` unless overriding third-party styles
- CSS custom properties (`--pink`, `--dark`, etc.) for theme values

## File Organization

```
src/
  app/          # Next.js pages and API routes
  components/   # Reusable React components
    trending/   # Trending dashboard components
  lib/          # Utility functions and data fetching
  data/         # Static data (hosts, shows, staff)
```

- One component per file
- Co-locate component-specific types in the same file
- Shared types go in the relevant `lib/` file
- No barrel files (`index.ts`) — import directly

## Git Commit Standards

- Imperative mood: "Fix hero image fallback" not "Fixed" or "Fixes"
- Scope prefix when helpful: "rss: bump STORE_VERSION to 3"
- Keep commits focused — one logical change per commit
- Never commit `.env.local` or secrets

## Testing

- Vitest for unit tests
- Test files: `*.test.ts` co-located with source
- Run tests: `npx vitest --run` (never `--watch` in CI)
- Property-based tests for data transformation functions (rss parsing, slug encoding)
