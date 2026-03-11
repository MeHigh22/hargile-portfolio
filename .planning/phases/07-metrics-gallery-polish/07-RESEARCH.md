# Phase 7: Metrics, Gallery & Polish - Research

**Researched:** 2026-03-11
**Domain:** GSAP scroll-triggered animations, CSS masonry layout, reading progress bars, next-project navigation
**Confidence:** HIGH

## Summary

Phase 7 completes the case study bottom half by adding six distinct UI elements: animated metric counters, a deliverables gallery, an upgraded testimonial block, polished team cards, a reading progress bar, and a next-project preview card. All six connect to the existing ScrollTrigger / gsap.context() infrastructure already proven in Phases 5 and 6. No new third-party libraries are needed — the entire phase runs on GSAP 3.14 + Tailwind CSS 4, which are already bundled.

The core technical challenge is the masonry gallery. CSS `columns` is the right tool: it is zero-JS, well-supported, and directly fulfills the "Pinterest-style mixed-height" decision. It requires one wrapping class override to break out of the 800 px prose column — a pattern already established by `CaseStudyHero`. The counter animation uses GSAP's `snap` modifier (built into `gsap.to`) to keep the number an integer throughout the count-up. The reading progress bar is the most architecturally sensitive piece: it listens to the panel's scroll event (not window), following the mandatory `scroller: panelRef.current` rule.

**Primary recommendation:** Build all six components as focused, self-contained TSX files inside `src/components/case-study/`. Wire them into `CaseStudyPanel.tsx` by replacing placeholder blocks one-by-one. Do not introduce any new runtime library dependencies.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Metric counter timing: ~1 s duration, power2.out easing, 0.1–0.15 s stagger between counters
- Prefix + suffix are static (HTML); only the number value animates
- Counters fire once on scroll into view and do not reset on re-scroll
- Counter card style: no borders or card wrappers — number + label only, editorial not dashboard
- Gallery: full-width masonry grid breaking out of the 800 px prose column, spans viewport width like hero
- Gallery layout: Pinterest-style mixed-height, 2 cols mobile / 3 cols desktop, images at natural aspect ratios
- Gallery staggered scroll-triggered reveals: fade + translateY one by one as user scrolls
- No click interaction, no lightbox on gallery
- Unsplash URL API for placeholder images (Phase 4 pattern, tech/design themed per project)
- Testimonial: keep blockquote with accent left border; upgrade visual weight (larger quote text)
- Team: keep grid layout with bordered cards; small profile cards with name + role
- Next project: full-width hero card at bottom, shows hero image + title + category
- Next project spans full viewport width (like gallery and hero)
- Next project click: direct case study swap — close current, open next — no return to slider
- Circular loop: verde → atlas (no dead ends)
- Next project gradient blend: current accent → next project accent
- Next project label: "Projet suivant" (French)
- Reading progress bar: fixed at very top of screen, fills left to right
- Progress bar: accent color, 3 px thickness
- Progress bar: scroll-linked in real-time (not ScrollTrigger scrub, direct scroll listener on panel)
- Progress bar: fades in after first scroll, hidden on arrival
- Progress bar: fixed position, z-index above case study content but below modals

