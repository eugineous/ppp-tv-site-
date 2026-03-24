# Impeccable — Design Language Skill

Adapted from pbakaus/impeccable. A design vocabulary for precise frontend direction.

## When to activate
Use this skill when you need to audit, polish, or redesign any UI component on PPP TV.

---

## /audit
Run a technical quality check on the target component or page.

Check for:
- Accessibility: missing `alt`, no `aria-label` on icon buttons, insufficient color contrast
- Responsive: does it break at 320px? 375px? 768px?
- Performance: unoptimized images, blocking renders, missing `loading="lazy"`
- Consistency: does it match the PPP TV design system (black bg, pink accent, Bebas Neue)?
- Broken states: what happens with no data? Long titles? Missing images?

Output: numbered list of issues, severity (critical/warning/suggestion), and fix for each.

---

## /critique
UX design review — hierarchy, clarity, emotional resonance.

Evaluate:
- Visual hierarchy: does the eye know where to go first?
- Information architecture: is the content grouped logically?
- Emotional resonance: does it feel like PPP TV Kenya — bold, energetic, Kenyan?
- Friction points: what would confuse a first-time visitor?
- Mobile experience: is the tap target large enough? Is text readable without zooming?

Output: honest assessment with specific improvement suggestions.

---

## /polish
Final pass before shipping. Tighten everything.

Apply:
- Consistent spacing (stick to 4px grid)
- Typography hierarchy (Bebas Neue for display, DM Sans for body)
- Hover/focus states on all interactive elements
- Smooth transitions (`.15s` to `.3s ease`)
- Remove any leftover placeholder text or TODO comments
- Verify pink accent (`#FF007A`) is used consistently

---

## /distill
Strip to essence. Remove complexity.

Ask for each element: "Does this need to exist?"
- Remove decorative elements that don't add meaning
- Collapse redundant UI patterns
- Simplify copy (shorter labels, cleaner CTAs)
- Reduce nesting depth
- Merge similar components

---

## /bolder
Amplify a design that feels too timid or generic.

Apply:
- Increase headline size (Bebas Neue, go bigger)
- Stronger color contrast (pure white on black, not gray)
- More aggressive use of `#FF007A` accent
- Tighter letter-spacing on display text
- Remove soft shadows — use hard borders instead
- Increase font-weight on key labels to 900

---

## /quieter
Tone down something too loud or visually noisy.

Apply:
- Reduce accent color usage (pink should punch, not flood)
- Lower font-weight on secondary text
- Increase whitespace between elements
- Reduce animation intensity
- Mute secondary text to `#555` or `#666`

---

## /typeset
Fix font choices, hierarchy, and sizing.

Rules for PPP TV:
- Display/headlines: Bebas Neue, uppercase, `letter-spacing: .01em` to `.04em`
- Body: DM Sans, 15px base, `line-height: 1.5` to `1.9`
- Labels/badges: DM Sans, `font-weight: 900`, `font-size: .6rem`, uppercase
- Meta text: DM Sans, `font-size: .62rem`, `color: #555`
- Use `clamp()` for responsive headlines: `clamp(1.8rem, 5.5vw, 4.5rem)`
- Never use Inter, Arial, or system-ui as primary

---

## /arrange
Fix layout, spacing, and visual rhythm.

Apply:
- 4px baseline grid (all spacing multiples of 4)
- Card gaps: 6px mobile, 8px desktop
- Section padding: 1rem → 1.5rem → 2.5rem (mobile → sm → lg)
- Align items to a consistent horizontal baseline
- Fix any elements that feel "floating" or disconnected

---

## /animate
Add purposeful motion to a component.

PPP TV motion vocabulary:
- Crossfade: `transition: opacity 1.2s ease`
- Ken Burns: `scale(1.08) translate(-1%, -1%)` over 8s, `ease-out`
- Card hover: `scale(1.03)`, `.3s ease`
- Image zoom: `scale(1.08)` to `scale(1.1)`, `.4s ease`
- Entrance: `opacity 0 + translateY(4px)` → normal, `.25s ease`
- Pulse: `opacity 1 → .3 → 1`, `1.4s ease-in-out infinite` (for live dots)
- NEVER: bounce, elastic, spring animations

---

## /colorize
Introduce strategic use of category colors.

Category color palette:
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

Use category colors for: accent bars, badge backgrounds, "See all" links, hover states.
Use `#FF007A` as the universal fallback.

---

## /harden
Add error handling, edge cases, and resilience.

Check:
- Image `onError` fallback to category-specific Unsplash URL
- Empty state when no articles load (show skeleton, not blank)
- Long title truncation (`-webkit-line-clamp`)
- Missing excerpt fallback
- Network failure graceful degradation
- `AbortSignal.timeout()` on all fetch calls

---

## Anti-Patterns Reference

NEVER do these on PPP TV:

| Anti-pattern | Why | Fix |
|---|---|---|
| White/light backgrounds | Breaks dark aesthetic | Use `#000`, `#080808`, `#0f0f0f` |
| Inter as primary font | Generic AI slop | Use Bebas Neue + DM Sans |
| Gray text on pink bg | Unreadable | Use white `#fff` |
| Cards nested in cards | Visual noise | Flatten the hierarchy |
| Bounce/elastic easing | Feels dated | Use `ease`, `ease-out` |
| Pure gray (`#808080`) | Lifeless | Tint toward pink or cool |
| Unsplash if OG available | Fake images | Always try OG scrape first |
| `!important` everywhere | Specificity wars | Fix the selector |
| Inline styles for static values | Unmaintainable | Use CSS classes |
| `any` TypeScript type | Type safety loss | Use `unknown` + narrowing |
