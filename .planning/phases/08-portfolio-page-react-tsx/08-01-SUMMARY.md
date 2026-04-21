---
phase: 08-portfolio-page-react-tsx
plan: 01
subsystem: ui
tags: [react-router, zustand, typescript, css, vite, vitest]

# Dependency graph
requires: []
provides:
  - React Router v7 SPA routing (/ -> App, /portfolio/* -> PortfolioPage stub)
  - src/pages/portfolio/types.ts with PortfolioSlideData, MetricChip, SceneKind
  - src/pages/portfolio/portfolioDataAdapter.ts pure adaptProjects() function
  - src/pages/portfolio/usePortfolioStore.ts Zustand store (separate from useSliderStore)
  - src/pages/portfolio/PortfolioPage.css all portfolio CSS scoped under [data-portfolio]
  - public/portfolio/globe-unbundled.html for CoverSlide iframe
  - vite.config.ts server.historyApiFallback: true for SPA refresh support
  - Google Fonts links (Cormorant Garamond, Fraunces, Instrument Serif, Geist Mono) in index.html
affects:
  - 08-02-PLAN (slide components import from types.ts and portfolioDataAdapter.ts)
  - 08-03-PLAN (PortfolioPage.tsx full implementation replaces stub, imports PortfolioPage.css)

# Tech tracking
tech-stack:
  added: [react-router-dom v7]
  patterns:
    - CSS custom properties scoped under [data-portfolio] attribute selector to prevent bleed
    - Pure data adapter function (no React, no side effects) called at module level
    - Separate Zustand store per major UI section (portfolio vs slider)

key-files:
  created:
    - src/pages/portfolio/types.ts
    - src/pages/portfolio/portfolioDataAdapter.ts
    - src/pages/portfolio/usePortfolioStore.ts
    - src/pages/portfolio/PortfolioPage.css
    - src/pages/portfolio/PortfolioPage.tsx (stub)
    - src/pages/portfolio/__tests__/portfolioDataAdapter.test.ts
    - public/portfolio/globe-unbundled.html
  modified:
    - src/main.tsx
    - vite.config.ts
    - index.html
    - src/__tests__/vite-config.test.ts
    - package.json

key-decisions:
  - "React Router v7 BrowserRouter used for /portfolio/* routing; historyApiFallback: true in vite.config.ts ensures dev server SPA refresh works"
  - "All portfolio CSS scoped under [data-portfolio] attribute selector — prevents any CSS bleed into existing slider app at /"
  - "adaptProjects() is a pure function called at module level (not in components) — no React dependency, trivially testable"
  - "usePortfolioStore is a separate Zustand store from useSliderStore — different state shape, independent lifecycle"
  - "Globe _unbundled_ (not _standalone_) copied because it has transparent background and reads --blue CSS var via iframe"
  - "StrictMode NOT added to main.tsx per project memory (removed during GSAP debugging)"

patterns-established:
  - "data-portfolio attribute scope: all portfolio CSS and JS should check for [data-portfolio] ancestor before applying"
  - "SceneKind union type drives which mock scene component renders in ProjectSlide right column"
  - "Synthesized MetricChip fallback: projects without caseStudy.metrics get 3 chips from narrative.outcome"

requirements-completed: [PORT-01, PORT-03, PORT-04]

# Metrics
duration: 5min
completed: 2026-04-21
---

# Phase 08 Plan 01: Portfolio Foundation Summary

**React Router SPA routing wired, all portfolio TypeScript contracts defined, 14-test data adapter suite passing, and full portfolio CSS system scoped under [data-portfolio] — 08-02 slide components are unblocked**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-21T08:03:30Z
- **Completed:** 2026-04-21T08:08:30Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- React Router v7 installed and wired: / renders existing App slider unchanged, /portfolio/* renders PortfolioPage stub
- All TypeScript contracts for 08-02 and 08-03 defined in types.ts (PortfolioSlideData, MetricChip, SceneKind)
- Pure adaptProjects() function maps 22 real Hargile projects with scene detection, metric chip derivation, and year-descending sort
- 14 unit tests covering all PORT-04 adapter behaviors — all passing
- Full portfolio CSS ported from static HTML and scoped under [data-portfolio] to prevent bleed

## Task Commits

1. **Task 1: Install react-router-dom, wire routing, add historyApiFallback, add font links** - `cb07764` (feat)
2. **Task 2: Write types.ts, portfolioDataAdapter.ts, usePortfolioStore.ts, PortfolioPage.css + adapter unit tests** - `023e44b` (feat)

## Files Created/Modified
- `src/main.tsx` — BrowserRouter wrapper, Routes for / and /portfolio/*
- `vite.config.ts` — Added server.historyApiFallback: true
- `index.html` — Added Google Fonts for Cormorant Garamond, Fraunces, Instrument Serif, Geist Mono
- `src/__tests__/vite-config.test.ts` — Added historyApiFallback assertion
- `src/pages/portfolio/PortfolioPage.tsx` — Stub component (will be replaced in 08-03)
- `src/pages/portfolio/types.ts` — PortfolioSlideData, MetricChip, SceneKind type exports
- `src/pages/portfolio/portfolioDataAdapter.ts` — adaptProjects() with SCENE_MAP, metric derivation
- `src/pages/portfolio/usePortfolioStore.ts` — Zustand store (currentIndex, activeYear)
- `src/pages/portfolio/PortfolioPage.css` — All portfolio CSS scoped under [data-portfolio]
- `src/pages/portfolio/__tests__/portfolioDataAdapter.test.ts` — 14 adapter unit tests
- `public/portfolio/globe-unbundled.html` — Three.js CDN globe (transparent bg, reads --blue)
- `package.json` / `package-lock.json` — react-router-dom v7 added

## Decisions Made
- React Router v7 BrowserRouter chosen (no @types package needed, ships own types)
- `historyApiFallback: true` added to Vite dev server so `/portfolio` page refresh does not 404
- All portfolio CSS scoped under `[data-portfolio]` not `:root` — zero risk of bleeding --bg, --ink, --blue into the existing slider app
- Globe _unbundled_ (not _standalone_) copied — transparent background, reads `--blue` CSS variable; standalone variants have black background with loading overlay
- StrictMode intentionally absent from main.tsx per project memory (was removed during GSAP debugging)

## Deviations from Plan

None — plan executed exactly as written.

Note: Pre-existing test failures in `Slide.test.tsx`, `NextProjectCard.test.tsx`, and `projects.test.ts` were identified. These pre-date this plan (caused by prior expansion of projects.ts from 3 to 22 entries). Logged to `.planning/phases/08-portfolio-page-react-tsx/deferred-items.md`.

## Issues Encountered
- None — both tasks completed without blocking issues.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- 08-02 (slide components) is fully unblocked: types.ts, portfolioDataAdapter.ts, and PortfolioPage.css are all in place
- 08-03 (PortfolioPage full implementation) can proceed after 08-02 slide components exist
- The stub PortfolioPage.tsx at `/portfolio` renders correctly; it will be replaced in 08-03

---
*Phase: 08-portfolio-page-react-tsx*
*Completed: 2026-04-21*