### Claude's Discretion
- Exact masonry layout algorithm (CSS columns vs CSS grid vs JS-based)
- Gallery image spacing and gap size
- Counter number interpolation method (GSAP snap vs Math.round)
- Progress bar fade-in timing and easing
- Next project card hover state behavior
- Transition animation between case studies (direct swap choreography)
- Testimonial visual upgrade details (font size, spacing adjustments)
- Team card polish details

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CSCONT-04 | User sees key results with animated number counters (3-5 metrics per project) triggered on scroll | GSAP `gsap.to` with `snap: 1` modifier; ScrollTrigger `onEnter` one-shot; parse numeric from value string |
| CSCONT-05 | User browses a deliverables/screenshots gallery with staggered scroll-triggered reveals | CSS `columns` for masonry; ScrollTrigger staggered `onEnter`; Unsplash URL pattern already in codebase |
| CSCONT-06 | User reads a testimonial/client quote styled as a prominent pull-out | Upgrade existing blockquote; larger text scale, existing accent border; no new markup structure |
| CSCONT-07 | User sees team credits with small profile cards at the bottom | Polish existing bordered grid; consistent with established card pattern |
| CSNAV-03 | User sees a reading progress bar showing how far they've scrolled through the case study | Scroll event listener on `panelRef.current`; `scrollTop / (scrollHeight - clientHeight)`; GSAP `set` width |
| CSNAV-04 | User sees a "next project" preview at the bottom of each case study to continue browsing | Full-width card; project index lookup; `useViewStore.openCase()` for direct swap; circular array index |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | Counter animation, gallery stagger, progress bar width | Already in bundle, all patterns established |
| gsap/ScrollTrigger | (bundled) | Scroll-triggered reveals for counters and gallery | Mandatory per project architecture; scroller: panelRef.current rule |
| Tailwind CSS | 4.2.1 | Layout tokens, responsive columns, spacing | All other components use it |
| React + TypeScript | 19 + 5 | Component authoring | Project standard |
| Zustand useViewStore | 5.0.11 | Next-project swap via openCase() | Already holds mode + activeProjectId |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Unsplash URL API | N/A (CDN URL pattern) | Gallery placeholder images with WebP srcset | Deliverables images until real screenshots exist |
| CSS `columns` | Browser-native | Pinterest masonry without JS | Gallery layout — Claude's discretion confirms CSS approach is appropriate |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `columns` masonry | CSS grid `masonry` (not yet baseline) | CSS grid masonry is draft spec; `columns` works in all browsers today |
| CSS `columns` masonry | JS Masonry library | Adds JS dependency and layout recalculation; CSS `columns` is sufficient for static images |
| GSAP snap modifier | `Math.round` in onUpdate | Both work; `snap: 1` is cleaner — single option on the tween, no callback needed |
| Scroll event listener | ScrollTrigger scrub | ScrollTrigger scrub on progress bar causes visual lag on fast scrolls; direct listener is more responsive |

**Installation:** No new packages needed.

---

## Architecture Patterns

### Recommended Project Structure
```
src/components/case-study/
├── MetricCounter.tsx       # CSCONT-04: counter card + animation
├── DeliverableGallery.tsx  # CSCONT-05: masonry grid + stagger
├── NextProjectCard.tsx     # CSNAV-04: bottom hero card + swap
├── ReadingProgressBar.tsx  # CSNAV-03: fixed top bar
├── __tests__/
│   ├── MetricCounter.test.tsx
│   ├── DeliverableGallery.test.tsx
│   ├── NextProjectCard.test.tsx
│   └── ReadingProgressBar.test.tsx
```

Plus edits to:
```
src/data/types.ts           # Add imageUrl to CaseStudyDeliverable (or keep string[] and add parallel array)
src/data/projects.ts        # Add gallery image URLs per project
src/components/case-study/CaseStudyPanel.tsx   # Wire new components, add progress bar, pass panelRef
```

### Pattern 1: Metric Counter Animation
**What:** Parse numeric portion from value string (e.g. `"-60%"` → `-60`), tween from `0` to target with `snap: 1`, reassemble prefix/suffix in DOM around a `<span ref>` for the number.
**When to use:** CSCONT-04 — the "Resultats" section in CaseStudyPanel.

```typescript
// Source: GSAP docs — gsap.to with snap modifier
// GSAP snap keeps the displayed integer whole throughout the animation
const obj = { val: 0 };
gsap.to(obj, {
  val: numericTarget,
  duration: 1,
  ease: 'power2.out',
  snap: { val: 1 },         // rounds to nearest integer each frame
  onUpdate: () => {
    if (spanRef.current) spanRef.current.textContent = String(Math.round(obj.val));
  },
});
```

**Key constraint:** ScrollTrigger fires `onEnter` once (no `toggleActions` — just `onEnter`). The trigger must use `scroller: panelRef.current`, not window.

### Pattern 2: Masonry Gallery
**What:** CSS `columns` creates Pinterest-style mixed-height layout with zero JS. Each image breaks naturally at column boundaries.
**When to use:** CSCONT-05 — the "Livrables" gallery section.

```css
/* CSS columns approach — applied via Tailwind utility or inline className */
/* 2 cols on mobile, 3 on desktop, 16px gap */
.gallery-masonry {
  columns: 2;
  gap: 1rem;           /* or gap: 1.5rem depending on design feel */
}
@media (min-width: 768px) {
  .gallery-masonry {
    columns: 3;
  }
}
.gallery-masonry img {
  break-inside: avoid;   /* prevents image splitting across columns */
  width: 100%;
  display: block;
  margin-bottom: 1rem;
}
```

