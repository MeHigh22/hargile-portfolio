# Pitfalls Research

**Domain:** Adding scroll-triggered case study pages to an existing GSAP Observer-based SPA slider
**Researched:** 2026-03-11
**Confidence:** HIGH (pitfalls derived directly from codebase analysis of existing Observer/GSAP setup plus verified community patterns; scroll/animation integration failures are extensively documented across GSAP forums)

---

## Critical Pitfalls

### Pitfall 1: Observer's `preventDefault: true` Silently Blocks All Case Study Scroll

**What goes wrong:**
The existing Observer is created with `preventDefault: true` on the slider container. When a case study panel opens and renders inside or adjacent to that container, every wheel, touch, and pointer event is consumed by the Observer before it reaches the case study's scroll container. Users cannot scroll the case study at all — but the failure is silent (no JS error). On touch devices the address bar may also be suppressed.

**Why it happens:**
`preventDefault: true` on the Observer is correct for the slider — it stops the browser from scrolling the document while swiping between slides. But the Observer target is `containerRef.current` (the full-screen slider div). If the case study renders inside the same DOM subtree, or if the Observer target is `window`, ALL scroll input is intercepted regardless of which element the user intends to scroll.

**How to avoid:**
Kill or disable the Observer when transitioning into a case study, then re-create/re-enable it when returning to the slider. The Observer instance is already stored: `obs.kill()` in the cleanup. Expose the instance ref outside the `useEffect` so it can be toggled. The pattern is:

```ts
// On enter case study:
sliderObserverRef.current?.disable();   // or .kill() + rebuild on return

// On exit case study:
sliderObserverRef.current?.enable();
```

Do NOT use `obs.disable()` as a one-liner at open time and assume it stays disabled — verify the Observer instance is scoped to only the slider container, not `window` or `document`.

**Warning signs:**
- Scrolling does nothing inside the case study panel on first render.
- DevTools Event Listener panel shows `wheel` listeners on the slider container element even when the case study is open.
- On mobile, the case study panel accepts touch-start but the page does not move.

**Phase to address:** Phase 1 of v1.1 (view scaffolding / navigation layer). This must be solved before any scroll-triggered content is wired in. Getting it wrong at scaffold stage means every subsequent ScrollTrigger test produces false negatives.

---

### Pitfall 2: GSAP ScrollTrigger Created with `window` Scroller Misreads a Custom-Container Case Study

**What goes wrong:**
By default, ScrollTrigger uses the window/document as the scroll container. If the case study is implemented as a full-screen overlay with its own `overflow-y: auto` container (the natural SPA pattern for a no-router app), all ScrollTrigger instances will watch the wrong scroller. Triggers never fire, pin spacer is added to the wrong element, and `ScrollTrigger.refresh()` calculates incorrect start/end values.

**Why it happens:**
The no-router SPA cannot use page-level scroll for the case study without unmounting the slider (which causes GSAP timeline state loss and parallax quickTo instances to become stale). The instinct is to animate the case study in an overlay div, but developers forget to pass `scroller` to each ScrollTrigger.

**How to avoid:**
Define a single stable case study scroll container ref, e.g. `caseStudyScrollRef`. Pass it to every ScrollTrigger:

```ts
ScrollTrigger.create({
  trigger: sectionEl,
  scroller: caseStudyScrollRef.current,  // not window
  start: 'top 80%',
  ...
});
```

Also call `ScrollTrigger.refresh()` once after the case study content has fully rendered and its container has measurable height. DOM height must be settled before ScrollTrigger measures trigger positions.

**Warning signs:**
- ScrollTrigger markers (when enabled) appear at the very top of the viewport regardless of where sections are.
- Animations trigger immediately on open rather than at expected scroll positions.
- Pin spacer pushes slider content out of view.

**Phase to address:** Phase 1 of v1.1 (ScrollTrigger integration setup). Establish the custom scroller pattern as the project standard before building any individual section animation.

---

### Pitfall 3: Parent `overflow: hidden` on the Slider Clips the Case Study and Breaks ScrollTrigger Pinning

**What goes wrong:**
The slider container has `overflow-hidden` (`overflow: hidden`) applied via Tailwind. If the case study renders as a child of this container, `overflow: hidden` clips the case study content and prevents it from scrolling. ScrollTrigger pinning also breaks: pinned elements use `position: fixed` internally, which escapes normal stacking but is still clipped by a parent with `overflow: hidden` combined with a transform or `will-change` ancestor.

