# Security Review Skill

Adapted from oh-my-claudecode security review agent. Run this before any deployment.

## When to activate
Use when: preparing a deploy, adding new API routes, handling user input, or after any significant code change.

---

## Full Security Audit Checklist

### 1. Secrets & Credentials
- [ ] No API keys hardcoded in source files
- [ ] `GEMINI_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
- [ ] `.env.local` is in `.gitignore`
- [ ] No tokens or passwords in git history
- [ ] Vercel token not committed anywhere

### 2. Input Validation
- [ ] All URL parameters are validated before use
- [ ] Slug decoding (`decodeSlug`) handles malformed base64 gracefully
- [ ] Search query sanitized before use in filtering
- [ ] No user input passed directly to `eval()` or `dangerouslySetInnerHTML`

### 3. External Requests
- [ ] All `fetch()` calls have `AbortSignal.timeout()` (prevents hanging)
- [ ] RSS feed URLs are from the approved `FEEDS` list only
- [ ] OG scraping respects 4s timeout per URL
- [ ] No SSRF risk: user-supplied URLs are not fetched server-side

### 4. Client-Side Safety
- [ ] No `Buffer` or `process` references in `'use client'` components
- [ ] No sensitive data passed as props to client components
- [ ] `localStorage` access wrapped in try/catch (SSR safety)
- [ ] `window` access only inside `useEffect` or event handlers

### 5. Next.js Specific
- [ ] `export const metadata` only in server components
- [ ] Dynamic routes validate params before DB/store lookup
- [ ] API routes return proper HTTP status codes (200, 400, 404, 500)
- [ ] No sensitive data in `searchParams` (visible in URL)

### 6. Dependencies
- [ ] No `npm audit` critical vulnerabilities
- [ ] `rss-parser` input is from trusted feed URLs only
- [ ] `cheerio` used only for server-side scraping, not client rendering

### 7. Headers & Links
- [ ] All `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] No `javascript:` href values
- [ ] External redirects validated against allowlist

---

## Common PPP TV Vulnerabilities to Watch

```typescript
// ❌ VULNERABLE: Buffer in client component
'use client';
export function SlugEncoder({ url }: { url: string }) {
  return Buffer.from(url).toString('base64url'); // crashes in browser
}

// ✅ SAFE: Use btoa for client-side
export function SlugEncoder({ url }: { url: string }) {
  return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
```

```typescript
// ❌ VULNERABLE: No timeout on fetch
const data = await fetch(externalUrl);

// ✅ SAFE: Always timeout
const data = await fetch(externalUrl, {
  signal: AbortSignal.timeout(4000),
});
```

```typescript
// ❌ VULNERABLE: metadata in client component
'use client';
export const metadata = { title: 'Page' }; // silently ignored, no SEO

// ✅ SAFE: metadata only in server components
export const metadata = { title: 'Page' }; // no 'use client' directive
```

---

## Output Format

Report issues as:

**CRITICAL** — Must fix before deploy (data leak, crash risk, auth bypass)
**WARNING** — Should fix soon (degraded security, potential abuse)
**INFO** — Nice to have (hardening, best practice)

For each issue: file path, line number, description, fix.