In Tailwind CSS 4, the equivalent: `columns-2 md:columns-3 gap-4` on the wrapper; `break-inside-avoid mb-4 w-full` on each image wrapper div.

**Full-width breakout:** Apply `w-screen -ml-[50vw] left-1/2 relative` (or the equivalent) to escape the `max-w-[800px] mx-auto` constraint. This is the same technique used by `CaseStudyHero`.

Alternatively: wrap the gallery in its own element with `className="w-screen relative left-1/2 -translate-x-1/2"` — clean and works inside the existing `CaseStudySection` padding context.

### Pattern 3: Gallery Stagger Reveal
**What:** ScrollTrigger `onEnter` fires once per image; images are pre-set to `opacity: 0, y: 24` and staggered with delay `i * 0.08`.
**When to use:** CSCONT-05 — inside `DeliverableGallery` useEffect.

```typescript
// Source: established project pattern (Timeline.tsx rows stagger)
imgRefs.current.forEach((img, i) => {
  if (!img) return;
  gsap.set(img, { opacity: 0, y: 24 });
  ScrollTrigger.create({
    trigger: img,
    scroller: panelRef.current,   // CRITICAL: never window
    start: 'top 88%',
    onEnter: () => {
      gsap.to(img, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        delay: i * 0.08,          // staggered cascade
      });
    },
  });
});
```

### Pattern 4: Reading Progress Bar
**What:** Scroll event listener on `panelRef.current` (not window). Width is `scrollTop / (scrollHeight - clientHeight) * 100` as a percentage. GSAP `gsap.set` updates width each frame without creating new tweens.
**When to use:** CSNAV-03.

```typescript
// Source: standard scroll math; GSAP set for DOM writes
useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = panel;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Fade in once user starts scrolling
    if (scrollTop > 10 && !hasFadedIn.current) {
      hasFadedIn.current = true;
      gsap.to(barRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    }

    gsap.set(barRef.current, { width: `${progress * 100}%` });
  };

  panel.addEventListener('scroll', handleScroll, { passive: true });
  return () => panel.removeEventListener('scroll', handleScroll);
}, [panelRef]);
```

**Placement:** `ReadingProgressBar` receives `panelRef` as a prop and renders a fixed-position `div` at `top: 0`, `z-index: 110` (above `z-[100]` panel, below any modal). The bar renders inside the panel's DOM tree but is `fixed` — not subject to the panel's overflow-y scroll.

### Pattern 5: Next Project Swap
**What:** Look up current project index in the `projects` array, compute `(index + 1) % projects.length` for circular navigation, call `useViewStore.getState().openCase(nextId)` directly.
**When to use:** CSNAV-04.

```typescript
// Source: projects array import + useViewStore pattern (useViewStore.ts)
const currentIndex = projects.findIndex((p) => p.id === projectId);
const nextProject = projects[(currentIndex + 1) % projects.length];

const handleNextProject = () => {
  // closeCase is NOT called explicitly — openCase sets mode:'case' + new activeProjectId
  // CaseStudyPanel unmounts/remounts because AppShell re-renders with new activeProjectId
  useViewStore.getState().openCase(nextProject.id);
};
```

**Important:** `openCase` sets `mode: 'case'` and `activeProjectId`. AppShell re-renders `CaseStudyPanel` with the new `projectId` prop. The existing `useEffect` cleanup in `CaseStudyPanel` calls `ctx.revert()` on unmount, which kills all ScrollTrigger instances from the previous case study. This means no special teardown is needed in `NextProjectCard` itself.

The panel does not animate closed then open — it re-renders directly. Claude's discretion allows defining the visual choreography; recommended: the entry animation in the new panel instance handles the transition (same two-beat curtain wipe as the slider-to-case transition).

### Pattern 6: Metric Value Parsing
**What:** The `CaseStudyMetric.value` field is a string like `"-60%"`, `"+85%"`, `"4.7/5"`, `"15 000+"`, `"3x secteur"`. The counter must extract the animatable number and preserve surrounding text.

