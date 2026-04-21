---
phase: 08-portfolio-page-react-tsx
plan: 02
subsystem: ui
tags: [react, typescript, svg, zustand, vitest, css]

# Dependency graph
requires:
  - 08-01 (types.ts, usePortfolioStore, PortfolioPage.css, portfolioDataAdapter)
provides:
  - src/pages/portfolio/components/CoverSlide.tsx
  - src/pages/portfolio/components/Marquee.tsx
  - src/pages/portfolio/components/OutroSlide.tsx
  - src/pages/portfolio/components/YearNav.tsx
  - src/pages/portfolio/components/ProgressBar.tsx
  - src/pages/portfolio/components/TweaksPanel.tsx
  - src/pages/portfolio/components/ProjectSlide.tsx
  - src/pages/portfolio/components/SceneRenderer.tsx (6 SVG scene sub-components)
  - src/pages/portfolio/__tests__/PortfolioPage.test.tsx (4 smoke + scene tests)
affects:
  - 08-03-PLAN (PortfolioPage.tsx wires all 8 components with GSAP transitions)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - React useId() for unique SVG gradient/pattern IDs per SceneRenderer instance — prevents defs collision when multiple instances render simultaneously
    - CSS-only Marquee animation via dual-track div — no GSAP, no JS scroll
    - TweaksPanel reads/writes localStorage and applies data-theme/data-display/--blue to portfolioRef element
    - GSAP mock extended with fromTo/from/killTweensOf to cover SlideAmbience usage in App regression test

key-files:
  created:
    - src/pages/portfolio/__tests__/PortfolioPage.test.tsx
    - src/pages/portfolio/components/CoverSlide.tsx
    - src/pages/portfolio/components/Marquee.tsx
    - src/pages/portfolio/components/OutroSlide.tsx
    - src/pages/portfolio/components/YearNav.tsx
    - src/pages/portfolio/components/ProgressBar.tsx
    - src/pages/portfolio/components/TweaksPanel.tsx
    - src/pages/portfolio/components/ProjectSlide.tsx
    - src/pages/portfolio/components/SceneRenderer.tsx
  modified: []

key-decisions:
  - "GSAP mock must include fromTo, from, killTweensOf — SlideAmbience (used in App regression test) calls gsap.fromTo() in useEffect"
  - "App regression test uses try/catch not expect().not.toThrow() — React 18 act() wraps effect errors into AggregateError which hides the root cause"
  - "Observer mock must return { kill, enable, disable } object from create() — Slider calls obs.kill() in cleanup, undefined would throw TypeError"
  - "YearNav derives unique years from slides array (Set + sort desc) — no separate data structure needed"
  - "TweaksPanel applies theme via removeAttribute for default 'ink' theme — keeps CSS specificity clean (no data-theme on root = default vars)"

patterns-established:
  - "SceneRenderer useId() pattern: all SVG ids prefixed with uid from useId() — required for no-collision when scene appears multiple times (e.g. 2 dashboard projects)"
  - "Portfolio components use CSS class names only — no Tailwind, no React style prop on GSAP-animated elements"
  - "Gallery and Editorial scenes do not use SceneWrapper — they have a light background (F2F1EC) requiring different mb-head styling"

requirements-completed: [PORT-02, PORT-04]

# Metrics
duration: 8min
completed: 2026-04-21
---

# Phase 08 Plan 02: Slide Components Summary

