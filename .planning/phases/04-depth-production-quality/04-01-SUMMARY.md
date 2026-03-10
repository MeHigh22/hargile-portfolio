---
phase: 04-depth-production-quality
plan: 01
subsystem: ui
tags: [gsap, react, vite, picture-element, webp, srcset, reduced-motion, performance]

# Dependency graph
requires:
  - phase: 03-content-theming
    provides: Slide.tsx with data-anim attributes, test-setup.ts with jest-dom
provides:
  - useReducedMotion hook (gsap.matchMedia-based, boolean return)
  - matchMedia mock in test-setup.ts for all Phase 4 tests
  - Slide.tsx with picture/source/WebP srcset at 640w/1280w/1920w
  - img scale-[1.05] and data-parallax attribute for Plan 02 parallax targeting
  - Vite manualChunks splitting GSAP into vendor-gsap chunk
  - Font preload link in index.html
affects: [04-02-parallax-transitions, 04-03-performance-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - gsap.matchMedia for media query reactive state in React hooks
    - picture/source pattern with Unsplash URL API for WebP srcset without local assets
    - data-parallax attribute convention for GSAP parallax hook targeting (Plan 02)
    - Vite manualChunks for GSAP vendor isolation

key-files:
  created:
    - src/hooks/useReducedMotion.ts
    - src/hooks/__tests__/useReducedMotion.test.ts
  modified:
    - src/test-setup.ts
    - src/components/slider/Slide.tsx
    - src/components/slider/__tests__/Slide.test.tsx
    - src/data/projects.ts
    - index.html
    - vite.config.ts

key-decisions:
  - "useReducedMotion uses gsap.matchMedia (not raw window.matchMedia) for GSAP ecosystem consistency"
  - "Unsplash URL API used for srcset WebP (&fm=webp&w=N) — no local asset management needed for demo"
  - "heroImg URLs in projects.ts normalized to base URL (removed w=1600) so srcset appends &w= cleanly"
  - "scale-[1.05] on hero img provides parallax headroom, overflow-hidden on container clips edges"
  - "data-parallax attribute on img targets Plan 02 parallax GSAP animations"
  - "GSAP vendor chunk isolated (79kB) from app code for better cache splitting"
  - "Font preload uses as=style on Google Fonts CDN stylesheet URL"

patterns-established:
  - "data-parallax: attribute convention on hero img for GSAP parallax targeting in Plan 02"
  - "picture/source pattern: WebP source first, JPEG fallback, sizes for responsive layout breakpoints"
  - "useReducedMotion: gates all motion in Plan 02 parallax and transition branching"

requirements-completed: [PERF-03, PERF-04]

# Metrics
duration: 3min
completed: 2026-03-10
---

# Phase 4 Plan 1: Performance Foundations Summary

**useReducedMotion hook via gsap.matchMedia, picture/WebP srcset at 3 breakpoints with scale-[1.05] parallax prep, and GSAP vendor chunk splitting (79kB isolated)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-10T15:56:42Z
- **Completed:** 2026-03-10T15:59:57Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- useReducedMotion hook created using gsap.matchMedia, tested with window.matchMedia mock (3 tests passing)
- matchMedia mock added to test-setup.ts for all future Phase 4 tests
- Hero images upgraded from single img to picture/source with WebP (3 breakpoints) and JPEG fallback
- Hero img receives scale-[1.05] and data-parallax attribute, container gets overflow-hidden
- GSAP isolated into vendor-gsap chunk (79kB) in Vite build, font preload added to index.html

## Task Commits

1. **Task 1: useReducedMotion hook + matchMedia test mock** - `941788b` (feat/test)
2. **Task 2: Picture element with srcset + hero parallax prep + font/bundle optimization** - `96258d9` (feat)

## Files Created/Modified

- `src/hooks/useReducedMotion.ts` - GSAP matchMedia-based reduced motion detection hook
- `src/hooks/__tests__/useReducedMotion.test.ts` - 3 tests: default false, reduce active, boolean type
- `src/test-setup.ts` - Added window.matchMedia mock for all test files
- `src/components/slider/Slide.tsx` - Hero panel replaced with picture/source/img, scale-[1.05], data-parallax, overflow-hidden
- `src/components/slider/__tests__/Slide.test.tsx` - 7 new tests for picture, WebP source, srcset, data-parallax, lazy loading
- `src/data/projects.ts` - heroImg URLs normalized (removed w=1600) for clean srcset &w= appending
- `index.html` - Added font preload link for Google Fonts stylesheet
- `vite.config.ts` - Added manualChunks splitting gsap into vendor-gsap, others into vendor

## Decisions Made

- Used `gsap.matchMedia()` over raw `window.matchMedia` for consistent GSAP ecosystem integration
- Unsplash URL API parameters (`&fm=webp`, `&w=N`) used for responsive WebP without local asset management
- heroImg base URLs normalized by removing `w=1600` so srcset can append `&w=640`, `&w=1280`, `&w=1920` cleanly
- `scale-[1.05]` on img gives 5% extra frame for parallax without visible crop at rest
- `overflow-hidden` on container div clips the scaled image edges
- Font preload targets the Google Fonts CSS URL with `as="style"` (stylesheet, not font binary)

## Deviations from Plan

None - plan executed exactly as written.

**Note:** Pre-existing test failures found in projects.test.ts, useHashSync.test.ts, and useSliderStore.test.ts (all expect 12+ projects but dataset has 3). These failures predate Phase 4 and are logged in deferred-items.md.

## Issues Encountered

Pre-existing test failures in 3 test files (6 tests) due to project dataset trimmed from 12 to 3 during earlier rebuild. Not caused by this plan's changes. Documented in `.planning/phases/04-depth-production-quality/deferred-items.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `useReducedMotion` hook ready for Plan 02 parallax and transition branching
- `data-parallax` attribute on hero img targets GSAP parallax in Plan 02
- `scale-[1.05]` provides parallax headroom (img can shift ±5% without revealing edges)
- All 18 new tests passing; existing passing tests unaffected

---
*Phase: 04-depth-production-quality*
*Completed: 2026-03-10*

## Self-Check: PASSED

- FOUND: src/hooks/useReducedMotion.ts
- FOUND: src/hooks/__tests__/useReducedMotion.test.ts
- FOUND: .planning/phases/04-depth-production-quality/04-01-SUMMARY.md
- FOUND: commit 941788b (Task 1)
- FOUND: commit 96258d9 (Task 2)
