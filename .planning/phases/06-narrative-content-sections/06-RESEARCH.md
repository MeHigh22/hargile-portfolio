# Phase 6: Narrative Content Sections - Research

**Researched:** 2026-03-11
**Domain:** GSAP ScrollTrigger (custom scroller), React component composition, editorial typography, animated vertical timeline
**Confidence:** HIGH

## Summary

Phase 6 adds content depth to the case study panel already built in Phase 5. The panel shell exists (`CaseStudyPanel.tsx`), data is fully populated (`projects.ts`), and the entry animation already handles the hero + first sections via staggered `opacity`/`translateY`. This phase's job is threefold: (1) upgrade Challenge and Solution prose from a raw string to multi-paragraph rendered text with editorial typography, (2) replace the placeholder card grid in the Processus section with a vertical animated timeline component, and (3) attach GSAP `ScrollTrigger` to every `[data-anim="cs-section"]` element so below-fold sections reveal as the user scrolls.

The critical technical constraint driving all decisions is the custom scroller: `CaseStudyPanel` is a `fixed inset-0 overflow-y-auto` div, not the window. Every `ScrollTrigger` instance MUST pass `scroller: panelRef.current`. This is already established architecture and the existing entry animation already calls `ScrollTrigger.refresh()` in its `onComplete`. The above-fold vs below-fold split must be managed manually — sections already revealed by the entry animation must not get a duplicate ScrollTrigger reveal.

The timeline connector line uses CSS `scaleY` animation (not DrawSVG), keeping the implementation dependency-free. DrawSVG is a GSAP Club plugin (paid tier), while a `div` with `transform-origin: top` and `scaleY` driven by a ScrollTrigger achieves identical visual results.

**Primary recommendation:** Set initial `opacity: 0; transform: translateY(30px)` via `gsap.set()` on all `[data-anim="cs-section"]` elements in the ScrollTrigger setup. Track which sections the entry animation already revealed. Use `ScrollTrigger.batch()` for the sections and a separate per-node ScrollTrigger for the timeline. Wrap everything in the existing `gsap.context()` scoped to `panelRef.current`.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Prose presentation:**
- Split multi-paragraph challenge/solution text on `\n\n` into separate `<p>` tags with generous spacing (~1.5rem gap)
- First paragraph slightly larger (text-lg); subsequent paragraphs at text-base — editorial magazine style
- Brighter text color (text-text primary) for prose body — long-form needs higher contrast for comfortable reading
- text-secondary reserved for metadata and labels only
- Section header only (mono uppercase accent) — no subtitle or intro line
- Challenge and Solution sections use identical formatting — content provides the narrative shift, not visual styling
- No pull quotes, drop caps, or decorative elements — clean editorial feel

**Timeline visual design:**
- Vertical accent-colored line on the left with circular nodes at each step
- Phase name + duration on the node line, description text to the right
- Accent color for connector line and filled nodes — ties timeline to project identity
- Unfilled/upcoming nodes use accent at ~20% opacity
- Progressive fill reveal: nodes start empty (○), fill to solid (●) as each step scrolls into view; connector line draws downward between nodes
- Timeline stays within the 800px prose column — consistent reading flow, no layout shift

**Scroll reveal behavior:**
- Fade + translateY (~30px) for each section — consistent with Phase 3 stagger and Phase 5 entry animation language
- Entry animation reveals hero + first 1-2 above-fold sections (existing Phase 5 behavior); ScrollTrigger handles all below-fold sections
- No double-animation: above-fold sections revealed by entry animation are not also targeted by ScrollTrigger
- Child elements within sections (timeline nodes, metric cards, team members) stagger individually after parent section reveals
- Scroll reveals apply uniformly to ALL CaseStudySection components (including Phase 7 placeholder sections) — reveal wrapper stays when Phase 7 upgrades content
- Reduced motion: instant visibility for all sections — no ScrollTrigger created, no animation at all. Content always readable.

**Section ordering and rhythm:**
- Whitespace only between sections (py-16 existing spacing) — no divider lines or decorative separators
- Keep current section header style: font-mono, text-sm, uppercase, tracking-widest, text-accent, mb-6
- Section order unchanged: Hero → Défi → Solution → Processus → Résultats → Livrables → Témoignage → Équipe
- Phase 7 placeholder sections (Résultats, Livrables, Témoignage, Équipe) remain visible with current basic rendering