```typescript
// Parse strategy for the metric value strings in projects.ts
function parseMetricValue(value: string): {
  prefix: string;
  numeric: number;
  suffix: string;
} {
  // Match optional leading non-digits, then a number (with optional decimal),
  // then trailing non-digits
  const match = value.match(/^([^0-9-]*)(-?[\d.]+)(.*)$/);
  if (!match) return { prefix: '', numeric: 0, suffix: value };
  return {
    prefix: match[1],
    numeric: parseFloat(match[2]),
    suffix: match[3],
  };
}
```

**Edge cases in the data:**
- `"4.7/5"` → prefix: `""`, numeric: `4.7`, suffix: `"/5"` — decimal, works with `snap: {val: 0.1}`
- `"15 000+"` → prefix: `""`, numeric: `15000`, suffix: `"+"` — thousands separator is cosmetic, not in raw string
- `"3x secteur"` → prefix: `""`, numeric: `3`, suffix: `"x secteur"` — animates the `3`
- `"48t/mois"` → prefix: `""`, numeric: `48`, suffix: `"t/mois"`

For values like `"4.7/5"`, use `snap: { val: 0.1 }` instead of `snap: { val: 1 }` — or apply a per-metric decimal places option. Simplest: detect if parsed numeric has decimals and set snap accordingly.

### Anti-Patterns to Avoid
- **Using window scroll for progress bar:** Panel is `overflow-y-auto`; window.scrollY is always 0. Must listen to `panelRef.current`.
- **Using string selectors for GSAP targets:** All refs must be `useRef` direct DOM refs. No `gsap.to('.gallery-img')`.
- **Calling ScrollTrigger outside gsap.context():** All ScrollTrigger instances must be created inside `gsap.context()` so `ctx.revert()` kills them on panel close.
- **Calling openCase while isAnimating:** The store guards against this, but NextProjectCard click handler should visually disable the button during slider animation if the user could theoretically be on a slider page (not applicable here — button is inside case study, slider is hidden).
- **Resetting counters on re-scroll:** ScrollTrigger `onEnter` fires once by default. Do not use `toggleActions` — it would re-trigger on scroll back up.
- **CSS columns gap on image bottom margin:** `column-gap` and `margin-bottom` on images are both needed. Gap controls horizontal gutter; margin-bottom controls vertical spacing within a column. Use both.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Masonry layout | Custom JS column height balancer | CSS `columns` | Native, zero-JS, handles natural aspect ratios automatically |
| Scroll progress math | Complex intersection logic | `scrollTop / (scrollHeight - clientHeight)` | Simple arithmetic; browsers compute this precisely |
| Circular project navigation | Custom linked-list or router | Array index with modulo: `(i + 1) % n` | `projects` array is stable, length is 3 |
| Counter integer rounding | Manual `Math.round` in onUpdate | GSAP `snap: { val: 1 }` | Built-in GSAP modifier; cleaner tween definition |
| Image srcset for gallery | Manual `<img>` with Unsplash | Unsplash `?fm=webp&w=N` URL params | Already established in Phase 4 Unsplash pattern |

**Key insight:** Every problem in this phase has a 5-line solution using tools already in the project. The risk is over-engineering.

---

## Common Pitfalls

### Pitfall 1: Progress Bar Reads `scrollTop: 0` Always
**What goes wrong:** Developer attaches `window.addEventListener('scroll', ...)` assuming the page scrolls. The panel element is `position: fixed; overflow-y: auto` — the window never scrolls.
**Why it happens:** Mental model of "scroll = window" doesn't transfer to fixed overflow panels.
**How to avoid:** Always attach scroll listener to `panelRef.current`. Verified pattern from Phase 5/6 docs: `scroller: panelRef.current` everywhere.
**Warning signs:** Progress bar width never changes from 0%.

### Pitfall 2: Gallery ScrollTrigger Instances Leak on Panel Close
**What goes wrong:** Gallery images have ScrollTrigger instances that persist after `panelRef.current?.scrollTop = 0` resets the panel. On next open, triggers fire at wrong positions.
**Why it happens:** ScrollTrigger instances created outside `gsap.context()` are not cleaned up by `ctx.revert()`.
**How to avoid:** Create all gallery ScrollTrigger instances inside the `gsap.context()` in the component's `useEffect`. The existing `ctxRef.current?.revert()` in `closePanel()` will kill them.
**Warning signs:** Gallery images fail to animate on second or third open of the same case study.

