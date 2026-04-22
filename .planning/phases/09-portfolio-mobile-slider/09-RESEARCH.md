# Phase 9: Portfolio Mobile Slider — Research

**Researched:** 2026-04-22
**Domain:** CSS responsive layout, GSAP Observer touch gestures, React component composition
**Confidence:** HIGH — all findings are from direct source-code inspection of the live codebase

---

## Summary

Phase 9 adds mobile and tablet responsive behaviour to the `/portfolio` page. The primary deliverables are: (1) a comprehensive `@media (max-width: 767px)` block in `PortfolioPage.css`, (2) a new `DotNav.tsx` component rendered inside the chrome div, and (3) GSAP Observer wiring for touch swipe — which is **not yet implemented** in the current codebase.

The most important discovery from source-code analysis is that `PortfolioPage.tsx` has **no touch/swipe input at all** today. The UI-SPEC states "Observer is already active" but that refers to the design intent from Phase 2 (the main slider app), not the portfolio page. The portfolio page was built in Phase 8 with keyboard + button navigation only. Phase 9 must therefore both install GSAP Observer for the first time on this page AND add the mobile CSS. The planner must treat GSAP Observer as a new addition, not a config tweak.

The existing `@media (max-width: 900px)` rule in PortfolioPage.css already sets `grid-template-columns: 1fr !important` and hides `.year-nav` — but this is a rough, untested stub with aggressive `!important` overrides that will conflict with the fine-grained mobile CSS specified in the UI-SPEC. Phase 9 must supersede this rule carefully.

**Primary recommendation:** Plan in two waves — Wave 1 delivers all mobile CSS (layout, chrome condensation, DotNav) with zero JS changes; Wave 2 adds GSAP Observer + tolerance, touch guard, swipe affordance hint, and tablet breakpoint. This matches the two planned PLAN files (09-01, 09-02) in the roadmap.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MOB-01 | On mobile (≤ 767px), all slides render single-column stacked — image panel above, text panel below | `.project` grid must switch to `grid-template-columns: 1fr` with `.right { order: 1 }` and `.left { order: 2 }`. The existing `@media (max-width: 900px)` already does this for `.project` but uses `!important` and needs refinement for cover/outro. |
| MOB-02 | Dot indicator row replaces YearNav on mobile — one dot per slide, tapping navigates, touch targets ≥ 44px | Requires new `DotNav.tsx` component. `usePortfolioStore` exposes `currentIndex` and `setIndex`. `go()` lives in `PortfolioPage.tsx` and must be passed as `onGo` prop. YearNav is hidden via CSS `display: none`. |
| MOB-03 | Horizontal swipe gestures navigate slides without triggering vertical text-panel scroll | GSAP Observer **does not exist yet** in `PortfolioPage.tsx`. Must be added fresh. `.left` panel currently has `overflow: hidden` — must change to `overflow-y: auto` on mobile with `touch-action: pan-y`. |
| MOB-04 | Chrome condensed on mobile: logo 48px, topmeta availability + contact only, nav arrows bottom-right, progress bar condensed | All CSS-only changes to `.logo img`, `.topmeta`, `.bottom`, `.nav`. The `.cta` pill must be hidden on mobile; the `Contact` button and availability dot must remain visible. |
| MOB-05 | Desktop layout (≥ 1024px) shows zero visual regressions | All new rules scoped under `@media (max-width: 767px)` and `@media (768px–1023px)`. The existing `@media (max-width: 900px)` rule must be either replaced or narrowed to avoid bleeding into the new breakpoint system. |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Responsive layout (single-column slides) | Browser / Client (CSS) | — | Pure CSS media queries; no JS needed for layout reflow |
| DotNav component (render) | Browser / Client (React) | — | New React component, CSS-only visibility on mobile |
| Touch swipe navigation | Browser / Client (GSAP Observer) | — | Observer handles unified touch/pointer/wheel; calls existing `go()` |
| Touch-action guard (.left panel) | Browser / Client (CSS) | — | `touch-action: pan-y` is a CSS property; prevents scroll hijack |
| Swipe affordance hint | Browser / Client (GSAP) | — | `gsap.fromTo()` animation on a fixed DOM element, localStorage gate |
| Chrome condensation (CSS) | Browser / Client (CSS) | — | Repositioning existing elements via media queries |
| Observer tolerance config | Browser / Client (GSAP) | — | Config option on `Observer.create()` call in PortfolioPage.tsx |

---

## Critical Pre-Research Findings

### Finding 1: GSAP Observer is NOT present in PortfolioPage.tsx [VERIFIED: source grep]