### Claude's Discretion
- ScrollTrigger start/end thresholds (e.g., "top 80%" vs "top 85%")
- Exact fade+translate duration per section (likely 0.4-0.6s range)
- Child stagger delay between items (likely 0.05-0.1s)
- Timeline connector line width and node size
- Timeline progressive fill animation easing and timing
- How to detect which sections are above-fold vs below-fold on entry
- Whether to use gsap.context() per-section or one scoped to the entire panel

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CSCONT-01 | User reads a challenge/problem section explaining what the client needed | Split `\n\n` → multiple `<p>` tags; first paragraph `text-lg`, rest `text-base`; `text-text` (primary) for all prose |
| CSCONT-02 | User reads a solution/approach section describing what Hargile did | Identical formatting to CSCONT-01; challenge and solution use same `ProseSection` pattern |
| CSCONT-03 | User sees an animated process timeline (discovery, design, development, launch) that reveals step-by-step on scroll | New `Timeline` component: CSS vertical line + circular nodes, `scaleY` grow animation, per-node ScrollTrigger with `scroller: panelRef.current` |
| CSVIS-01 | All case study sections animate into view on scroll with staggered fade-translate reveals | `ScrollTrigger.batch()` on `[data-anim="cs-section"]` with custom scroller; skip sections already revealed by entry animation; `prefers-reduced-motion` path: `gsap.set(sections, { opacity: 1, y: 0 })` only |
</phase_requirements>

---

## Standard Stack

### Core (already in project — no new installs)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.14.2 | ScrollTrigger, timeline, set, batch | Already vendored; ScrollTrigger is registered |
| react | ^19.2.4 | Component composition | Project stack |
| tailwindcss | ^4.2.1 | Typography utilities (text-lg, text-base, leading-relaxed) | Project stack |
| zustand | ^5.0.11 | `useViewStore` — activeProjectId, closeCase | Project stack |

### No New Dependencies
DrawSVGPlugin is NOT used — it is a GSAP Club (paid) plugin. The vertical connector line is a plain `div` with CSS `scaleY` transition driven by ScrollTrigger `scrub` or `onEnter`. This is sufficient for the visual design and avoids introducing an unlicensed dependency.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `scaleY` for connector line | DrawSVG Plugin | DrawSVG requires GSAP Club membership; `scaleY` achieves identical results for a straight vertical line |
| `ScrollTrigger.batch()` for section reveals | Individual ScrollTrigger per section | Batch is more concise for stagger groups; individual is fine too — both work correctly with custom scroller |
| Inline paragraph split in component | Markdown renderer | No markdown in project; `\n\n` split is already the data convention per `projects.ts` |

---

## Architecture Patterns

### Recommended Project Structure (additions to existing)
```
src/
├── components/
│   └── case-study/
│       ├── CaseStudyPanel.tsx      # MODIFY: add ScrollTrigger setup in entry onComplete
│       ├── CaseStudySection.tsx    # MODIFY: accept optional initialVisible prop or use data-above-fold attr
│       ├── CaseStudyHero.tsx       # NO CHANGE
│       ├── BackButton.tsx          # NO CHANGE
│       ├── ProseBody.tsx           # NEW: splits \n\n into <p> tags with editorial typography
│       └── Timeline.tsx            # NEW: vertical timeline with scroll-triggered node reveals
```

### Pattern 1: Paragraph Splitting (ProseBody)

**What:** A pure render component that takes a `string` with `\n\n` delimiters and outputs `<p>` elements. First paragraph gets `text-lg`, remainder get `text-base`.

**When to use:** Both Défi and Solution sections consume this pattern. The data convention (`\n\n`) is already in `projects.ts`.

**Example:**
```typescript
// src/components/case-study/ProseBody.tsx
interface ProseBodyProps {
  text: string;
}

export function ProseBody({ text }: ProseBodyProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-6">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`leading-relaxed text-text ${i === 0 ? 'text-lg' : 'text-base'}`}
        >
          {para}
        </p>
      ))}
    </div>
  );
}
```