### Pitfall 3: Counter Fires Before Element Is in View
**What goes wrong:** Counter starts counting as soon as the case study opens, even though the "Resultats" section is below the fold.
**Why it happens:** ScrollTrigger `start: 'top 85%'` calculation uses the panel scroller, but if `ScrollTrigger.refresh()` hasn't been called after entry animation, positions may be stale.
**How to avoid:** The existing `CaseStudyPanel` already calls `ScrollTrigger.refresh()` in the `onComplete` of the entry timeline. Counter ScrollTrigger instances should be created in the component's `useEffect`, which runs after mount (after DOM is painted), so positions are correct.
**Warning signs:** Counter reaches final value immediately without animation.

### Pitfall 4: Full-Width Gallery Breaks Horizontal Scroll
**What goes wrong:** `w-screen -translate-x-1/2 left-1/2 relative` expands the gallery to 100vw. If the panel has hidden overflow-x, this is fine. If anything causes a scrollbar, it creates a horizontal scroll inside the fixed panel.
**Why it happens:** The panel is `overflow-y-auto` but may not explicitly set `overflow-x: hidden`.
**How to avoid:** Verify `CaseStudyPanel` already has `overflow-y-auto` (it does — line 224 of CaseStudyPanel.tsx). This implicitly clips overflow-x in most browsers. If a horizontal scroll appears, add `overflow-x: hidden` to the panel's className.
**Warning signs:** Horizontal scrollbar appears inside the case study panel.

### Pitfall 5: `deliverables` Is `string[]`, Not Objects with Images
**What goes wrong:** `types.ts` defines `deliverables: string[]`. The gallery needs image URLs. Developer tries to add `imageUrl` to the string, breaking the type.
**Why it happens:** The original type assumed deliverables would be text labels only.
**How to avoid:** Two safe options:
  1. Add a parallel `deliverableImages: string[]` array to `CaseStudyContent` — simpler, no breaking change to existing `deliverables` usage.
  2. Change `deliverables` to `CaseStudyDeliverable[]` where `CaseStudyDeliverable = { label: string; imageUrl?: string }` — more semantic, but requires updating all three `projects.ts` entries.