**8 portfolio components built (CoverSlide, Marquee, OutroSlide, YearNav, ProgressBar, TweaksPanel, ProjectSlide, SceneRenderer with 6 SVG scenes) — 4 tests pass, TypeScript clean, 08-03 fully unblocked**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-21T08:11:28Z
- **Completed:** 2026-04-21T08:19:46Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- PortfolioPage smoke tests (TDD) written first, confirmed RED, then GREEN — both pass
- CoverSlide: two-column layout with globe-unbundled iframe, stats, onGoToProjects callback
- Marquee: dual-track CSS-only animation via marquee keyframe, no GSAP, no JS scroll
- OutroSlide: real Hargile contact details (contact@hargile.com, Rue Sterckx 5, +32 477 04 50 80), Instagram + LinkedIn SVG socials
- YearNav: reads activeYear from usePortfolioStore, derives unique years, renders project dots for active year
- ProgressBar: proportional fill bar with tick marks, current/total counter
- TweaksPanel: segmented controls for theme/font/accent, localStorage persistence, applies to portfolioRef via data-* attributes and CSS var override
- SceneRenderer: 6 SVG scene sub-components (DashboardScene, TradingScene, GalleryScene, BankingScene, EditorialScene, ShopScene) ported from static HTML, useId() prevents gradient ID collision
- ProjectSlide: two-column layout with SceneRenderer in right column, metric chips, problem/solution/result rows, tags

## Task Commits

1. **Task 1: CoverSlide, Marquee, OutroSlide, YearNav, ProgressBar, TweaksPanel + smoke tests** - `79136a1` (feat)
2. **Task 2: ProjectSlide, SceneRenderer (6 SVG scenes)** - `c3fac1e` (feat)

## Files Created/Modified
- `src/pages/portfolio/__tests__/PortfolioPage.test.tsx` — 4 tests: SceneRenderer (2) + PortfolioPage smoke (2)
- `src/pages/portfolio/components/CoverSlide.tsx` — Cover slide with globe iframe, stats, marquee
- `src/pages/portfolio/components/Marquee.tsx` — Dual-track CSS animation marquee
- `src/pages/portfolio/components/OutroSlide.tsx` — Contact outro with real Hargile details
- `src/pages/portfolio/components/YearNav.tsx` — Year tabs + project dots controlled nav
- `src/pages/portfolio/components/ProgressBar.tsx` — Slide counter + proportional fill bar
- `src/pages/portfolio/components/TweaksPanel.tsx` — Theme/font/accent panel with localStorage
- `src/pages/portfolio/components/ProjectSlide.tsx` — Per-project two-column layout
- `src/pages/portfolio/components/SceneRenderer.tsx` — 6 SVG scene sub-components with useId()

## Decisions Made
- GSAP mock must include `fromTo`, `from`, `killTweensOf` — required for App regression test (SlideAmbience uses `gsap.fromTo` in useEffect)
- App regression test uses `try/catch` pattern not `expect().not.toThrow()` — React 18 act() wraps errors into AggregateError, hiding the root cause
- Observer mock must return an object with `{ kill, enable, disable }` — Slider.tsx calls `obs.kill()` in effect cleanup
- Gallery/Editorial scenes do not use SceneWrapper — their light (#F2F1EC) background requires customized mb-head styling inconsistent with the dark SceneWrapper
- TweaksPanel `removeAttribute` for default 'ink' theme — avoids data-theme="ink" on the element which would override other theme classes unexpectedly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] GSAP mock incomplete for App regression test**
- **Found during:** Task 1 (TDD RED → GREEN)
- **Issue:** Test `renders App (/) without throwing` threw `AggregateError` from React 18 act() collecting multiple errors: `gsap.fromTo is not a function` (from SlideAmbience) and `obs.kill is not a function` (from Slider cleanup)
- **Fix:** Extended GSAP mock to include `fromTo`, `from`, `killTweensOf`; Observer mock now returns `{ kill: vi.fn(), enable: vi.fn(), disable: vi.fn() }` from `create()`; changed assertion to `try/catch` to expose root cause
- **Files modified:** `src/pages/portfolio/__tests__/PortfolioPage.test.tsx`
- **Commit:** `79136a1`

## Issues Encountered
- None beyond the GSAP mock gap (auto-fixed above).

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- 08-03 (PortfolioPage full implementation) is fully unblocked: all 8 components exist, typed, and tested
- PortfolioPage.tsx stub can now be replaced with full GSAP-driven slide engine importing these components

## Self-Check: PASSED