The current `PortfolioPage.tsx` (Phase 8 deliverable) contains:
- `useEffect` for keyboard navigation (`ArrowLeft`, `ArrowRight`)
- `useCallback go()` for GSAP opacity transitions
- No import of `gsap/Observer`
- No `Observer.create()` call anywhere

The test file `__tests__/PortfolioPage.test.tsx` mocks `gsap/Observer` (because it was planned as a Phase 8 deliverable that was deferred), but the actual implementation was never written. Phase 9 must add Observer from scratch.

**Impact for planning:** The 09-02 plan is NOT just a "tolerance tweak" — it is a full GSAP Observer installation on the portfolio page.

### Finding 2: Existing @media (max-width: 900px) rule — conflict risk [VERIFIED: PortfolioPage.css line 964]

```css
@media (max-width: 900px) {
  [data-portfolio] .cover,
  [data-portfolio] .project,
  [data-portfolio] .outro {
    grid-template-columns: 1fr !important;
    padding: 100px 24px 100px !important;
  }
  [data-portfolio] .topmeta,
  [data-portfolio] .logo {
    font-size: 10px;
  }
  [data-portfolio] .year-nav {
    display: none;
  }
}
```

This rule fires at 900px — wider than the UI-SPEC's 767px mobile breakpoint and 1023px tablet breakpoint. It uses `!important` overrides that will fight the new mobile-specific rules. The planner must decide whether to:
- Keep this as a catch-all and layer new mobile rules on top (complex specificity)
- Replace this entirely with the two-breakpoint system from the UI-SPEC (cleaner)

**Recommendation:** Replace the `900px` rule entirely. The new breakpoint system (`767px` mobile, `768–1023px` tablet) is more precise and the `!important` overrides are unnecessary if the rules are in media queries (media queries already have higher specificity when the condition matches).

### Finding 3: .left panel has overflow: hidden — must change for mobile [VERIFIED: PortfolioPage.css line 613]

```css
[data-portfolio] .project .left {
  padding: 130px 60px 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;  /* ← this blocks mobile scroll and touch-action */
}
```

On mobile, `.left` must be `overflow-y: auto` to allow content scroll. The existing `overflow: hidden` must be overridden in the mobile media query.

### Finding 4: .metric-chips is inside .right, absolutely positioned [VERIFIED: PortfolioPage.css line 702, ProjectSlide.tsx line 64]

```css
[data-portfolio] .project .metric-chips {
  position: absolute;
  left: 30px;
  top: 60px;
  /* ... */
}
```

And in `ProjectSlide.tsx`:
```tsx
<div className="right">
  <div className="img-wrap">...</div>
  <div className="metric-chips">...</div>   {/* inside .right */}
  <div className="img-caption">...</div>
</div>
```

The UI-SPEC wants metric chips to become a horizontal scrollable strip below the image on mobile. Since `.metric-chips` is a sibling of `.img-wrap` inside `.right`, CSS alone can reposition it — no JSX changes needed. On mobile: override `.metric-chips` to `position: static`, `flex-direction: row`, `overflow-x: auto` within `.right` which itself switches from `position: relative; overflow: hidden` to `position: relative; overflow: visible` on mobile.

**However**, there is a subtlety: `.right` has `position: relative; overflow: hidden` at desktop. If we make `.right` `overflow: visible` on mobile to show the chips strip below the image boundary, we need to ensure the `.img-wrap` still clips correctly. The solution is to keep `overflow: hidden` on `.img-wrap` directly and allow `.right` to overflow for the chips strip.

### Finding 5: .project-num is position: absolute [VERIFIED: PortfolioPage.css line 615]

```css
[data-portfolio] .project .project-num {
  position: absolute;
  top: 90px;
  left: 60px;
  /* ... */
}
```

On mobile, `.project-num` must be `position: static` and rendered as the first child in flow inside `.left`. The UI-SPEC confirms this. Since it is already the first child rendered in `ProjectSlide.tsx` (line 17), setting `position: static` in the mobile media query is sufficient.

### Finding 6: YearNav has JS logic but is purely CSS-hideable [VERIFIED: YearNav.tsx]

`YearNav.tsx` computes `years`, `isOutro`, `isCover`, and renders tabs/dots. On mobile, it is hidden via `display: none` — the CSS already does this in the existing `900px` breakpoint. Setting `display: none` in the new `767px` breakpoint is safe: the component continues to render in the DOM (no unmounting), but its event handlers fire only when user clicks visible elements, which don't exist when hidden. No JS guard needed.

### Finding 7: ProgressBar DOM structure [VERIFIED: ProgressBar.tsx]

