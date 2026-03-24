# Code Review Skill

Adapted from oh-my-claudecode code review agent. Thorough review before merging or deploying.

## When to activate
Use when: reviewing a PR, auditing a file after major changes, or before a production deploy.

---

## Review Framework

### Pass 1 — Correctness
Does the code do what it's supposed to do?

- Logic errors: off-by-one, wrong comparisons, incorrect conditionals
- Data flow: are values passed correctly between functions?
- Async/await: are all promises awaited? Any unhandled rejections?
- Edge cases: empty arrays, null/undefined, zero values, very long strings
- Type safety: are TypeScript types accurate and complete?

### Pass 2 — PPP TV Specific Rules
Does the code follow project conventions?

- [ ] No sports/politics/weather content slipping through `classifyCategory()`
- [ ] `STORE_VERSION` bumped if `CAT_KEYWORDS` or `EXCLUDE_KEYWORDS` changed
- [ ] `ROW_ORDER` in `NewsFeed.tsx` matches the 10 categories exactly
- [ ] No `'use client'` + `export const metadata` in same file
- [ ] No `Buffer` in client components
- [ ] All images have `onError` fallback handlers
- [ ] Breaking ticker says "BREAKING" not "LIVE"
- [ ] No artists page references
- [ ] No external article links (all go to `/news/[slug]`)

### Pass 3 — Performance
Will this cause slowdowns?

- Unnecessary re-renders: missing `useCallback`/`useMemo` on expensive operations
- Large bundle: heavy imports in client components
- Blocking renders: data fetching that should be server-side
- Memory leaks: `setInterval`/`setTimeout` without cleanup in `useEffect`
- Image optimization: missing `loading="lazy"`, no explicit dimensions

### Pass 4 — Maintainability
Will future-you understand this?

- Magic numbers: unexplained numeric literals (extract to named constants)
- Complex conditionals: can they be simplified or extracted?
- Duplicate code: same logic in 2+ places (extract to utility)
- Dead code: unused variables, imports, functions
- Comment quality: comments explain WHY, not WHAT

### Pass 5 — CSS/Styling
Does the visual output match PPP TV design system?

- Uses correct color tokens (`#FF007A`, `#000`, `#0f0f0f`)
- Bebas Neue for display text, DM Sans for body
- Responsive at all breakpoints (320px → 1280px+)
- Hover/focus states present on interactive elements
- No hardcoded pixel values that should be Tailwind classes

---

## Review Output Template

```
## Code Review: [filename]

### ✅ Looks Good
- [things done well]

### 🔴 Critical Issues
1. [file:line] — [issue] — [fix]

### 🟡 Warnings  
1. [file:line] — [issue] — [fix]

### 🔵 Suggestions
1. [file:line] — [suggestion]

### Summary
[1-2 sentence overall assessment]
```

---

## Quick Checks (run these mentally on every file)

```
1. Does it compile? (no TypeScript errors)
2. Does it render? (no React key errors, no missing props)
3. Does it work on mobile? (responsive CSS)
4. Does it fail gracefully? (error states, empty states)
5. Does it follow PPP TV conventions? (categories, colors, fonts)
```
