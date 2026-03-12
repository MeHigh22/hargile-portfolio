---
phase: 05-scroll-infrastructure-view-scaffold
plan: 01
subsystem: ui
tags: [zustand, typescript, react, case-study, data-layer]

# Dependency graph
requires:
  - phase: 04-depth-production-quality
    provides: ProjectData type, projects array, useSliderStore with isAnimating
provides:
  - CaseStudyContent type hierarchy (5 interfaces) in src/data/types.ts
  - All 3 projects with full French case study content in src/data/projects.ts
  - useViewStore Zustand store for slider/case mode management
  - Unit tests for both data completeness and view state transitions
affects:
  - 05-02 (CaseStudyPanel shell consumes useViewStore and project caseStudy data)
  - 06 (animations wire into useViewStore mode transitions)
  - 07 (final content layers read from caseStudy data)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TDD RED/GREEN for type definitions and data completeness
    - Cross-store guard pattern (useViewStore.openCase reads useSliderStore.getState().isAnimating)
    - Optional data extension on existing type (caseStudy?: CaseStudyContent on ProjectData)

key-files:
  created:
    - src/store/useViewStore.ts
    - src/store/__tests__/useViewStore.test.ts
  modified:
    - src/data/types.ts
    - src/data/projects.ts
    - src/data/__tests__/projects.test.ts

key-decisions:
  - "CaseStudyContent type uses optional field caseStudy? on ProjectData to preserve backward compatibility"
  - "openCase guard checks useSliderStore.getState().isAnimating to prevent palette bleed during slide transitions"
  - "Replaced outdated 12-project tests with accurate 3-project tests matching current data"
  - "All case study content written in French with no lorem ipsum — realistic agency narrative per project domain"

patterns-established:
  - "Cross-store coordination pattern: useViewStore.openCase reads useSliderStore.getState() directly (no subscription needed for one-time guard)"
  - "TDD RED then GREEN: define types + write tests first, populate data second"

requirements-completed: [CSDATA-01, CSVIS-02]

# Metrics
duration: 15min
completed: 2026-03-11
---

# Phase 5 Plan 01: Data Layer & View State Summary

**CaseStudyContent type hierarchy, French case study data for all 3 projects, and useViewStore with isAnimating-guarded mode switching**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-11T11:25:00Z
- **Completed:** 2026-03-11T11:30:00Z
- **Tasks:** 2 (TDD RED + GREEN)
- **Files modified:** 5

## Accomplishments
- Defined 5 new TypeScript interfaces (CaseStudyMetric, CaseStudyTimelineStep, CaseStudyTestimonial, CaseStudyTeamMember, CaseStudyContent) and extended ProjectData with optional caseStudy? field
- Populated all 3 projects (atlas, pulse, verde) with realistic French case study content — no lorem ipsum, each narrative specific to its domain (SaaS analytics, health app, eco marketplace)
- Created useViewStore Zustand store managing mode ('slider' | 'case') and activeProjectId, with openCase blocked while useSliderStore.isAnimating is true
- All 48 tests pass (36 data + 12 view store); TypeScript compiles clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Define CaseStudyContent types and extend ProjectData (RED)** - `c54ac9c` (test)
2. **Task 2: Populate case study data for all 3 projects and create useViewStore (GREEN)** - `f361942` (feat)

_TDD: Task 1 RED commit has 24 failing caseStudy tests, Task 2 GREEN commit makes all 48 pass_

## Files Created/Modified
- `src/data/types.ts` — Added CaseStudyMetric, CaseStudyTimelineStep, CaseStudyTestimonial, CaseStudyTeamMember, CaseStudyContent interfaces; extended ProjectData with caseStudy? optional field
- `src/data/projects.ts` — Added caseStudy property to atlas, pulse, verde with full French content (challenge, solution, 4-step timeline, 3-5 metrics, 4-6 deliverables, testimonial, 3-4 team members)
- `src/data/__tests__/projects.test.ts` — Replaced outdated 12-project tests with 3-project tests + type shape tests + caseStudy completeness tests for all 3 projects
- `src/store/useViewStore.ts` — New Zustand store with mode/activeProjectId/openCase/closeCase; openCase guards against isAnimating
- `src/store/__tests__/useViewStore.test.ts` — Unit tests covering initial state, openCase/closeCase transitions, isAnimating guard, full round-trip

## Decisions Made
- **Backward compatibility:** caseStudy? is optional on ProjectData so existing code using the type doesn't break
- **isAnimating guard:** useViewStore.openCase reads useSliderStore.getState() directly (not via subscription) — this is appropriate since it's a one-time read at call time, not a reactive subscription
- **Tests replaced not extended:** The existing projects.test.ts had tests expecting 12+ projects, which were wrong for the current 3-project state. These were replaced entirely with accurate tests

## Deviations from Plan

None — plan executed exactly as written. TDD RED/GREEN followed as specified.

## Issues Encountered

**Pre-existing test failures (out of scope, logged to deferred-items.md):** `useHashSync.test.ts` and `useSliderStore.test.ts` contain tests referencing `projects[5]` and expecting `totalSlides >= 12`. These were broken before this plan (from the Phase 4 rebuild trimming to 3 projects). Not caused by this plan's changes. Documented in `deferred-items.md` for future cleanup.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Data layer complete: all 3 projects have typed caseStudy content ready for consumption
- useViewStore ready for wiring into AppShell and CaseStudyPanel
- Plan 05-02 can proceed to create the CaseStudyPanel shell and wire view transitions

---
*Phase: 05-scroll-infrastructure-view-scaffold*
*Completed: 2026-03-11*

## Self-Check: PASSED

- `src/data/types.ts` — FOUND
- `src/data/projects.ts` — FOUND
- `src/store/useViewStore.ts` — FOUND
- `src/store/__tests__/useViewStore.test.ts` — FOUND
- `src/data/__tests__/projects.test.ts` — FOUND
- `.planning/phases/05-scroll-infrastructure-view-scaffold/05-01-SUMMARY.md` — FOUND
- Commit `c54ac9c` (TDD RED) — FOUND
- Commit `f361942` (TDD GREEN) — FOUND
- All 48 tests pass
- TypeScript compiles clean (`npx tsc --noEmit` — no errors)