**Recommendation (Claude's discretion):** Option 1 (parallel array) — zero disruption to the existing `deliverables` list rendering in CaseStudyPanel, and the gallery is conceptually a visual companion, not a replacement. Name it `galleryImages: string[]`.

### Pitfall 6: Metric Value with Non-Standard Format Fails to Parse
**What goes wrong:** Parser built for `"-60%"` encounters `"3x secteur"` or `"15 000+"` and returns 0 or NaN.
**Why it happens:** Metrics data has varied formats — percentages, ratios, plain integers, suffixed numbers.
**How to avoid:** Use the regex `^([^0-9-]*)(-?[\d.]+)(.*)$` which handles all cases in the current data. Add a fallback: if `isNaN(numeric)`, display the raw `value` string without animation.
**Warning signs:** Some metric cards show "0" or fail to animate.

---

## Code Examples

Verified patterns from official sources and established codebase:

### Reading Progress Bar Scroll Listener
```typescript
// Source: Codebase pattern — panelRef scroll listener (same as Timeline.tsx scroller pattern)
useEffect(() => {
  const panel = panelRef.current;
  const bar = barRef.current;
  if (!panel || !bar) return;

  let hasFadedIn = false;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = panel;
    const maxScroll = scrollHeight - clientHeight;
    const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (!hasFadedIn && scrollTop > 10) {
      hasFadedIn = true;
      gsap.to(bar, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    }

    gsap.set(bar, { width: `${pct}%` });
  };

  panel.addEventListener('scroll', handleScroll, { passive: true });
  return () => panel.removeEventListener('scroll', handleScroll);
}, [panelRef]);
```

### MetricCounter Component Skeleton
```typescript
// Source: GSAP 3.x docs — gsap.to with snap, onUpdate
interface MetricCounterProps {
  metric: CaseStudyMetric;
  index: number;
  panelRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}

export function MetricCounter({ metric, index, panelRef, reducedMotion }: MetricCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const { prefix, numeric, suffix } = parseMetricValue(metric.value);

  useEffect(() => {
    if (reducedMotion || !numRef.current || !panelRef.current) return;
    const el = numRef.current;
    const obj = { val: 0 };
    const hasDecimal = !Number.isInteger(numeric);

    const ctx = gsap.context(() => {
      gsap.set(el, { textContent: prefix + '0' + suffix });

      ScrollTrigger.create({
        trigger: el,
        scroller: panelRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(obj, {
            val: numeric,
            duration: 1,
            ease: 'power2.out',
            delay: index * 0.12,
            snap: { val: hasDecimal ? 0.1 : 1 },
            onUpdate: () => {
              el.textContent = prefix + obj.val.toFixed(hasDecimal ? 1 : 0) + suffix;
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [numeric, prefix, suffix, index, panelRef, reducedMotion]);

  return (
    <div className="py-4">
      <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
        <span ref={numRef}>{reducedMotion ? metric.value : prefix + '0' + suffix}</span>
      </div>
      <div className="font-mono text-xs text-text-secondary uppercase tracking-wider">
        {metric.label}
      </div>
    </div>
  );
}
```

### Full-Width Breakout Wrapper
```typescript
// Source: CaseStudyHero.tsx pattern — w-full relative overflow-hidden at panel top
// Adapted for mid-content full-width breakout
<div className="w-screen relative left-1/2 -translate-x-1/2">
  {/* gallery content */}
</div>
```

### CSS Masonry via Tailwind CSS 4
```tsx
// Source: CSS columns spec — browser native, works today
// Tailwind CSS 4 utility classes
<div className="columns-2 md:columns-3 gap-4">
  {images.map((src, i) => (
    <div key={i} ref={(el) => { imgRefs.current[i] = el; }} className="break-inside-avoid mb-4">
      <img
        src={`${src}&fm=webp&w=800`}
        alt=""
        loading="lazy"
        className="w-full h-auto block"
      />
    </div>
  ))}
</div>
```

### useViewStore Direct Swap
```typescript
// Source: useViewStore.ts — openCase is safe to call while in 'case' mode
// The store sets mode:'case' + new activeProjectId; AppShell re-renders with new projectId
const handleNextProject = () => {
  useViewStore.getState().openCase(nextProject.id);
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS Masonry library (Masonry.js) | CSS `columns` | CSS3 era; widespread ~2020 | Zero dependency, no reflow calculations |
| Manual counter `setInterval` | GSAP tween + `snap` modifier | GSAP 3.x | Precise, interruptible, respects GSAP pause/kill lifecycle |
| Window scroll for progress bars | Element scroll listener | Always correct, often forgotten | Panel-scoped scroll is the only way inside `overflow-y-auto` fixed elements |
| React state for progress percent | `gsap.set` direct DOM write | GSAP pattern established in this project | No React re-render per scroll frame — critical for 60 fps |

**Deprecated/outdated:**
- `useGSAP` hook from `@gsap/react`: Project decision in Phase 4 — use plain `useEffect` + `gsap.context()`. Do not change.
- `toggleActions: 'play none none none'` on counters: Over-specification. `onEnter` alone is sufficient and fires once.

---

## Open Questions

1. **Gallery image data shape**
   - What we know: `deliverables: string[]` exists; gallery needs URLs; `galleryImages` parallel array is recommended
   - What's unclear: How many gallery images per project? 4–6 is typical for 3-column masonry
   - Recommendation: Add 6 Unsplash URLs per project in projects.ts as `galleryImages: string[]` during Wave 0 / data prep task

2. **Next project card transition choreography**
   - What we know: Claude's discretion; current openCase/closeCase flow re-renders the panel
   - What's unclear: Does the user see a brief white flash between cases? The entry animation (already coded) covers panel opacity 0 → 1, which should prevent this
   - Recommendation: Test in browser after first implementation. If flash is visible, add `gsap.set(panel, { opacity: 0 })` synchronously before `openCase()` call.

3. **CaseStudySection wrapping for gallery**
   - What we know: Gallery must break out of the 800 px column; CaseStudySection applies `max-w-[800px] mx-auto`
   - What's unclear: Does the gallery live inside a CaseStudySection (for the section title "Livrables") or is it a sibling?
   - Recommendation: Keep the section title "Livrables" inside a normal CaseStudySection. Place the gallery `<DeliverableGallery />` as a separate sibling element outside CaseStudySection (no max-width constraint). This matches how `CaseStudyHero` sits outside CaseStudySections.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 + @testing-library/react 16 |
| Config file | `vite.config.ts` — `test.environment: 'jsdom'`, `setupFiles: ['./src/test-setup.ts']` |
| Quick run command | `npx vitest run src/components/case-study/__tests__/MetricCounter.test.tsx` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CSCONT-04 | MetricCounter renders value string when reducedMotion=true | unit | `npx vitest run src/components/case-study/__tests__/MetricCounter.test.tsx` | ❌ Wave 0 |
| CSCONT-04 | MetricCounter renders label text | unit | same | ❌ Wave 0 |
| CSCONT-04 | MetricCounter handles value strings with prefix/suffix | unit | same | ❌ Wave 0 |
| CSCONT-05 | DeliverableGallery renders one img per galleryImage URL | unit | `npx vitest run src/components/case-study/__tests__/DeliverableGallery.test.tsx` | ❌ Wave 0 |
| CSCONT-05 | DeliverableGallery renders break-inside-avoid wrappers | unit | same | ❌ Wave 0 |
| CSCONT-06 | TestimonialBlock renders quote, author, role | unit | `npx vitest run src/components/case-study/__tests__/TestimonialBlock.test.tsx` | ❌ Wave 0 |
| CSCONT-07 | TeamCredits renders one card per team member | unit | `npx vitest run src/components/case-study/__tests__/TeamCredits.test.tsx` | ❌ Wave 0 |
| CSNAV-03 | ReadingProgressBar renders with opacity 0 initially | unit | `npx vitest run src/components/case-study/__tests__/ReadingProgressBar.test.tsx` | ❌ Wave 0 |
| CSNAV-03 | ReadingProgressBar has fixed position and accent color | unit | same | ❌ Wave 0 |
| CSNAV-04 | NextProjectCard renders next project title | unit | `npx vitest run src/components/case-study/__tests__/NextProjectCard.test.tsx` | ❌ Wave 0 |
| CSNAV-04 | NextProjectCard calls openCase on click (circular: verde → atlas) | unit | same | ❌ Wave 0 |

**GSAP mock pattern (copy from Timeline.test.tsx):**
```typescript
vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    to: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn(),
    matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}));