The existing code applies `will-change: transform, opacity` to slide elements during transitions via GSAP's `gsap.set()`. A promoted composite layer ancestor (`will-change: transform`) creates a new containing block, breaking `position: fixed` for any descendant — including ScrollTrigger's pin spacers.

**Why it happens:**
`overflow: hidden` on the slider is correct for hiding off-screen slides. But it's the wrong parent element for case study content. Developers append the case study inside the slider container for simplicity, not realizing the overflow containment conflict.

**How to avoid:**
Render the case study as a sibling of the slider container, not a child:

```tsx
<AppShell>
  <Slider />                  {/* overflow-hidden stays here */}
  <CaseStudyPanel />          {/* sibling, owns its own scroll context */}
</AppShell>
```

Use CSS (`visibility: hidden; pointer-events: none`) or React conditional rendering to show/hide the panel, but keep it in the DOM as a sibling to avoid mounting cost on each open. If pinning is used inside the case study, ensure no ancestor has `transform`, `perspective`, or `will-change` applied at the time of pinning.

**Warning signs:**
- Case study content is invisible or clipped at the slider's edge.
- Pinned elements jump to the top-left corner when pinning activates.
- DevTools Layers panel shows the case study inside the slider's compositing layer.

**Phase to address:** Phase 1 of v1.1 (DOM architecture). The sibling vs. child rendering decision must be made at scaffold time — refactoring the render tree midway through case study development is expensive.

---

### Pitfall 4: GSAP ScrollTrigger Instances Accumulate Without Cleanup — Memory Leak and Ghost Triggers

**What goes wrong:**
When a user opens a case study, GSAP ScrollTrigger instances are created for each section animation. When they close the case study and reopen it (or open a different project's case study), new instances are created without the old ones being killed. Over multiple open/close cycles, ghost triggers fire out of sequence, scroll jank builds, and in extreme cases (GSAP's known issue: `.kill()` does not always stop `onUpdate()` callbacks) tweens continue to run after unmount.

**Why it happens:**
This is the most documented GSAP + React pitfall. In React SPAs specifically: SPAs do not automatically destroy ScrollTriggers on "navigation" because there is no full unmount. If the case study component stays in the DOM (for performance — avoiding remount animation cost), its `useEffect` cleanup may not run at all between opens. Even when it does run, `ScrollTrigger.killAll()` is too broad and kills slider-related instances.

**How to avoid:**
Use `gsap.context()` scoped to the case study container. Store the context in a ref. Revert on close:

```ts
const ctxRef = useRef<gsap.Context | null>(null);

// On open:
ctxRef.current = gsap.context(() => {
  // all ScrollTrigger.create() calls here
}, caseStudyContainerRef);

// On close:
ctxRef.current?.revert();
ctxRef.current = null;
```

This kills and reverts ONLY the case study's animations — the slider's Observer and parallax instances are unaffected. Do NOT use `ScrollTrigger.killAll()`.

**Warning signs:**
- Opening a case study for the second time shows animations that already played as completed rather than reset.
- Console shows more ScrollTrigger instances than expected when running `ScrollTrigger.getAll().length`.
- Memory usage in the Chrome Task Manager increases monotonically as user opens/closes cases.

**Phase to address:** Phase 1 of v1.1 (open/close lifecycle). The `gsap.context()` pattern must be established as the standard before individual section animations are authored in later phases.

---

### Pitfall 5: Hash URL Collision — `useHashSync` Slider Navigation Intercepts Case Study URLs

**What goes wrong:**
The existing `useHashSync` hook responds to all `popstate` events and maps `window.location.hash` to a project index. If the case study deep-links to sections via hash (e.g., `#atlas/timeline`, `#atlas/results`) the `popstate` handler fires, attempts `goToSlide()` with an unrecognized hash, and either snaps the slider to index 0 or triggers an animation loop.

Additionally, `history.pushState()` is called on every slider index change (inside `useHashSync`). If the case study also uses `pushState` for scroll section tracking, two competing hash writers race on navigation.

**Why it happens:**
`useHashSync` was designed for a single-level hash namespace (`#atlas`, `#pulse`, `#verde`). It has no concept of sub-paths or a "case study is open" mode. Any hash that doesn't match a project ID causes `findIndex` to return `-1`, which is silently ignored — but `popstate` from browser back on a case study URL then navigates the slider unexpectedly.

