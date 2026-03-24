---
inclusion: auto
---

# PPP TV Frontend Design Standards

Adapted from pbakaus/impeccable — design language for AI coding agents.

## Core Aesthetic

PPP TV Kenya is a dark, high-energy entertainment news site. The design language is:
- **Black-first**: Background is always `#000` or `#080808`. Never white or light gray.
- **Pink accent**: `#FF007A` is the ONLY primary accent. Use it for borders, badges, hover states, CTAs.
- **Bebas Neue** for all display/headline text. DM Sans for body.
- **TMZ-meets-Netflix**: Bold editorial energy with cinematic card layouts.

## Typography Rules

- Headlines: Bebas Neue, uppercase, tight letter-spacing (`.01em` to `.04em`)
- Body: DM Sans, 15px base, `line-height: 1.5`
- Category labels: `font-size: .6rem`, `font-weight: 900`, `letter-spacing: .08em`, uppercase
- Never use Inter, Arial, or system-ui as primary fonts
- Never use gray text on colored backgrounds — use white or near-white
- Type scale: clamp() for responsive headlines, e.g. `clamp(1.8rem, 5.5vw, 4.5rem)`

## Color Rules

- Pure black backgrounds: `#000`, `#080808`, `#0a0a0a`, `#0f0f0f`
- Borders: `#1a1a1a`, `#141414`, `#111`
- Muted text: `#555`, `#666`, `#888`
- Body text: `#d4d4d4`, `#bbb`, `#aaa`
- NEVER use pure gray (`#808080`) — always tint toward pink or cool
- Category colors: Music `#a855f7`, Celebrity `#ec4899`, Fashion `#f59e0b`, East Africa `#10b981`, International `#6366f1`
- Gradients: always dark-to-transparent, never light

## Spacing System

- Base unit: 4px (0.25rem)
- Card gaps: 6px mobile, 8px desktop
- Section padding: 1rem mobile → 1.5rem sm → 2.5rem lg
- Never use arbitrary pixel values — stick to Tailwind scale or CSS variables

## Anti-Patterns — NEVER DO THESE

- No white or light backgrounds anywhere on the site
- No cards nested inside cards
- No bounce/elastic CSS animations (use `ease`, `ease-out`, `cubic-bezier`)
- No purple gradients or generic "AI slop" color schemes
- No Inter font as primary
- No gray text on pink/colored backgrounds
- No Unsplash placeholder images if real OG images are available
- No "Read more from original site" links in articles
- No sports, politics, weather content — this is entertainment only
- No source attribution in article bodies
- No "LIVE" in the breaking ticker — always "BREAKING"
- No artists page references (deleted)

## Component Patterns

### Cards
- Always 16:9 aspect ratio for images
- Top accent bar (2-3px, category color) on hover
- Scale transform on hover: `scale(1.03)` max
- Image zoom on hover: `scale(1.08)` to `scale(1.1)`
- Dark overlay gradient on hover

### Buttons
- Primary: white bg, black text, `font-weight: 900`, uppercase
- Secondary: `rgba(255,255,255,.15)` bg, white text, `backdrop-filter: blur(4px)`
- Hover: opacity `.85` for primary, brighter bg for secondary
- Border-radius: `3px` (sharp, not pill)

### Badges
- `font-size: .6rem`, `font-weight: 900`, `letter-spacing: .08em`
- `border-radius: 2px` (very sharp)
- Breaking badge: `#ef4444` red, animated pulse

### Navigation
- Sticky, `z-index: 50`, black bg, `border-bottom: 3px solid #FF007A`
- Height: `h-14` (56px)
- Hover state: full pink background fill on nav items
- Dropdown: `border-top: 2px solid #FF007A`, dark bg

## Motion Design

- Hero crossfade: `transition: opacity 1.2s ease`
- Ken Burns: `scale(1.08) translate(-1%, -1%)` over 8s, `ease-out`
- Card hover: `.3s ease` for transforms, `.4s ease` for image zoom
- Preview card entrance: `scale(.95) translateY(6px)` → normal, `.18s ease`
- Progress bar: `.08s linear` for smooth fill
- Page entrance: `fadeIn .25s ease` (opacity + 4px translateY)
- Ticker: `linear` animation, pause on hover

## Responsive Breakpoints

- Mobile-first is a HARD requirement
- `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Card columns: 2 mobile → 3 sm → 4 md → 5 lg → 6 xl
- Hero height: `88vh`, min `500px`, max `960px`
- Trending panel: desktop only (`lg:` breakpoint)
- Thumbnail strip: `xl:` only

## Accessibility

- All interactive elements need `focus-visible` ring: `2px solid #FF007A`
- Images need `alt` attributes (empty `alt=""` for decorative)
- `aria-label` on icon-only buttons
- `aria-label` on nav landmarks
- Color contrast: body text `#d4d4d4` on `#000` passes AA

## Design Commands (use these phrases when requesting changes)

- `/polish` — final pass, tighten spacing, fix inconsistencies
- `/audit` — check a11y, responsive, performance issues
- `/bolder` — amplify a design that feels too timid
- `/quieter` — tone down something too loud
- `/distill` — strip to essence, remove complexity
- `/typeset` — fix font choices, hierarchy, sizing
- `/arrange` — fix layout, spacing, visual rhythm
- `/animate` — add purposeful motion to a component
- `/colorize` — introduce strategic use of category colors
