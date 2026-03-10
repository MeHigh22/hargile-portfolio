---
phase: 04-depth-production-quality
plan: "02"
subsystem: ui
tags: [gsap, parallax, reduced-motion, performance, accessibility, react, typescript]

# Dependency graph
requires:
  - phase: 04-01
    provides: useReducedMotion hook, data-parallax attribute on hero img, scale-[1.05] + overflow-hidden for parallax headroom

provides:
  - useParallax hook with gsap.quickTo + ticker for smooth 12px mouse-driven hero parallax
  - Reduced-motion crossfade branch in animateTransition (0.3s opacity, no spatial movement)
  - will-change lifecycle (promote on transition start, cleanup on complete)
  - Adjacent image preloading after each transition

affects:
  - Any future animation or interaction work in the slider

# Tech tracking
tech-stack:
  added: []
  patterns:
    - gsap.quickTo for per-frame smooth interpolation (avoids per-event GSAP tweens)
    - gsap.ticker.add for RAF-aligned parallax updates
    - isReducedMotion as useCallback dependency for reactive transition branch
    - will-change set/cleared on GSAP timeline onComplete for GPU compositing lifecycle

key-files:
  created:
    - src/hooks/useParallax.ts
    - src/hooks/__tests__/useParallax.test.ts
  modified:
    - src/components/slider/Slider.tsx
    - src/index.css

key-decisions:
  - "useParallax uses activeIndex as dependency to re-init quickTo on slide change (prevents stale element reference)"
  - "isReducedMotion as useCallback dependency (not ref) enables reactive branch switching on media query change"
  - "Color morphing kept in reduced motion mode — not spatial animation, WCAG-safe"
  - "preloadAdjacentImages called in onComplete (post-transition) to avoid competing with transition GPU work"
  - "will-change: auto on prevEl after full-motion transition, not on nextEl (parallax keeps it active)"

patterns-established:
  - "Parallax pattern: quickTo init on effect run + ticker.add for RAF-aligned updates + cleanup on unmount/re-run"
  - "Accessibility gate: isReducedMotion bool gates entire spatial animation branches"

requirements-completed:
  - VIS-03
  - PERF-03
  - PERF-04

# Metrics
duration: 8min
completed: 2026-03-10
---

# Phase 4 Plan 02: Parallax, Reduced Motion & Performance Summary

**Mouse-driven hero parallax via gsap.quickTo+ticker (12px max), accessibility crossfade branch, will-change lifecycle, and adjacent image preloading**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-10T17:02:00Z
- **Completed:** 2026-03-10T17:10:00Z
- **Tasks:** 1 automated + 1 visual checkpoint
- **Files modified:** 4

## Accomplishments

- useParallax hook: GSAP quickTo on hero [data-parallax] element, capped at 12px shift, pauses during transitions via animatingRef
- Reduced-motion branch in animateTransition: 0.3s opacity crossfade replaces 0.8s slide + stagger; content appears immediately
- will-change lifecycle: GPU promotion on transition start, cleanup in onComplete
- Adjacent image preloading (prev/next) called after every transition to warm browser cache
- CSS @media prefers-reduced-motion rule ensures page-load stagger is also disabled for accessibility
- 4 passing TDD tests covering: mousemove listener added, cleanup removes listener+ticker, isReducedMotion gates all setup

## Task Commits

Each task was committed atomically:

1. **TDD RED: useParallax failing tests** - `5e98278` (test)
2. **Task 1: useParallax hook + Slider integration + will-change + preloading** - `79087ef` (feat)

**Plan metadata:** (pending final commit)

_Note: TDD task has RED commit (tests) + GREEN commit (implementation). Visual verification (Task 2) is a checkpoint requiring user approval._

## Files Created/Modified

- `src/hooks/useParallax.ts` - Mouse parallax hook using gsap.quickTo + ticker, 12px MAX_SHIFT, gated by isReducedMotion
- `src/hooks/__tests__/useParallax.test.ts` - 4 tests: listener setup, cleanup, reduced motion gate
- `src/components/slider/Slider.tsx` - Integrated useReducedMotion, useParallax, reduced-motion branch in animateTransition, will-change lifecycle, preloadAdjacentImages
- `src/index.css` - Added @media prefers-reduced-motion rule for [data-anim] elements

## Decisions Made

- `activeIndex` is a `useParallax` parameter (not read from store inside hook) so the effect re-runs on slide change, re-targeting the new active hero element via `getHeroEl()`
- `isReducedMotion` added to `animateTransition`'s `useCallback` dependency array so the transition branch reactively updates when the user toggles system preference
- Color morphing is kept in the reduced motion transition branch — it animates CSS custom properties (not spatial transforms), which is WCAG-compliant
- `preloadAdjacentImages` is a plain module-level function (not hook) since it has no React lifecycle needs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing test failures in `useSliderStore.test.ts`, `projects.test.ts`, and `useHashSync.test.ts` reference project indices 3/5 and expect 12+ projects, but the project list was intentionally trimmed to 3 for the rebuild. These failures are out-of-scope and unrelated to Plan 04-02.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 4 Plan 02 automated tasks complete. Pending visual verification checkpoint (Task 2).
- After user approves: Phase 4 is complete and v1.0 milestone is reached.
- Dev server running at http://localhost:5175

---
*Phase: 04-depth-production-quality*
*Completed: 2026-03-10*