### Pattern 2: Vertical Timeline Component

**What:** A `Timeline` component that renders a vertical connector line (div with accent background) and a list of nodes. Each node has: phase name (left), duration (right), description (below). The connector line starts at `scaleY(0)` from `transform-origin: top` and grows to `scaleY(1)` via GSAP on scroll.

**When to use:** Processus section only. Replaces the current card grid placeholder.

**Node reveal approach:**
- Each node: starts `opacity: 0, y: 20`
- ScrollTrigger per node: `start: "top 85%"`, `scroller: panelRef.current`
- Node inner circle: starts with `backgroundColor: accent/20` (outline), tweens to filled accent on `onEnter`
- Connector segment between node N and N+1: reveals after node N animates in

**Example structure:**
```typescript
// src/components/case-study/Timeline.tsx
interface TimelineProps {
  steps: CaseStudyTimelineStep[];
  panelRef: React.RefObject<HTMLDivElement>;
  reducedMotion: boolean;
}

export function Timeline({ steps, panelRef, reducedMotion }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion || !panelRef.current) return;
    // Per-node ScrollTrigger setup
    const ctx = gsap.context(() => {
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        gsap.set(node, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: node,
          scroller: panelRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(node, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
            // Fill dot
            if (dotRefs.current[i]) {
              gsap.to(dotRefs.current[i], {
                backgroundColor: 'var(--color-accent)',
                duration: 0.3,
                ease: 'power2.out',
              });
            }
            // Grow connector line to next node
            if (lineRefs.current[i]) {
              gsap.to(lineRefs.current[i], {
                scaleY: 1,
                duration: 0.4,
                ease: 'power2.inOut',
              });
            }
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [panelRef, reducedMotion]);

  if (reducedMotion) {
    // Render fully visible, no animation
    return <TimelineMarkup steps={steps} filled />;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* ... node + connector line markup */}
    </div>
  );
}
```

### Pattern 3: ScrollTrigger Section Reveals in CaseStudyPanel

**What:** After the entry animation `onComplete`, set up ScrollTrigger on all sections that are NOT already visible. The entry animation already handles hero + first 1-2 sections at `opacity: 1, y: 0`. ScrollTrigger should only target sections still at their initial hidden state.