```tsx
<div className="bottom">           // ← CSS class: .bottom
  <div className="counter">
    <span className="big">{current+1}</span>
    &nbsp;/&nbsp;{total}
    &nbsp;&nbsp;
    <span>{currentTitle}</span>     // ← slide title text — hide on mobile
  </div>
  <div className="progress">
    <div className="fill" />        // ← progress line fill
    <div className="ticks">...</div>
  </div>
</div>
```

On mobile, hide `currentTitle` text but show counter fraction + progress line. The title is a raw text node inside `.counter` — there is no wrapping element around it. To hide the title text on mobile, it needs either: (a) a wrapper element added to ProgressBar.tsx, or (b) CSS to hide the entire `.counter` and add a pseudo-element replacement. **Option (a) is cleaner — add `<span className="slide-title">{currentTitle}</span>` in ProgressBar.tsx** so it can be hidden with CSS.

### Finding 8: usePortfolioStore API [VERIFIED: usePortfolioStore.ts]

```ts
interface PortfolioStore {
  currentIndex: number;
  activeYear: string;
  setIndex: (n: number) => void;
  setActiveYear: (yr: string) => void;
}
```

DotNav will need `currentIndex` and `onGo` — the `go()` function from `PortfolioPage.tsx`. Since `go()` is a `useCallback` inside `PortfolioPage`, it must be passed as a prop to `DotNav` (same pattern as `onGo` prop on `YearNav`).

### Finding 9: go() function signature [VERIFIED: PortfolioPage.tsx line 35]

```ts
const go = useCallback((n: number, force = false) => { ... }, [...]);
```

`go(index)` accepts a 0-based slide index (0 = cover, 1..N = projects, N+1 = outro). `force` is optional (default `false`). DotNav calls `go(dotIndex)` directly.

### Finding 10: The "Contact" button in .topmeta [VERIFIED: PortfolioPage.tsx line 128]

```tsx
<button
  onClick={() => go(slides.length - 1)}
  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
>
  Contact
</button>
```

This button has inline styles that will need to be accounted for when setting mobile touch target sizes. The `min-height: 44px` padding requirement from the UI-SPEC must be added via a mobile CSS class, but the inline `style` prop means it cannot be overridden by CSS. **The planner should note that this button needs `className="contact-btn"` added** so the mobile media query can target it, OR the inline style can be removed and the default look preserved via CSS class.

---

## Standard Stack

### Core (no new packages)
| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| gsap | Already installed | GSAP Observer for touch/swipe | `gsap/Observer` subpackage — already in package.json [VERIFIED: test mock confirms it] |
| React | 18 | DotNav component | No new version needed |
| CSS (vanilla) | — | All mobile layout rules | No preprocessor |

**No new npm packages.** [VERIFIED: UI-SPEC Registry Safety section]

### GSAP Observer API (key parameters for Phase 9)

From the MEMORY.md architecture notes and Phase 2 established patterns:

```ts
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

Observer.create({
  target: window,            // or rootRef.current
  type: 'wheel,touch,pointer',
  tolerance: 40,             // minimum px drag before triggering — MOB-03 requires ≥ 40
  onUp: () => go(store.currentIndex - 1),
  onDown: () => go(store.currentIndex + 1),
  preventDefault: true,      // prevents native scroll while swiping slides
});
```