**How to avoid:**
Extend `useHashSync` with a mode guard. When the case study is open, `popstate` should close the case study instead of navigating the slider:

```ts
// In popstate handler:
if (caseStudyIsOpen) {
  closeCaseStudy();
  return;
}
// existing slider navigation logic
```

Alternatively, use a two-segment hash convention: `#atlas` for the slider, `#atlas/case` for the case study. Parse only the first segment for slider navigation.

Do NOT use real URL path segments (`/atlas/case-study`) — the app has no server-side routing and will 404 on direct load of a path.

**Warning signs:**
- Browser back from inside a case study jumps the slider to a different project instead of closing the case study.
- Hash-based section tracking inside the case study triggers slider animations.
- `useSliderStore` logs goToSlide calls when no user initiated a slide change.

**Phase to address:** Phase 1 of v1.1 (navigation layer / hash strategy). Decide on the hash namespace convention before building case study section anchors. Retrofitting this after content sections have anchor links is painful.

---

### Pitfall 6: CSS Custom Property Color Theme Leaks Into Case Study — Wrong Palette or No Transition

**What goes wrong:**
The slider animates CSS custom properties (`--color-bg`, `--color-accent`, etc.) on `:root` during transitions using GSAP. When a case study opens, it inherits whatever palette was active at the time of opening. Two failure modes occur:

1. The case study starts mid-transition (user clicked "open" during a slide change) and the palette is a GSAP interpolated midpoint — a blended color that belongs to neither project.
2. If the case study scrolls through sections with different visual moods, developers attempt to add per-section GSAP tween of the same `--color-bg` custom property on `:root`. This now races with the slider's color morph timeline if the user returns to the slider while the case study's timeline is in progress.

**Why it happens:**
Using `:root`-level CSS custom properties is correct for the slider's global theming but creates a single shared mutable namespace. Case studies that also want per-section color shifts need their own scoped theming system, not writes to `:root`.

**How to avoid:**
Scope case study color overrides to the case study container element, not `:root`:

```ts
gsap.to(caseStudyContainerRef.current, {
  '--cs-bg': sectionColors.bg,
  '--cs-accent': sectionColors.accent,
  duration: 0.5,
});
```

Define case study CSS variables separately (prefixed `--cs-`) that do not conflict with slider variables. Never tween `:root` from inside a ScrollTrigger scoped to the case study container. Kill all case study `--cs-*` tweens when closing, and reset the variables.

Guard the case study open gesture: if `isAnimating` is true in the slider store, block the "open case study" action until the transition completes.

**Warning signs:**
- Case study opens with a muddy or wrong background color.
- Returning to the slider after a long case study session shows the slider in unexpected colors.
- DevTools Computed Styles on `:root` shows `--color-bg` still changing after the slider transition completed.

**Phase to address:** Phase 2 of v1.1 (per-section theming). Must be scoped before color animations are authored in any section.

---

### Pitfall 7: Lenis Re-enabling Mid-Case-Study Conflicts with ScrollTrigger's Scroller Measurement

**What goes wrong:**
Lenis smooth scroll is currently disabled during slider operation. The natural instinct when building the case study is to re-enable Lenis for the smooth scroll feel inside the case study. However, if ScrollTrigger is not configured with Lenis's `scrollerProxy`, it measures scroll positions against the raw DOM scroll position — but Lenis intercepts scroll events and advances a virtual scroll position. The result: ScrollTrigger triggers fire at wrong positions, resize recalculations produce marker drift, and pinned sections create blank padding space.

**Why it happens:**
Lenis and ScrollTrigger each assume they are the single source of truth for scroll position. Lenis exposes a `scrollerProxy` integration path for ScrollTrigger, but it requires explicit wiring and must be set up before any ScrollTrigger instances are created.

**How to avoid:**
If Lenis is used inside the case study, set up the `scrollerProxy` integration unconditionally and call `ScrollTrigger.refresh()` after Lenis initializes:

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });

ScrollTrigger.scrollerProxy(caseStudyScrollRef.current, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value, { immediate: true });
    }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});
