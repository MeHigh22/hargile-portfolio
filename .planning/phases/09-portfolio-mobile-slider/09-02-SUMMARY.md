---
phase: 09-portfolio-mobile-slider
plan: 02
subsystem: ui
tags: [react, gsap, observer, mobile, touch, accessibility, portfolio]

# Dependency graph
requires:
  - phase: 09-portfolio-mobile-slider
    plan: 01
    provides: Two-breakpoint CSS system, DotNav, .project .left mobile rule

provides:
  - GSAP Observer installed on window with tolerance:40, onLeft/onRight/onDown/onUp directional callbacks
  - touch-action: pan-y on .project .left inside @media (max-width: 767px) — prevents scroll conflict
  - Swipe hint "Glissez →" with localStorage gate and GSAP fromTo animation
  - aria-label="Projet précédent" and aria-label="Projet suivant" on nav arrow buttons

affects:
  - 09-03 (human verification checkpoint — confirms touch navigation works in browser)

# Tech tracking
tech-stack:
  added:
    - gsap/Observer (imported and registered in PortfolioPage.tsx)
  patterns:
    - GSAP Observer useEffect with empty dependency array, killed in useEffect cleanup return
    - Live store read via usePortfolioStore.getState().currentIndex inside Observer callbacks (no stale closure)
    - localStorage-gated one-time UI affordance hint with GSAP fromTo animation
    - touch-action: pan-y on scrollable text panel to prevent touch event conflict with swipe navigation

key-files:
  created: []
  modified:
    - src/pages/portfolio/PortfolioPage.tsx
    - src/pages/portfolio/PortfolioPage.css

key-decisions:
  - "Observer reads live index via usePortfolioStore.getState().currentIndex — not store.currentIndex closure — to avoid stale value on rapid gesture"
  - "swipe-hint base styles (display:none) placed before @media block — mobile block overrides to display:block, matching DotNav pattern established in 09-01"
  - "touch-action: pan-y added only to .project .left (the scrollable text panel) — not globally — so natural vertical scroll is preserved inside that element while horizontal swipe propagates to Observer"

requirements-completed: [MOB-03, MOB-05]

# Metrics
duration: 2min
completed: 2026-04-22
---

# Phase 9 Plan 02: GSAP Observer + Touch CSS Summary

**GSAP Observer installed with tolerance:40 and all four directional callbacks using live store reads; touch-action: pan-y added to scrollable text panel; one-time swipe hint wired with GSAP animation and localStorage gate; nav buttons labelled in French**

## Status: Partial — Awaiting Checkpoint

Tasks 1 and 2 are complete. Task 3 is a `checkpoint:human-verify` gate — awaiting browser verification.

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-22T15:05:17Z
- **Completed (autonomous tasks):** 2026-04-22T15:07:33Z
- **Tasks:** 2/3 (Task 3 is human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- Installed GSAP Observer on window with `tolerance: 40`, all four directional callbacks (onLeft → next, onRight → prev, onDown → next, onUp → prev), each reading live index via `usePortfolioStore.getState().currentIndex` to avoid stale closure
- Observer killed in useEffect cleanup: `observerRef.current?.kill()`
- Added `touch-action: pan-y` to `.project .left` inside the `@media (max-width: 767px)` block — allows vertical scroll in text panel without triggering Observer's horizontal swipe detection
- Added one-time swipe affordance hint `div.swipe-hint` with `aria-hidden="true"`, animated via GSAP `fromTo` (opacity 0→1, delay 0.5s after 800ms timeout), auto-fading after 2s; dismissed immediately on `touchstart`/`mousedown` with `localStorage.setItem('portfolio-swipe-seen', '1')`
- Added `aria-label="Projet précédent"` and `aria-label="Projet suivant"` to nav arrow buttons

## Task Commits

1. **Task 1: Install GSAP Observer and swipe hint in PortfolioPage.tsx** — `2cc5457` (feat)
2. **Task 2: Add touch-action and swipe-hint CSS to PortfolioPage.css** — `4b1b5ba` (feat)

## Files Modified

- `src/pages/portfolio/PortfolioPage.tsx` — Observer import, observerRef + hintRef, Observer useEffect, swipe hint useEffect, aria-labels on nav buttons, swipe-hint JSX div
- `src/pages/portfolio/PortfolioPage.css` — `.swipe-hint` base styles (display:none, fixed, opacity:0), `touch-action: pan-y` on `.project .left`, `.swipe-hint { display: block }` inside 767px block

## Decisions Made

- Observer reads live index via `usePortfolioStore.getState().currentIndex` inside callbacks, not the `store.currentIndex` closure, to avoid stale values on rapid gesture sequences
- `swipe-hint` base style `display: none` placed before the mobile media query (consistent with DotNav pattern from 09-01); mobile block overrides to `display: block`
- `touch-action: pan-y` scoped only to `.project .left` (the scrollable text panel), not applied globally, to preserve natural vertical scroll behavior in the text area while horizontal gestures propagate to the GSAP Observer

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — swipe hint renders with real text content ("Glissez →"). Observer callbacks invoke the existing `go()` function with live index reads.

## Threat Flags

No new threat surface detected. Observer reads only touch/pointer events from window — no network I/O, no user data collection. localStorage write stores only constant string '1'.

## Checkpoint Pending: Task 3 (human-verify)

**What was built:** GSAP Observer with tolerance:40 swipe navigation, touch-action pan-y scroll guard, one-time swipe hint, and French aria-labels on nav arrows.

**Verification instructions:** See 09-02-PLAN.md Task 3 `<how-to-verify>` section for full 23-step browser verification checklist including mobile emulation, swipe navigation test, scroll conflict test, swipe hint localStorage gate, desktop regression check, and accessibility attribute inspection.

## Self-Check: PASSED

- `src/pages/portfolio/PortfolioPage.tsx` — FOUND
- `src/pages/portfolio/PortfolioPage.css` — FOUND
- `.planning/phases/09-portfolio-mobile-slider/09-02-SUMMARY.md` — FOUND
- Commit `2cc5457` (Task 1) — FOUND
- Commit `4b1b5ba` (Task 2) — FOUND