**Critical:** `preventDefault: true` on the Observer will block scroll inside `.left` panel unless `touch-action: pan-y` is set on `.left` (the UI-SPEC's MOB-03 solution). The two work together: `touch-action: pan-y` tells the browser to handle vertical pan natively (bypassing the Observer), while the Observer catches horizontal drags.

**Observer scope:** Must be created in a `useEffect` with empty deps on mount, stored in a ref (`observerRef`), and `.kill()` called in cleanup. This matches the Phase 2 pattern from STATE.md decisions.

---

## Architecture Patterns

### System Architecture Diagram

```
User gesture (touch/mouse/wheel)
        |
        v
  GSAP Observer (window target)
  [tolerance: 40px, type: 'wheel,touch,pointer']
        |
        |--onDown()--> go(currentIndex + 1)
        |--onUp()---> go(currentIndex - 1)
        |
        v
  go(n: number) — in PortfolioPage.tsx
  [busyRef guard + GSAP opacity crossfade]
        |
        v
  slideRefs.current[n] — direct DOM refs
  [gsap.to(opacity: 1)] [gsap.to(opacity: 0) on prev]
        |
        v
  usePortfolioStore.setIndex(n)
  [triggers re-render of DotNav, YearNav, ProgressBar]
        |
        v
  DotNav [mobile only] / YearNav [desktop only]
  [active dot updated via currentIndex prop]
```

### Mobile CSS Structure (in PortfolioPage.css)

```css
/* ─────────── MOBILE (≤ 767px) ─────────── */
@media (max-width: 767px) {
  /* Chrome: logo, topmeta, .bottom, .nav */
  /* ProjectSlide: .project, .left, .right, .metric-chips */
  /* CoverSlide: .cover, .cover-globe, .cover-left, h1, .stats */
  /* OutroSlide: .outro, .right-col, .contact, .socials */
  /* DotNav: .dot-nav (shown) */
  /* YearNav: .year-nav { display: none } */
}

/* ─────────── TABLET (768px–1023px) ─────────── */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Condensed split-screen: reduced columns, larger touch targets */
}

/* ─────────── DESKTOP (≥ 1024px) ─────────── */
/* No new rules — existing styles are desktop-first */
```

**Replace** the existing `@media (max-width: 900px)` block entirely. Its three jobs are covered by the new system:
- `grid-template-columns: 1fr !important` → handled by `@media (max-width: 767px)` (mobile) and `@media (768px–1023px)` (tablet)
- `display: none` on `.year-nav` → handled in `@media (max-width: 767px)`
- Font-size adjustments → superseded by more precise mobile rules

### DotNav Component Structure

```tsx
// src/pages/portfolio/components/DotNav.tsx
interface DotNavProps {
  totalCount: number;          // slides.length (cover + projects + outro)
  slides: PortfolioSlideData[]; // project slides only (for aria labels)
  currentIndex: number;        // 0-based from usePortfolioStore
  onGo: (index: number) => void; // go() from PortfolioPage
}

// Renders: div.dot-nav > button[role="tab"] × totalCount
// Hidden on desktop via CSS: @media (min-width: 1024px) { .dot-nav { display: none } }
// Shown on mobile via: @media (max-width: 767px) { .dot-nav { display: flex } }
```

```tsx
// Insertion point in PortfolioPage.tsx — inside .chrome div, after ProgressBar:
<DotNav
  totalCount={slides.length}
  slides={adaptedProjects}
  currentIndex={store.currentIndex}
  onGo={go}
/>
```

### GSAP Observer Installation in PortfolioPage.tsx

```tsx
// New import (add to existing gsap imports):
import { Observer } from 'gsap/Observer';

// In PortfolioPage() body, after busyRef:
const observerRef = useRef<ReturnType<typeof Observer.create> | null>(null);

// New useEffect (mount only):
useEffect(() => {
  gsap.registerPlugin(Observer);
  observerRef.current = Observer.create({
    target: window,
    type: 'wheel,touch,pointer',
    tolerance: 40,
    onUp: () => go(store.currentIndex - 1),   // ← swipe right = prev
    onDown: () => go(store.currentIndex + 1), // ← swipe left = next
    preventDefault: true,
  });
  return () => { observerRef.current?.kill(); };
}, []); // eslint-disable-line react-hooks/exhaustive-deps — go() is stable via useCallback
```

**Closure risk:** `go` references `store.currentIndex` through `store` (Zustand). Since `go` is a `useCallback` with `[slides, store, setSearchParams]` deps, and `store` is the whole store object (not a primitive), the Observer's callbacks may have stale `store.currentIndex`. **Safe pattern:** use `usePortfolioStore.getState().currentIndex` inside the Observer callbacks instead of the `store` closure variable — this is the same pattern already used in Phase 5 (`openCase guard reads useSliderStore.getState().isAnimating directly`).

```tsx
onUp: () => go(usePortfolioStore.getState().currentIndex - 1),
onDown: () => go(usePortfolioStore.getState().currentIndex + 1),
```

### Swipe Affordance Hint

```tsx
// New ref in PortfolioPage:
const hintRef = useRef<HTMLDivElement>(null);

// New useEffect after Observer useEffect:
useEffect(() => {
  if (localStorage.getItem('portfolio-swipe-seen')) return;
  // Small delay to let initial slide render
  const timer = setTimeout(() => {
    if (!hintRef.current) return;
    gsap.fromTo(hintRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.5,
        onComplete: () => {
          gsap.to(hintRef.current, { opacity: 0, duration: 0.5, delay: 2 });
        }
      }
    );
  }, 800);

  // Dismiss on first gesture
  const dismiss = () => {
    localStorage.setItem('portfolio-swipe-seen', '1');
    if (hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
    window.removeEventListener('touchstart', dismiss);
    window.removeEventListener('mousedown', dismiss);
  };
  window.addEventListener('touchstart', dismiss, { once: true });
  window.addEventListener('mousedown', dismiss, { once: true });
  return () => { clearTimeout(timer); window.removeEventListener('touchstart', dismiss); };
}, []);

// In JSX — at the end of the [data-portfolio] div, before TweaksPanel:
<div ref={hintRef} className="swipe-hint" aria-hidden="true">
  Glissez →
</div>
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Touch/swipe gesture detection | Custom touchstart/touchend delta math | GSAP Observer | Observer handles tolerance, velocity, cancellation, and unified pointer/touch/wheel — 3 event systems unified |
| Reduced-motion guard for swipe animations | Custom `matchMedia` check | Existing `useReducedMotion` hook already in Phase 4 codebase | Already established pattern |
| Mobile detection for JS branching | `navigator.userAgent` sniffing | CSS `@media` queries + `touch-action` CSS | CSS handles layout; Observer fires on all devices but only swipe gestures trigger navigation |

---

## Common Pitfalls

### Pitfall 1: Observer Stale Closure on currentIndex
**What goes wrong:** `Observer.create({ onDown: () => go(store.currentIndex + 1) })` — if `store.currentIndex` is captured at Observer creation time, the index is always 0 regardless of which slide is active. Every swipe navigates to slide 1.
**Why it happens:** `useEffect([], [])` runs once — the closure captures the initial value of `store.currentIndex`.
**How to avoid:** Use `usePortfolioStore.getState().currentIndex` inside the callback (reads live store state at call time, not at creation time).
**Warning signs:** Swiping always returns to slide 1, or wraps incorrectly.

### Pitfall 2: overflow: hidden on .left Blocks touch-action
**What goes wrong:** Even with `touch-action: pan-y` on `.left`, if a parent has `overflow: hidden`, vertical pan gestures inside `.left` may still be caught by the Observer.
**Why it happens:** The browser's scroll candidate algorithm only promotes elements that can actually scroll (have `overflow: auto` or `scroll`).
**How to avoid:** Set `overflow-y: auto` on `.left` inside the mobile media query (not just `touch-action: pan-y`). The two must be set together.
**Warning signs:** Vertical scroll inside long project text panels triggers slide navigation instead of scrolling.

### Pitfall 3: !important from the 900px breakpoint Overrides Mobile Rules
**What goes wrong:** New `@media (max-width: 767px)` rules for `padding` on `.project` are silently ignored because the existing `900px` rule uses `!important` and has a wider range.
**Why it happens:** `@media (max-width: 900px)` still fires at 375px — both blocks apply, and `!important` wins regardless of source order.
**How to avoid:** Delete the existing `900px` rule and replace with the new breakpoint system. Do not leave both in place.
**Warning signs:** Mobile padding is still `100px 24px 100px` instead of the spec'd `24px 16px 80px`.

### Pitfall 4: DotNav Hidden on Desktop via CSS, but Still Receives Keyboard Focus
**What goes wrong:** `display: none` correctly hides DotNav on desktop, but if `display: none` is applied with a class toggle instead of a media query, React's event binding still fires.
**Why it happens:** N/A if using a pure CSS media query — `display: none` removes elements from accessibility tree and prevents focus. Using a JS `window.innerWidth` check instead would leave DOM events active.
**How to avoid:** Hide DotNav exclusively via CSS `@media (min-width: 1024px) { .dot-nav { display: none } }` — no JS conditional rendering.

### Pitfall 5: metric-chips Horizontal Scroll Hidden by .right overflow: hidden
**What goes wrong:** `.right` has `overflow: hidden` at desktop — on mobile, when `.metric-chips` becomes a horizontal scrollable row, the scroll is clipped.
**Why it happens:** The mobile rule changes `.metric-chips` to `overflow-x: auto` but the parent `.right` still clips.
**How to avoid:** On mobile, set `.project .right { overflow: visible }` OR keep overflow hidden but move chips out of `.right` using CSS absolute positioning reset to a flow-adjacent position via `grid` restructuring.
**Recommended approach:** The cleanest solution is `overflow: visible` on `.right` on mobile, with `overflow: hidden` kept on `.img-wrap` directly (which already has it via `[data-portfolio] .project .right .img-wrap { overflow: hidden }`).

### Pitfall 6: Observer preventDefault Blocks Pull-to-Refresh on iOS
**What goes wrong:** `preventDefault: true` on the Observer prevents the browser's native pull-to-refresh gesture on iOS Safari.
**Why it happens:** GSAP Observer calls `e.preventDefault()` on touch events, which blocks all native touch behaviors including pull-to-refresh.
**How to avoid:** This is acceptable for a full-screen portfolio experience (same as the Phase 2 main slider app). If it becomes an issue, use `preventDefault: false` and rely purely on `touch-action: pan-y` on `.left` to differentiate scroll from swipe.
**Warning signs:** Users cannot pull-to-refresh on iOS. Not a blocker — the portfolio is not a scroll-based app.

### Pitfall 7: mix-blend-mode: difference on .topmeta Breaks on Dark Mobile Backgrounds
**What goes wrong:** `.topmeta` already has `mix-blend-mode: difference` which inverts colors against the background. On mobile, this may produce white text on navy backgrounds (desired) but black text on the blue-tinted `.left` panel overlap area.
**Why it happens:** The fixed chrome overlaps the slide content — blend mode produces unpredictable results when the underlying content changes.
**How to avoid:** The UI-SPEC requires keeping existing blend modes. If there are contrast issues, override `mix-blend-mode: normal` on `.topmeta` in the mobile breakpoint and use `color: var(--ink-dim)` directly.

---

## Code Examples

### Pattern 1: Mobile Grid Reorder for ProjectSlide
```css
/* Source: UI-SPEC § ProjectSlide — Mobile Layout */
@media (max-width: 767px) {
  [data-portfolio] .project {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    overflow-y: auto;   /* allow slide to scroll on short viewports */
  }
  [data-portfolio] .project .right {
    order: 1;
    position: relative;
    height: clamp(200px, 55vw, 280px);
    overflow: visible;  /* allow metric-chips to flow below */
    border-radius: 0;
  }
  [data-portfolio] .project .right .img-wrap {
    inset: 0;           /* remove 30px margins */
    border-radius: 0;
  }
  [data-portfolio] .project .left {
    order: 2;
    padding: 24px 16px 80px;
    overflow-y: auto;
    overflow-x: hidden;
    justify-content: flex-start;
  }
  [data-portfolio] .project .project-num {
    position: static;   /* remove absolute positioning */
    margin-bottom: 8px;
  }
}
```

### Pattern 2: Metric Chips Horizontal Strip
```css
/* Source: UI-SPEC § Metric Chips */
@media (max-width: 767px) {
  [data-portfolio] .project .metric-chips {
    position: static;           /* remove absolute from .right */
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    padding: 8px 16px;
    gap: 8px;
  }
  [data-portfolio] .project .metric-chips::-webkit-scrollbar {
    display: none;
  }
  [data-portfolio] .chip {
    flex-shrink: 0;
    min-width: 120px;
    padding: 8px 16px;
  }
  [data-portfolio] .chip .cn {
    font-size: clamp(36px, 9.5vw, 56px);
    font-weight: 300;
  }
  [data-portfolio] .img-caption {
    display: none;
  }
}
```

### Pattern 3: DotNav Component Skeleton
```tsx
// Source: UI-SPEC § DotNav Component Contract
import type { PortfolioSlideData } from '../types';

interface DotNavProps {
  totalCount: number;
  slides: PortfolioSlideData[];  // project slides only
  currentIndex: number;
  onGo: (index: number) => void;
}

export function DotNav({ totalCount, slides, currentIndex, onGo }: DotNavProps) {
  return (
    <div className="dot-nav" role="tablist" aria-label="Navigation entre diapositives">
      {Array.from({ length: totalCount }, (_, i) => {
        const isActive = i === currentIndex;
        const label = i === 0
          ? 'Aller à la couverture'
          : i === totalCount - 1
          ? 'Aller au contact'
          : `Aller au projet ${slides[i - 1]?.name.join(' ')}`;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={['dot-nav-btn', isActive ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => onGo(i)}
          />
        );
      })}
    </div>
  );
}
```

### Pattern 4: GSAP Observer Installation with Live Store Read
```tsx
// Source: STATE.md Phase 05-01 pattern + UI-SPEC § Interaction Contracts
import { Observer } from 'gsap/Observer';

// Inside PortfolioPage():
const observerRef = useRef<ReturnType<typeof Observer.create> | null>(null);

useEffect(() => {
  gsap.registerPlugin(Observer);
  observerRef.current = Observer.create({
    target: window,
    type: 'wheel,touch,pointer',
    tolerance: 40,
    onUp: () => go(usePortfolioStore.getState().currentIndex - 1),
    onDown: () => go(usePortfolioStore.getState().currentIndex + 1),
    preventDefault: true,
  });
  return () => { observerRef.current?.kill(); };
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

### Pattern 5: Chrome Condensation Mobile CSS
```css
/* Source: UI-SPEC § Chrome (Fixed UI Layer) */
@media (max-width: 767px) {
  [data-portfolio] .logo {
    left: 16px;
    top: 8px;
  }
  [data-portfolio] .logo img {
    height: 48px;
  }
  [data-portfolio] .topmeta {
    top: 16px;
    right: 16px;
    gap: 12px;
    font-size: 10px;
  }
  [data-portfolio] .topmeta a.cta {
    display: none;   /* hide "Travaillons ensemble →" pill */
  }
  [data-portfolio] .bottom {
    left: 16px;
    right: 96px;
    bottom: 16px;
  }
  [data-portfolio] .bottom .slide-title {
    display: none;   /* requires <span class="slide-title"> in ProgressBar.tsx */
  }
  [data-portfolio] .nav {
    bottom: 12px;
    right: 16px;
    gap: 8px;
  }
  [data-portfolio] .year-nav {
    display: none;
  }
}
```

### Pattern 6: DotNav CSS
```css
/* Base state: hidden (desktop-first) */
[data-portfolio] .dot-nav {
  display: none;
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  justify-content: center;
  gap: 8px;
  z-index: 86;
  pointer-events: none;
}
[data-portfolio] .dot-nav-btn {
  pointer-events: auto;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  padding: 20px 4px;   /* expands touch target to 44px+ */
  box-sizing: content-box;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
}
[data-portfolio] .dot-nav-btn.active {
  background: #95B8F8;
  border-color: #95B8F8;
  box-shadow: 0 0 6px rgba(149, 184, 248, 0.5);
}
/* Show only on mobile */
@media (max-width: 767px) {
  [data-portfolio] .dot-nav {
    display: flex;
  }
}
```

---

## What the Planner Must Decide

These items have design tradeoffs not fully resolved by the UI-SPEC:

1. **ProgressBar.tsx JSX change for `.slide-title`:** The UI-SPEC says hide the slide title text on mobile but the current DOM has no wrapper element around it. The planner must allocate a task to add `<span className="slide-title">{currentTitle}</span>` in ProgressBar.tsx. This is a minor JSX edit (not CSS-only as the component inventory implies).

2. **"Contact" button touch target:** The `.topmeta` Contact button has inline `style` props in PortfolioPage.tsx. To add `min-height: 44px` for WCAG compliance, either add a class name to the button element or restructure the styles. The planner should add `className="contact-btn"` to that button.

3. **Observer direction convention:** The UI-SPEC says "Swipe left → next slide" = `go(currentIndex + 1)`. In GSAP Observer, swiping up/down on touch (vertical swipe on mobile) fires `onUp`/`onDown`. Swiping left fires `onLeft`, right fires `onRight`. For a horizontal-swipe-to-navigate design on mobile, the Observer config may need `onLeft: () => go(next)` and `onRight: () => go(prev)` rather than `onUp`/`onDown`. The planner must verify whether the main slider app (Phase 2) used `onUp/onDown` or `onLeft/onRight`, and which matches the mobile interaction pattern.

4. **Tablet breakpoint (768–1023px):** The UI-SPEC lists tablet rules but gives less specificity than mobile. The 09-02 plan covers this. The planner should treat tablet as a secondary deliverable that does not block MOB-01 through MOB-05 (which are all mobile-only requirements).

---

## Runtime State Inventory

> Not applicable — this is a greenfield CSS/component addition phase. No renames, no data migration, no stored state affected.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| gsap (including Observer) | MOB-03 touch swipe | Already installed | [ASSUMED — confirmed by test mock] | — |
| Node / npm | Running dev server | Yes | [already in use] | — |
| Browser DevTools mobile emulation | Verification | Yes | Chrome/Firefox built-in | Physical device |

**No missing dependencies.**

---

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true` in config.json).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library |
| Config file | `vitest.config.ts` (already present) |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MOB-01 | Single-column layout renders on mobile | smoke (DOM structure) | `npm test -- --run PortfolioPage` | Existing: PortfolioPage.test.tsx |
| MOB-02 | DotNav renders N dots, active dot matches currentIndex | unit | `npm test -- --run DotNav` | Missing — Wave 0 gap |
| MOB-03 | Observer.create called with tolerance ≥ 40 | unit (mock verify) | `npm test -- --run PortfolioPage` | Augment existing test |
| MOB-04 | Chrome elements receive correct CSS classes | smoke | `npm test -- --run PortfolioPage` | Existing |
| MOB-05 | No regression in desktop rendering | smoke (existing) | `npm test -- --run` | Existing |

### Wave 0 Gaps
- [ ] `src/pages/portfolio/components/__tests__/DotNav.test.tsx` — covers MOB-02 (DotNav rendering and click navigation)
- [ ] Augment existing `PortfolioPage.test.tsx` to verify Observer.create is called (mock already in place — just assert `vi.mocked(Observer.create).toHaveBeenCalledWith(expect.objectContaining({ tolerance: 40 }))`)

---

## Security Domain

ASVS review: This phase adds no authentication, no data input from users, no server communication, no new route parameters, and no third-party resources. The only user-provided data is the `localStorage.setItem('portfolio-swipe-seen', '1')` which stores a constant string. No security controls needed beyond what already exists.

---

## Open Questions (RESOLVED)

1. **Observer onUp/onDown vs onLeft/onRight for horizontal swipe on mobile**
   - What we know: GSAP Observer fires `onUp`/`onDown` for vertical touch/wheel, `onLeft`/`onRight` for horizontal touch — these are separate callbacks
   - What's unclear: The existing main slider app (Phase 2) used Observer — was it configured for vertical or horizontal swipe? The portfolio slides are full-screen fade transitions (not directional slides), so either axis works — but the "swipe left = next" UX convention (UI-SPEC) maps to `onLeft` not `onDown` on a touch device
   - Recommendation: Use `onLeft: () => go(next)` and `onRight: () => go(prev)` for mobile-natural horizontal swipe. Also keep `onDown: () => go(next)` and `onUp: () => go(prev)` for mouse wheel (vertical). Pass both pairs in the same Observer.create() call.
   - **RESOLVED:** Use all four callbacks (`onLeft`, `onRight`, `onDown`, `onUp`) in the same `Observer.create()` call. Encoded in 09-02 Task 1 Addition 3.

2. **ProgressBar.tsx JSX modification**
   - What we know: The current DOM has no wrapper around `{currentTitle}` in ProgressBar
   - What's unclear: The component inventory in UI-SPEC says "No JSX change" for ProgressBar — but hiding the title text without a wrapper element is not straightforward in CSS (text nodes cannot be directly targeted)
   - Recommendation: Add `<span className="slide-title">{currentTitle}</span>` as a one-line JSX change. This is a minor deviation from the "no JSX change" inventory but is necessary for MOB-04.
   - **RESOLVED:** Add `<span className="slide-title">{currentTitle}</span>` in ProgressBar.tsx. Encoded in 09-01 Task 2.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | GSAP `Observer` subpackage is available via `gsap/Observer` in the current install | Standard Stack | Low — test mock already imports it; if unavailable, `npm install gsap@latest` resolves it |
| A2 | GSAP Observer `onLeft`/`onRight` callbacks are supported in the installed GSAP version | Open Questions | Low — standard GSAP 3.x feature; if absent, fall back to `onUp`/`onDown` which also works |
| A3 | `usePortfolioStore.getState()` is available (Zustand `getState` static method) | Code Examples | Low — Zustand always exposes `getState()` on the created store object |

---

## Sources

### Primary (HIGH confidence — direct source inspection)
- `src/pages/portfolio/PortfolioPage.tsx` — full navigation engine, confirmed no Observer
- `src/pages/portfolio/PortfolioPage.css` — all existing rules, confirmed single @media (900px) block
- `src/pages/portfolio/components/ProjectSlide.tsx` — confirmed metric-chips inside .right, absolutely positioned
- `src/pages/portfolio/components/CoverSlide.tsx` — grid layout confirmed
- `src/pages/portfolio/components/OutroSlide.tsx` — grid layout confirmed
- `src/pages/portfolio/components/YearNav.tsx` — confirmed JS logic, CSS-hideable safely
- `src/pages/portfolio/components/ProgressBar.tsx` — confirmed no slide-title wrapper element
- `src/pages/portfolio/usePortfolioStore.ts` — confirmed API: currentIndex, setIndex, activeYear, setActiveYear
- `src/pages/portfolio/types.ts` — PortfolioSlideData type confirmed
- `.planning/phases/09-portfolio-mobile-slider/09-UI-SPEC.md` — design contract
- `.planning/REQUIREMENTS.md` — MOB-01 through MOB-05 definitions
- `.planning/STATE.md` — all architecture decisions from phases 1-8
- `.planning/phases/08-portfolio-page-react-tsx/08-03-SUMMARY.md` — Phase 8 deliverables confirmed

### Secondary (MEDIUM confidence)
- `src/pages/portfolio/__tests__/PortfolioPage.test.tsx` — Observer mock confirms package import path `gsap/Observer`
- `.planning/ROADMAP.md` — plan structure (09-01 CSS, 09-02 JS/touch)

---

## Metadata

**Confidence breakdown:**
- DOM structure and CSS analysis: HIGH — read from live source files
- GSAP Observer API: MEDIUM — confirmed from test mock and Phase 2 pattern (STATE.md), not re-verified against GSAP 3.x docs in this session
- Mobile interaction correctness: MEDIUM — CSS patterns are standard; Observer direction convention (onLeft vs onDown) is the one ambiguity
- Pitfalls: HIGH — derived from direct code analysis of overflow/positioning rules

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable codebase, no fast-moving dependencies)
