# New Feature Skill

Adapted from oh-my-claudecode team orchestration patterns. Structured workflow for adding new features to PPP TV.

## When to activate
Use when: adding a new page, new component, new API route, or new section to the site.

---

## Feature Planning Template

Before writing any code, answer these:

1. **What is it?** One sentence description.
2. **Where does it live?** Page path, component location, API route.
3. **What data does it need?** From RSS? Static? New API?
4. **Is it server or client?** Default to server. Add `'use client'` only if needed.
5. **Mobile-first?** How does it look at 320px?
6. **Does it affect existing features?** Check: layout, navigation, footer, sitemap.

---

## Implementation Checklist

### New Page (`src/app/[route]/page.tsx`)
- [ ] `export const metadata` with title, description, openGraph
- [ ] Server component by default
- [ ] Mobile-first layout
- [ ] Loading state (skeleton or Suspense)
- [ ] Error state (what shows if data fails?)
- [ ] Add to sitemap (`src/app/sitemap.ts`)
- [ ] Add to footer links (`src/app/layout.tsx` Footer component)
- [ ] Add to mobile menu (`src/components/MobileMenu.tsx`) if top-level

### New Component (`src/components/[Name].tsx`)
- [ ] TypeScript interface for all props
- [ ] `'use client'` only if using hooks or browser APIs
- [ ] Follows PPP TV design system (black bg, pink accent, Bebas Neue)
- [ ] Responsive at all breakpoints
- [ ] `onError` fallback for any images
- [ ] `aria-label` on icon-only buttons
- [ ] `focus-visible` ring on interactive elements

### New API Route (`src/app/api/[route]/route.ts`)
- [ ] `AbortSignal.timeout()` on all external fetches
- [ ] Returns proper HTTP status codes
- [ ] Error handling with fallback response
- [ ] Add `maxDuration` to `vercel.json` if route does heavy work
- [ ] No secrets in response body

### New RSS Category (rare — currently 10 fixed)
- [ ] Add to `FEEDS` array in `rss.ts`
- [ ] Add to `CAT_KEYWORDS` regex
- [ ] Add to `FALLBACK_IMG` map
- [ ] Add to `ROW_ORDER` in `NewsFeed.tsx`
- [ ] Add to `CAT_COLORS` in `NewsFeed.tsx`
- [ ] Add to news categories in `layout.tsx` Header
- [ ] Add to footer Browse column
- [ ] Bump `STORE_VERSION` in `rss.ts`

---

## PPP TV Page Template

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO.',
  openGraph: { title: 'Page Title', description: '...' },
};

export default function PageName() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page content */}
      </div>
    </div>
  );
}
```

## PPP TV Client Component Template

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Props {
  // define all props
}

export default function ComponentName({ }: Props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // browser-only logic here
  }, []);

  return (
    <div>
      {/* component */}
    </div>
  );
}
```

---

## Integration Points to Always Check

After adding any feature, verify these still work:

1. **Homepage** — does the new feature affect `NewsFeed.tsx` or `page.tsx`?
2. **Navigation** — should it appear in header nav or mobile menu?
3. **Footer** — should it appear in footer link columns?
4. **Sitemap** — add to `src/app/sitemap.ts`
5. **Breaking ticker** — does it need to show in the ticker?
6. **Search** — should articles from this feature be searchable?
7. **RSS feed** — should `/api/rss` include this content?