**The above-fold detection strategy (Claude's discretion — recommended approach):**

1. In entry animation `onComplete`, collect all `[data-anim="cs-section"]` elements.
2. The entry animation animates N sections via stagger (N depends on panel scroll position, which starts at 0). Reliably, the entry animation animates ALL sections in the initial stagger to save detection complexity — but uses `scrollTop === 0` invariant.
3. **Simpler recommended approach:** Let the entry animation reveal only sections that are above the fold by checking `el.getBoundingClientRect().top < panelRef.current.clientHeight` after `ScrollTrigger.refresh()`. Sections with `top >= panelHeight` start hidden; attach ScrollTrigger to those. Sections already visible are already at opacity 1.
4. The existing entry animation in `CaseStudyPanel.tsx` animates ALL `[data-anim="cs-section"]` elements in one stagger. Given panel opens at `scrollTop = 0`, only the top sections (1-2) are visible. The stagger runs all of them sequentially — sections not in view animate "offscreen" but are still set to `opacity: 1, y: 0`.
5. **Correct strategy:** Since the entry animation sets ALL sections to `opacity: 1, y: 0`, the ScrollTrigger reveal must be set up BEFORE the entry animation runs. Set `opacity: 0, y: 30` initially on all sections, let the entry animation reveal above-fold sections, and set up ScrollTrigger for below-fold sections after entry `onComplete`.

**Implementation sequence in `CaseStudyPanel`:**
```typescript
// In the entry animation useEffect, inside gsap.context():

// 1. Initial state: hide ALL sections before entry
const sections = panel.querySelectorAll('[data-anim="cs-section"]');
gsap.set(sections, { opacity: 0, y: 30 });  // already done by existing code

// 2. Entry animation staggers above-fold sections (existing code — keep as-is)
// The stagger reveals sections[0..N] where N = however many fit

// 3. In onComplete callback — add ScrollTrigger for remaining sections:
onComplete: () => {
  panel.style.pointerEvents = 'auto';
  ScrollTrigger.refresh();

  // Detect which sections are still hidden (below fold)
  sections.forEach((section) => {
    const el = section as HTMLElement;
    // If entry animation already revealed it (opacity == 1), skip
    if (parseFloat(gsap.getProperty(el, 'opacity') as string) >= 1) return;

    ScrollTrigger.create({
      trigger: el,
      scroller: panelRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      },
    });
  });
}
```

**Note on stagger and entry animation conflict:** The current entry animation staggers ALL sections. This means by `onComplete`, even below-fold sections have been tweened to `opacity: 1` (the tween runs even if element is off-screen). This creates a conflict: you cannot use opacity-based detection after entry animation finishes.

**Revised recommended approach:** Separate the entry animation sections from the ScrollTrigger sections explicitly using the panel's visible height:

```typescript
// After ScrollTrigger.refresh() in onComplete:
const panelHeight = panelRef.current!.clientHeight;

sections.forEach((section) => {
  const rect = (section as HTMLElement).getBoundingClientRect();
  const relativeTop = rect.top - panelRef.current!.getBoundingClientRect().top;

  if (relativeTop >= panelHeight) {
    // Below fold — not yet visible — reset and apply ScrollTrigger
    gsap.set(section, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: section,
      scroller: panelRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(section, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      },
    });
  }
});
```

This approach is clean: entry animation staggers all sections, `onComplete` resets below-fold sections and hands them off to ScrollTrigger.

### Pattern 4: Reduced Motion Path

**What:** When `isReducedMotion` is true, skip all scroll-triggered reveals. All sections are rendered at full opacity/visibility from the start.

**Implementation:** Already handled at the `CaseStudyPanel` level via the `isReducedMotion` branch. For Phase 6:
- In the `isReducedMotion` branch: ensure all sections are at `opacity: 1, y: 0` after panel opens (existing entry sets `opacity: 1` but does NOT set the sections at all in reduced motion path — verify).
- `Timeline` component: accept `reducedMotion` prop; if true, render all nodes filled and visible without GSAP.
- No `ScrollTrigger.create()` calls when reduced motion is active.

### Anti-Patterns to Avoid

- **Using `window` as scroller:** All ScrollTrigger instances in the case study panel MUST use `scroller: panelRef.current`. Using window will produce no scroll trigger activation because the window does not scroll — the panel div does.
- **Creating ScrollTrigger before `ScrollTrigger.refresh()`:** Always call `ScrollTrigger.refresh()` first in `onComplete`, then create new triggers. Triggers created before refresh use stale scroll positions.
- **Double-animating above-fold sections:** If the entry animation already set a section to `opacity: 1`, do not create a ScrollTrigger for it. The section would reset to hidden then re-animate on scroll, creating a visible flash.
- **Forgetting to include Timeline ScrollTriggers in the main `gsap.context()`:** All ScrollTrigger instances (including those created inside `Timeline.tsx`) must be reverted on panel close. Pass `panelRef` into `Timeline` and keep Timeline's context inside the parent `ctxRef`.
- **Using `useGSAP` hook:** Per project memory and CONTEXT.md, use plain `useEffect` + `useCallback`. `useGSAP` causes context revert issues.
- **Creating ScrollTrigger in the same `useEffect` as entry animation before `onComplete`:** ScrollTrigger needs refreshed positions post-entry. Create them in `onComplete` only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Paragraph splitting | Custom parser | `text.split('\n\n').filter(Boolean)` | Data already uses this convention; one-liner sufficient |
| Scroll-triggered reveals | IntersectionObserver | GSAP ScrollTrigger | Already imported and registered; consistent with project tooling; custom scroller support |
| Reduced motion detection | `window.matchMedia` listener | `useReducedMotion()` hook | Already exists in `src/hooks/useReducedMotion.ts`; uses `gsap.matchMedia` |
| Above-fold visibility | Complex position math | `getBoundingClientRect()` relative to panel rect | Simple, reliable, runs once in `onComplete` |
| Timeline connector line | SVG + DrawSVG | CSS `div` with `scaleY` + `transform-origin: top` | No Club plugin needed; visually identical for straight line |

---

## Common Pitfalls

### Pitfall 1: ScrollTrigger with Wrong Scroller
**What goes wrong:** Triggers never fire. Panel content never animates on scroll.
**Why it happens:** Default scroller is `window`. The case study panel is `fixed inset-0 overflow-y-auto` — it scrolls internally, not the window.
**How to avoid:** Every `ScrollTrigger.create()` call must include `scroller: panelRef.current`.
**Warning signs:** ScrollTrigger works in isolation but not inside the panel.

### Pitfall 2: Entry Animation Stagger vs ScrollTrigger Conflict
**What goes wrong:** Below-fold sections appear visible briefly, then flash back to hidden when ScrollTrigger fires.
**Why it happens:** Entry animation runs stagger on ALL `[data-anim="cs-section"]` elements including below-fold ones, setting them to `opacity: 1`. Then ScrollTrigger is created but element is already visible — no reveal needed, but if `gsap.set(hidden)` runs after entry, it resets them incorrectly.
**How to avoid:** Use the `getBoundingClientRect()` detection in `onComplete` to reset ONLY below-fold sections, then attach ScrollTrigger to them.
**Warning signs:** Sections below the fold are briefly visible during entry, then disappear until scrolled past.

### Pitfall 3: ScrollTrigger Created Before `refresh()`
**What goes wrong:** Triggers fire at wrong scroll positions. Section animates too early or too late.
**Why it happens:** ScrollTrigger caches positions at creation time. After a panel appears, positions are stale until `refresh()` is called.
**How to avoid:** Always call `ScrollTrigger.refresh()` in `onComplete` BEFORE creating new ScrollTriggers.
**Warning signs:** First section below fold triggers immediately, or never triggers until scrolled past halfway.

### Pitfall 4: Timeline Context Not Reverted on Panel Close
**What goes wrong:** Memory leak / stale ScrollTrigger instances accumulate across multiple case study opens/closes.
**Why it happens:** `Timeline.tsx` creates its own GSAP context internally. If the parent panel's `ctxRef.current.revert()` doesn't cover the Timeline, those triggers survive the close.
**How to avoid:** Either (a) create Timeline ScrollTriggers inside the parent `gsap.context()` by passing refs up, or (b) give Timeline its own `ctxRef` and ensure cleanup runs in `closePanel` path. Approach (b) is cleaner for component isolation.
**Warning signs:** Timeline animations still fire after returning to slider.

### Pitfall 5: Reduced Motion Path Leaves Sections Hidden
**What goes wrong:** When `prefers-reduced-motion` is active, sections remain at `opacity: 0` because no scroll trigger is created and no entry animation runs on them.
**Why it happens:** The reduced-motion entry animation branch in `CaseStudyPanel` uses a simple opacity fade on the panel itself — it does NOT set individual sections to visible.
**How to avoid:** In the reduced-motion branch, after the panel fade-in, call `gsap.set(sections, { opacity: 1, y: 0 })` explicitly.
**Warning signs:** All section content invisible in reduced-motion mode.

### Pitfall 6: `text-text` Token Not Available
**What goes wrong:** Tailwind class `text-text` doesn't resolve to the CSS custom property.
**Why it happens:** Tailwind CSS v4 `@theme` tokens are defined as `--color-text` but the class is `text-text` (Tailwind v4 convention strips the `color-` prefix for utilities).
**How to avoid:** Verify the token name in the project's CSS theme. The project uses `text-accent`, `text-text-secondary` — `text-text` follows the same convention if `--color-text` is defined in `@theme`.
**Warning signs:** Text appears with wrong color or inherits browser default.

---

## Code Examples

Verified patterns from existing project code and official GSAP docs:

### Existing Entry Animation Pattern (CaseStudyPanel.tsx — DO NOT BREAK)
```typescript
// Source: src/components/case-study/CaseStudyPanel.tsx (existing)
const tl = gsap.timeline({
  onComplete: () => {
    panel.style.pointerEvents = 'auto';
    ScrollTrigger.refresh();
    // Phase 6 adds ScrollTrigger setup here
  },
});
// Beat 1: slider recedes
// Beat 2: panel + hero + sections reveal via stagger
tl.to(sections, {
  opacity: 1,
  y: 0,
  duration: 0.5,
  ease: 'power3.out',
  stagger: 0.07,
}, '<0.15');
```

### ScrollTrigger with Custom Scroller
```typescript
// Source: GSAP official docs https://gsap.com/docs/v3/Plugins/ScrollTrigger/
ScrollTrigger.create({
  trigger: el,
  scroller: panelRef.current,  // CRITICAL: never 'window' inside the panel
  start: 'top 85%',
  onEnter: () => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  },
});
```

### Above-Fold Detection After Entry Animation
```typescript
// Recommended pattern for Phase 6 (onComplete callback)
ScrollTrigger.refresh();

const panelRect = panelRef.current!.getBoundingClientRect();
const panelHeight = panelRef.current!.clientHeight;

panel.querySelectorAll('[data-anim="cs-section"]').forEach((section) => {
  const el = section as HTMLElement;
  const rect = el.getBoundingClientRect();
  const relativeTop = rect.top - panelRect.top;

  if (relativeTop >= panelHeight) {
    // Below fold — reset to hidden, hand off to ScrollTrigger
    gsap.set(el, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el,
      scroller: panelRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      },
    });
  }
  // else: entry animation already revealed it — leave opacity: 1
});
```

### CSS scaleY Connector Line (no DrawSVG needed)
```typescript
// Connector line markup
// <div ref={lineRef} className="absolute left-[7px] top-4 w-0.5 bg-accent origin-top" style={{ height: 'calc(100% - 1rem)', transform: 'scaleY(0)' }} />

// Animation trigger
gsap.to(lineRef.current, {
  scaleY: 1,
  duration: 0.4,
  ease: 'power2.inOut',
  transformOrigin: 'top',
});
```

### Reduced Motion: Instant Section Visibility
```typescript
// In the isReducedMotion branch, after panel fades in:
const sections = panel.querySelectorAll('[data-anim="cs-section"]');
gsap.set(sections, { opacity: 1, y: 0, clearProps: 'all' });
// No ScrollTrigger.create() calls
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Raw string in `<p>` for multi-para prose | Split on `\n\n` → multiple `<p>` with different sizes | Editorial readability, magazine feel |
| Placeholder card grid for Processus | Vertical timeline with progressive scroll reveal | Sense of journey, brand identity via accent color |
| Static section render (Phase 5 entry only) | ScrollTrigger on below-fold sections | Sustained engagement through scroll |
| DrawSVG for line animation | CSS `scaleY` on `div` | No paid plugin required |

**Not applicable in this project:**
- Lenis smooth scroll: Out of scope per STATE.md (native scroll preferred unless feel is unsatisfactory)
- React Spring / Framer Motion: Not in stack; GSAP is the animation layer

---

## Open Questions

1. **Entry animation staggers ALL sections vs only above-fold**
   - What we know: Existing `CaseStudyPanel.tsx` entry animation runs a stagger on `querySelectorAll('[data-anim="cs-section"]')` — all 7 sections. This sets ALL of them to `opacity: 1, y: 0` before `onComplete` fires.
   - What's unclear: After the stagger, there is no distinction between "above fold" and "below fold" sections by opacity. The `getBoundingClientRect()` approach in `onComplete` is the correct detection mechanism, but it requires resetting below-fold sections to `opacity: 0` AFTER the stagger already revealed them — which will cause a brief flash.
   - Recommendation: Modify the entry animation to only stagger sections that are within the panel's viewport height. Check `relativeTop < panelHeight` before including in the tween. This is a clean fix and avoids the flash entirely. Or: Split `gsap.set(sections, { opacity: 0, y: 30 })` to only apply to below-fold sections before entry, and let entry animation target above-fold only via a filtered array.

2. **Timeline component GSAP context ownership**
   - What we know: `CaseStudyPanel.tsx` owns `ctxRef` which is reverted in `closePanel`. Timeline needs its own ScrollTriggers.
   - What's unclear: Whether to (a) lift Timeline refs to Panel and create its triggers in Panel's context, or (b) give Timeline its own context reverted via a prop callback.
   - Recommendation: Give Timeline its own `useRef<gsap.Context>` and expose a `cleanup()` function via `useImperativeHandle` or a callback prop. Panel calls it in `closePanel` before the exit animation. This keeps Timeline self-contained.

3. **`text-text` Tailwind token availability**
   - What we know: The project uses `text-accent`, `text-text-secondary` (confirmed in CaseStudyPanel.tsx, CaseStudyHero.tsx). The variable `--color-text` must exist for `text-text` to work.
   - What's unclear: Whether `text-text` is defined in the Tailwind v4 `@theme` block.
   - Recommendation: Verify in the project CSS before authoring `ProseBody.tsx`. If missing, add `--color-text` to the `@theme` block or use a known alternative (the `text-text` class is referenced in `CaseStudyPanel.tsx` line 250 — "text-text italic" — confirming it exists).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 (embedded in vite.config.ts `test` block) |
| Config file | `vite.config.ts` (test key, no separate vitest.config) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CSCONT-01 | Challenge text splits on `\n\n` into multiple `<p>` elements | unit | `npx vitest run src/components/case-study/__tests__/ProseBody.test.tsx` | ❌ Wave 0 |
| CSCONT-01 | First paragraph has `text-lg` class, subsequent have `text-base` | unit | same file | ❌ Wave 0 |
| CSCONT-02 | Solution section renders identical structure to challenge | unit | same file (shared `ProseBody` component) | ❌ Wave 0 |
| CSCONT-03 | Timeline renders one node per `CaseStudyTimelineStep` | unit | `npx vitest run src/components/case-study/__tests__/Timeline.test.tsx` | ❌ Wave 0 |
| CSCONT-03 | Timeline nodes render phase name and duration | unit | same file | ❌ Wave 0 |
| CSVIS-01 | CaseStudySection renders `data-anim="cs-section"` on root | unit | `npx vitest run src/components/case-study/__tests__/CaseStudySection.test.tsx` | ❌ Wave 0 |
| CSVIS-01 | Reduced motion: all sections rendered at opacity 1 (no hidden state) | manual | Visual QA with `prefers-reduced-motion: reduce` in DevTools | — |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/case-study/__tests__/ProseBody.test.tsx` — covers CSCONT-01, CSCONT-02
- [ ] `src/components/case-study/__tests__/Timeline.test.tsx` — covers CSCONT-03
- [ ] `src/components/case-study/__tests__/CaseStudySection.test.tsx` — covers CSVIS-01 (data-anim attribute)

---

## Sources

### Primary (HIGH confidence)
- GSAP official docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — scroller prop, batch, refresh, onEnter
- Existing source code: `src/components/case-study/CaseStudyPanel.tsx` — entry animation, ctxRef, closePanel patterns
- Existing source code: `src/data/projects.ts` — `\n\n` paragraph convention confirmed in challenge/solution strings
- Existing source code: `src/data/types.ts` — `CaseStudyTimelineStep` fields (phase, duration, description)
- Existing source code: `src/hooks/useReducedMotion.ts` — hook API confirmed

### Secondary (MEDIUM confidence)
- GSAP community forum: https://gsap.com/community/forums/topic/40095-scrolltrigger-above-the-fold/ — above-fold handling: separate tween is simpler (endorsed by GSAP moderator)
- GSAP docs: DrawSVGPlugin — confirmed as Club (paid) plugin, excluded from implementation

### Tertiary (LOW confidence — requires validation)
- `text-text` Tailwind token: inferred from `CaseStudyPanel.tsx` line 250 usage (`text-text italic`) — assumed valid but not traced to `@theme` definition

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all libraries already present and working
- Architecture patterns: HIGH — entry animation code is directly readable; ScrollTrigger custom scroller pattern is from official docs
- Pitfalls: HIGH — entry animation / ScrollTrigger conflict is directly observable in existing code; custom scroller requirement is documented project decision
- Timeline implementation: MEDIUM — CSS scaleY approach is verified as viable but exact node sizing left to discretion

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (GSAP 3.x stable; Tailwind v4 stable)