```

Alternatively, avoid Lenis inside the case study entirely and use CSS `scroll-behavior: smooth` with native scroll. Native scroll has improved dramatically and avoids the integration overhead. ScrollTrigger works natively with standard DOM scroll.

**Warning signs:**
- ScrollTrigger markers appear offset from their trigger elements when Lenis is active.
- Pinned sections create a visible gap after they unpin.
- `ScrollTrigger.refresh()` called after Lenis init does not fix the offset (indicates `scrollerProxy` was not set up).

**Phase to address:** Phase 1 of v1.1 (scroll infrastructure decision). Choose Lenis + proxy OR native scroll before building any section. Switching between the two mid-development requires updating every ScrollTrigger instance.

---

### Pitfall 8: Animated Metric Counters Play Once Then Stay Frozen (or Re-Trigger on Every Scroll Pass)

**What goes wrong:**
Counter animations (0 → 847 projects, 0 → 99% satisfaction) are a signature element of agency case studies. Two opposite failure modes are common:

1. Counter plays when the section enters view, but if the user scrolls back up and down again, it does not replay — it stays at the final value. The effect feels broken on revisit.
2. Counter is triggered by a `ScrollTrigger` with no `once: true` and wrong `toggleActions` — it plays every time the section enters the viewport, including during a slow scroll-back, creating a confusing number regression.

**Why it happens:**
ScrollTrigger's default `toggleActions: "play none none none"` plays the animation on enter but does not reverse it. Developers either want `once: true` (play once, never again) or `toggleActions: "play none none reset"` (reset to 0 when scrolled out, replay when scrolled in). They often implement neither and get the broken "frozen at final value" behavior.

**How to avoid:**
For counters, use `once: true` so they fire when first visible and then become static. This matches how real dashboards feel — data appears as you "discover" it.

```ts
ScrollTrigger.create({
  trigger: metricsEl,
  scroller: caseStudyScrollRef.current,
  start: 'top 75%',
  once: true,
  onEnter: () => animateCounter(counterEl, targetValue),
});
```

Use GSAP's `gsap.to(obj, { value: target, onUpdate: () => el.textContent = Math.round(obj.value) })` pattern for frame-accurate counter animation, not `setInterval`.

**Warning signs:**
- Counter freezes at final value after first play; scrolling away and back shows no replay.
- Counter runs backwards when scrolling up through the section.
- Counter restarts from 0 mid-way through a slow scroll-down.

**Phase to address:** Phase 3 of v1.1 (metrics section). Establish the `once: true` + GSAP counter pattern as the project standard for all metric animations.

---

### Pitfall 9: Timeline Component DOM Pinning Fights the Case Study's Scrollable Container

**What goes wrong:**
A horizontal or vertical animated process timeline (discovery → design → dev → launch) is typically implemented with ScrollTrigger pinning: the timeline element stays fixed while content scrolls, then unpins. When the case study uses a custom scrollable container (not `window`), ScrollTrigger's pinning uses `position: fixed` internally. `position: fixed` is relative to the viewport, but the custom scroll container is not the viewport — so the pinned element appears in the wrong position or outside the container's visible area.

Additionally, `pinSpacing: true` (the default) adds padding to compensate for the pinned section's duration. In a custom scroller, this padding is added relative to the wrong parent, creating an unexpected whitespace block.

**Why it happens:**
ScrollTrigger's pin implementation was designed for `window` as the scroller. Custom scroller support exists but the `pinType` must be explicitly set to `"transform"` (uses `transform: translateY()` instead of `position: fixed`) when the scroller is not the window. Without this, pins escape the container.

**How to avoid:**
When pinning inside a custom scroll container, always set `pinType: "transform"`:

```ts
ScrollTrigger.create({
  trigger: timelineEl,
  scroller: caseStudyScrollRef.current,
  pin: true,
  pinType: 'transform',  // critical for non-window scrollers
  scrub: true,
  start: 'top top',
  end: '+=600',
});
```

Test pin behavior with DevTools at multiple breakpoints. On mobile, consider disabling pinning (`pin: false` when `window.innerWidth < 768`) and using a simpler sequential reveal instead.

**Warning signs:**
- Pinned timeline element jumps to (0, 0) of the viewport when pinning activates.
- Whitespace gap appears below the timeline section after it unpins.
- Pin behavior works in browser but breaks inside the custom scroll container.

**Phase to address:** Phase 2 of v1.1 (timeline section). The `pinType: "transform"` requirement must be documented as a project standard before any timeline pinning is implemented.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Rendering case study as a child of the slider container | Less DOM restructuring | `overflow: hidden` clips case study; `will-change` ancestor breaks `position: fixed` pins; hard to remove later | Never |
| Using `ScrollTrigger.killAll()` on case study close | Simple cleanup in one line | Kills slider Observer and parallax quickTo instances, causing broken slider on return | Never — use `gsap.context().revert()` instead |
| Animating `:root` CSS custom properties from inside case study ScrollTriggers | Reuses existing theme infrastructure | Races with slider's color morph; difficult to reset when closing | Never — scope to case study container |
| Skipping `scrollerProxy` and hoping ScrollTrigger works with Lenis | Saves setup time initially | Trigger positions drift, pins create blank space, resize breaks layout | Never if Lenis is used |
| Keeping the Observer active while the case study is open | Less state management | Wheel events navigate the slider while user tries to scroll the case study | Never |
| Using `setInterval` for counter animations | Simple to implement | Not synchronized with GSAP's tick, drifts on slow devices, doesn't respond to `prefers-reduced-motion` | Only for throwaway prototypes |
| Building case study route with real URL path (`/atlas`) | Better UX for deep linking | 404 on direct load in a no-server SPA; requires server-side redirect config | Only if a server/CDN is configured with fallback rules |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GSAP Observer + ScrollTrigger | Both active simultaneously — Observer's `preventDefault` blocks ScrollTrigger's scroll detection | Kill/disable Observer when entering case study; re-enable on return to slider |
| Lenis + ScrollTrigger | Adding Lenis without `scrollerProxy` setup | Either skip Lenis and use native scroll, or wire `scrollerProxy` before creating any ScrollTrigger instance |
| GSAP `gsap.context()` + React | Not scoping context to a container ref — context captures global instances | Pass the container DOM element as the second argument to `gsap.context(el)` |
| ScrollTrigger + custom scroller pinning | Using default `pinType` with a non-window scroller | Always set `pinType: "transform"` for custom scroll containers |
| Hash-based routing + case study sections | Allowing `popstate` to reach `useHashSync` when case study is open | Guard `popstate` handler with a "case study open" state check before slider navigation runs |
| CSS custom property tweening + case study sections | Tweening `:root` variables from ScrollTrigger callbacks | Tween variables on the case study container element; use `--cs-` prefixed variable names |
| GSAP `ScrollTrigger.refresh()` timing | Calling refresh before case study container has rendered and has measurable height | Call `ScrollTrigger.refresh()` in a `useLayoutEffect` or after a `requestAnimationFrame` post-render |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `will-change: transform` left on slider slides after transition | GPU memory not freed, compositing overhead builds up on each slide change | The existing code already removes `will-change` in `onComplete` — verify case study open/close does not skip this cleanup | After 10+ slide transitions without cleanup |
| ScrollTrigger watching too many independent elements | ScrollTrigger recalculates all trigger positions on every resize; with 30+ triggers it becomes measurable | Use `ScrollTrigger.batch()` for gallery reveal animations; group section triggers in one timeline | 20+ individual ScrollTrigger instances in the case study |
| Scrub animations with `duration` that is longer than the scroll distance | Scrub feels delayed and unresponsive; animation never completes before next section | Tune `end` position to match expected scroll distance; keep scrub duration proportional | Any pinned scrub where `end - start` distance is shorter than the tween duration |
| Animating non-compositor CSS properties in ScrollTrigger callbacks | Layout thrashing on scroll — paint bars in DevTools exceed frame budget | Stick to `transform` and `opacity` for all scroll-driven animations; use CSS `--cs-*` variables for color-only transitions (no layout impact) | Immediately on lower-end devices |
| Case study images not lazy-loaded | Opening a case study loads all gallery images immediately, stalling the scroll | Use `loading="lazy"` on gallery images and IntersectionObserver for scroll-triggered galleries | On first open with a large deliverables gallery |
| Animated SVG charts with complex path morphing | SVG path morphing recalculates paint on every frame | Use GSAP DrawSVG or CSS `stroke-dashoffset` animation (compositor-safe) instead of `d` attribute tweening | Any SVG path tween with `d` attribute |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No clear "close" affordance for the case study | User feels trapped; cannot return to slider to see other projects | Fixed close button (top-right) visible at all scroll positions; Escape key also closes |
| Case study entry does not return to slider scroll position | User opens Atlas case study from slide 0, reads it, closes, and slider is at slide 2 | Record `currentIndex` before opening; restore it on close (no animation needed, just position restore) |
| Scroll position inside case study not reset on re-open | Open case study → scroll to bottom → close → reopen: starts at bottom, not top | On close, reset `caseStudyScrollRef.current.scrollTop = 0` (instant, before animation) |
| Case study transition too slow to feel like a natural "page open" | User feels the animation is getting in their way when clicking between projects | Cap enter transition at 400ms; make it feel like a sheet/panel sliding in, not a slow cinematic reveal |
| No reduced-motion fallback for case study scroll animations | Users with `prefers-reduced-motion` see no animation state changes — sections appear frozen | Check `isReducedMotion` before creating ScrollTrigger instances; use `toggleClass` instead of tween for instant state changes |
| Metric counters animate at the wrong size on mobile | Counter text overflows its container during animation (font size not responsive) | Size counter containers with `min-width` based on the target value's digit count; test at 375px viewport |
| Process timeline unreadable at mobile breakpoints | Horizontal timeline collapses to 4 dots with no labels | Design mobile-first: vertical stacked timeline for mobile, horizontal scrub for desktop only |

---

## "Looks Done But Isn't" Checklist

- [ ] **Observer disabled on case study open:** Verify `obs.disable()` or `obs.kill()` is called before case study scroll container becomes interactive
- [ ] **ScrollTrigger custom scroller wired:** All `ScrollTrigger.create()` calls inside the case study pass `scroller: caseStudyScrollRef.current`
- [ ] **gsap.context() scoped and reverted on close:** `ctxRef.current?.revert()` executes on every close path (button click, Escape key, browser back)
- [ ] **Case study is a sibling of Slider in DOM:** Verify in DevTools Elements panel — the case study div must NOT be a descendant of the slider's `overflow-hidden` container
- [ ] **Hash namespace guarded:** Browser back from case study closes it rather than navigating the slider
- [ ] **`:root` custom properties not tweened from case study:** Grep for `document.documentElement` inside case study components — must be zero occurrences
- [ ] **`pinType: "transform"` on all pins:** Every `pin: true` ScrollTrigger that uses a non-window scroller has `pinType: "transform"` set
- [ ] **`ScrollTrigger.refresh()` called after case study renders:** Called in `useLayoutEffect` or post-paint RAF, not in the same synchronous frame as DOM insertion
- [ ] **Counter animations use `once: true`:** All metric counters fire exactly once per case study open, not on every scroll pass
- [ ] **Scroll position reset on close:** `caseStudyScrollRef.current.scrollTop = 0` is called before the close animation completes
- [ ] **Reduced-motion case study path:** Open DevTools → Rendering → prefers-reduced-motion: reduce; verify case study sections show content without jank or blank states
- [ ] **`isAnimating` guard on case study open:** The "open case study" gesture is blocked while the slider's transition is in progress

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Observer not disabled (scroll blocked in case study) | LOW | Add `obs.disable()` call to the open handler; expose the obs ref outside `useEffect` via a module-level ref |
| ScrollTrigger instances accumulate (ghost triggers) | MEDIUM | Run `ScrollTrigger.getAll()` in console to inventory; refactor to `gsap.context()` pattern; add cleanup verification to the open/close cycle test |
| Case study rendered as slider child (clipping) | HIGH | Restructure JSX to render case study as AppShell sibling; retest all ScrollTrigger positions and pin behavior after move |
| Hash routing conflict (back button navigates slider) | LOW | Add mode guard to `popstate` handler; no animation or visual changes required |
| `:root` tween race condition on close | MEDIUM | Kill case study ScrollTrigger context immediately on close; add a `gsap.killTweensOf(document.documentElement)` guard before re-enabling slider |
| Lenis + ScrollTrigger position drift | MEDIUM | Decide: drop Lenis from case study and use native scroll (preferred), or add `scrollerProxy`; either path requires retesting all trigger positions |
| Pinned timeline broken in custom scroller | LOW | Add `pinType: "transform"` to the failing ScrollTrigger; verify with `pin: true` and custom `scroller` that element stays within the container |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Observer blocks case study scroll (Pitfall 1) | v1.1 Phase 1 — view scaffolding | Manually scroll case study while Observer should be disabled; confirm slider does not respond |
| ScrollTrigger using wrong scroller (Pitfall 2) | v1.1 Phase 1 — ScrollTrigger setup | Enable markers temporarily; confirm markers appear at correct element positions inside the case study container |
| `overflow: hidden` parent clipping (Pitfall 3) | v1.1 Phase 1 — DOM architecture | Inspect Elements panel; case study div must be a sibling of the slider div, not a child |
| ScrollTrigger instance accumulation (Pitfall 4) | v1.1 Phase 1 — open/close lifecycle | Run `ScrollTrigger.getAll().length` after 5 open/close cycles; count must not grow |
| Hash URL collision (Pitfall 5) | v1.1 Phase 1 — navigation layer | Press browser back from inside case study; confirm it closes the case study, not navigates the slider |
| CSS custom property theme leak (Pitfall 6) | v1.1 Phase 2 — per-section theming | Open case study mid-transition; confirm palette is correct. Return to slider; confirm slider colors are correct |
| Lenis + ScrollTrigger conflict (Pitfall 7) | v1.1 Phase 1 — scroll infrastructure | Scroll infrastructure decision made once at scaffold; confirm no Lenis + ScrollTrigger without `scrollerProxy` |
| Counter animation state management (Pitfall 8) | v1.1 Phase 3 — metrics section | Open case study, scroll past metrics. Close. Reopen. Counters must replay from 0 |
| Timeline pinning in custom scroller (Pitfall 9) | v1.1 Phase 2 — timeline section | Scroll through timeline section; pinned element stays within visible case study area; no blank gap after unpin |

---

## Sources

- [GSAP Observer + ScrollTrigger coexistence discussions](https://gsap.com/community/forums/topic/34035-gsap-observer-scroll-trigger/) — MEDIUM confidence (community forum, consistent pattern across multiple threads)
- [How to properly disable ScrollTrigger and Observer instance when scrolling to anchor link](https://gsap.com/community/forums/topic/40860-how-to-properly-disable-scrolltrigger-and-observer-instance-when-scrolling-to-the-anchor-link/) — MEDIUM confidence
- [ScrollTrigger + Observer - GSAP community](https://gsap.com/community/forums/topic/40682-scrolltrigger-observer/) — MEDIUM confidence
- [ScrollTrigger tips & mistakes — official GSAP documentation](https://gsap.com/resources/st-mistakes/) — HIGH confidence (official docs, SPA cleanup pattern explicitly documented)
- [GSAP React guide](https://gsap.com/resources/React/) — HIGH confidence (official docs, `gsap.context()` + `useLayoutEffect` pattern)
- [ScrollTrigger and React component cycle cleanup](https://gsap.com/community/forums/topic/35810-scrolltrigger-and-react-component-cycle-cleanup/) — MEDIUM confidence
- [ScrollTrigger with Lenis smooth scroll — problem with scrollerProxy setup](https://gsap.com/community/forums/topic/34814-scrolltrigger-with-lenis-smooth-scroll-problem-with-the-scrollerproxy-setup/) — HIGH confidence (directly documents the marker drift and blank space symptoms)
- [ScrollTrigger in overflow container](https://gsap.com/community/forums/topic/38558-scrolltrigger-in-overflow-container/) — MEDIUM confidence
- [Scroll trigger issue when html overflow:hidden](https://gsap.com/community/forums/topic/34727-scroll-trigger-issue-when-html-overflowhidden/) — MEDIUM confidence
- [Pin elements, overflow hidden and scrolling](https://gsap.com/community/forums/topic/41905-pin-elements-overflow-hidden-and-scrolling/) — MEDIUM confidence
- [ScrollTrigger not working on Single Page App page transition](https://gsap.com/community/forums/topic/25012-scrolltrigger-not-working-on-single-page-app-page-transition/) — MEDIUM confidence
- [SPA scroll restoration patterns](https://www.davidtran.dev/blogs/scroll-restoration-in-spas) — MEDIUM confidence
- [Intersection Observer over Scroll Listener — performance](https://pyk.sh/blog/2025-10-01-intersection-observer-over-scroll-listener) — HIGH confidence (documents scroll listener vs IntersectionObserver tradeoffs)
- [GSAP in practice: avoid the pitfalls — Marmelab 2024](https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html) — HIGH confidence (engineering blog, production experience)
- [Optimizing GSAP in Next.js 15: cleanup best practices](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) — MEDIUM confidence
- Direct codebase analysis of `Slider.tsx`, `useHashSync.ts`, `useParallax.ts`, `useSliderStore.ts` — HIGH confidence (first-party, exact code paths)

---

*Pitfalls research for: Adding scroll-triggered case study pages to existing GSAP Observer-based SPA (Hargile Portfolio v1.1)*
*Researched: 2026-03-11*