```

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/case-study/__tests__/[ComponentName].test.tsx`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/case-study/__tests__/MetricCounter.test.tsx` — covers CSCONT-04
- [ ] `src/components/case-study/__tests__/DeliverableGallery.test.tsx` — covers CSCONT-05
- [ ] `src/components/case-study/__tests__/ReadingProgressBar.test.tsx` — covers CSNAV-03
- [ ] `src/components/case-study/__tests__/NextProjectCard.test.tsx` — covers CSNAV-04
- [ ] `src/components/case-study/__tests__/TestimonialBlock.test.tsx` — covers CSCONT-06 (if extracted to component)
- [ ] `src/components/case-study/__tests__/TeamCredits.test.tsx` — covers CSCONT-07 (if extracted to component)
- [ ] `src/data/types.ts` — add `galleryImages?: string[]` to `CaseStudyContent`
- [ ] `src/data/projects.ts` — add `galleryImages` arrays with Unsplash URLs for atlas, pulse, verde

---

## Sources

### Primary (HIGH confidence)
- Codebase direct inspection — `CaseStudyPanel.tsx`, `Timeline.tsx`, `useViewStore.ts`, `types.ts`, `projects.ts`, `vite.config.ts` — all patterns observed from working code
- `package.json` — confirmed GSAP 3.14.2, React 19, Zustand 5.0.11, Tailwind CSS 4.2.1, Vitest 4.0.18
- `07-CONTEXT.md` — all locked decisions verified

### Secondary (MEDIUM confidence)
- GSAP 3.x documentation (training knowledge, GSAP 3.x stable API since 2020) — `snap` modifier behavior, `gsap.context()` revert semantics, `ScrollTrigger.create` `onEnter` one-shot behavior
- CSS `columns` spec — MDN-documented, browser-native, all major browsers since 2012

### Tertiary (LOW confidence)
- None — all claims verified from codebase or stable well-known APIs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — read directly from package.json; no new dependencies needed
- Architecture: HIGH — patterns cloned directly from working Timeline.tsx and CaseStudyPanel.tsx
- Pitfalls: HIGH — derived from actual architectural constraints (fixed panel overflow, gsap.context cleanup) proven in earlier phases
- Test patterns: HIGH — copied from Timeline.test.tsx which already exists and passes

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable APIs; GSAP and Tailwind CSS 4 are not in rapid-change state)
