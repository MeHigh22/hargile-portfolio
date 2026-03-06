---
phase: 03-content-theming
plan: 02
subsystem: ui
tags: [react, tailwind, split-layout, narrative, cta, tdd]

requires:
  - phase: 03-01
    provides: "ProjectData with narrative, industry, colors fields; project content"
provides:
  - "Split-screen Slide layout with hero image, narrative sections, metadata tags"
  - "ContactCTA fixed mailto button"
  - "data-anim attributes on all animatable elements for GSAP targeting"
affects: [03-03-animations, 04-polish]

tech-stack:
  added: ["@testing-library/jest-dom/vitest setup"]
  patterns: ["TDD red-green for component development", "data-anim attribute convention for GSAP targeting"]

key-files:
  created:
    - src/components/layout/ContactCTA.tsx
    - src/components/slider/__tests__/Slide.test.tsx
    - src/components/layout/__tests__/ContactCTA.test.tsx
    - src/test-setup.ts
  modified:
    - src/components/slider/Slide.tsx
    - src/components/layout/AppShell.tsx
    - vite.config.ts

key-decisions:
  - "test-setup.ts with @testing-library/jest-dom/vitest added to vite setupFiles for DOM matchers"
  - "Navigation theme toggle already removed by prior commit (03-03) -- no duplicate change needed"

patterns-established:
  - "data-anim attributes: category, title, narrative, tags, hero -- animation targeting convention"
  - "Pill/chip tag pattern: rounded-full px-3 py-1 text-xs bg-accent/10 text-accent border border-accent/20"

requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04]

duration: 3min
completed: 2026-03-06
---

# Phase 3 Plan 2: Slide Content Layout and Contact CTA Summary

**Split-screen Slide with hero image, Problem/Solution/Outcome narrative, metadata pill tags, and fixed "Travaillons ensemble" mailto CTA**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-06T13:45:51Z
- **Completed:** 2026-03-06T13:49:08Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Restructured Slide.tsx into desktop split-screen (45/55 grid) and mobile overlay layout with gradient scrim
- Added three narrative sections (Probleme, Solution, Resultat) with accent-colored labels
- Added metadata pill tags for industry, tech items, and year
- Created ContactCTA with fixed bottom-right mailto button and hover glow effect
- All animatable elements marked with data-anim attributes for Plan 03 GSAP targeting
- All 74 tests pass with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Restructure Slide.tsx** (TDD)
   - `cc1a958` test(03-02): add failing tests for Slide (RED)
   - `d81b0db` feat(03-02): restructure Slide with split layout, narrative, and metadata tags (GREEN)

2. **Task 2: Create ContactCTA and wire into AppShell** (TDD)
   - `f612d4c` test(03-02): add failing tests for ContactCTA (RED)
   - `4ff8868` feat(03-02): add ContactCTA, wire into AppShell, remove theme toggle (GREEN)

## Files Created/Modified
- `src/components/slider/Slide.tsx` - Split-screen layout with narrative and metadata tags
- `src/components/layout/ContactCTA.tsx` - Fixed mailto CTA button
- `src/components/layout/AppShell.tsx` - Renders ContactCTA between children and grain overlay
- `src/components/slider/__tests__/Slide.test.tsx` - 8 tests for Slide content rendering
- `src/components/layout/__tests__/ContactCTA.test.tsx` - 4 tests for ContactCTA
- `src/test-setup.ts` - @testing-library/jest-dom/vitest setup
- `vite.config.ts` - Added test setupFiles reference

## Decisions Made
- Added `src/test-setup.ts` with `@testing-library/jest-dom/vitest` to enable DOM matchers (toHaveAttribute, toBeInTheDocument) -- was missing from test infrastructure
- Navigation theme toggle was already removed by a prior commit (03-03 color morphing) so no duplicate removal was needed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added test-setup.ts for @testing-library/jest-dom**
- **Found during:** Task 1 (Slide tests)
- **Issue:** `toHaveAttribute` and `toBeInTheDocument` matchers not available -- vite.config.ts had empty setupFiles
- **Fix:** Created `src/test-setup.ts` importing `@testing-library/jest-dom/vitest`, updated vite.config.ts setupFiles
- **Files modified:** src/test-setup.ts, vite.config.ts
- **Verification:** All tests pass with DOM matchers
- **Committed in:** d81b0db (Task 1 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for test infrastructure. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All animatable elements have data-anim attributes ready for GSAP animation targeting in Plan 03
- ContactCTA uses bg-accent which will morph automatically with per-project CSS custom properties
- Slide hero images use proper img tags with lazy/eager loading for performance

## Self-Check: PASSED

All 6 files verified present. All 4 commit hashes verified in git log.

---
*Phase: 03-content-theming*
*Completed: 2026-03-06*
