---
phase: 06-narrative-content-sections
plan: 01
subsystem: ui
tags: [react, typescript, gsap, scrolltrigger, tailwind, vitest, testing-library]

# Dependency graph
requires:
  - phase: 05-scroll-infrastructure-view-scaffold
    provides: CaseStudyPanel with panelRef, gsap.context() scoped to panel, ScrollTrigger scroller architecture

provides:
  - ProseBody component: splits \n\n-delimited text into styled paragraphs with editorial typography
  - Timeline component: vertical accent line with circular nodes, per-node ScrollTrigger reveals
  - Unit tests for both components (16 tests passing)

affects:
  - 06-02-plan (wires ProseBody and Timeline into CaseStudyPanel/CaseStudySection)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TDD green cycle for React components with GSAP mocking via vi.mock
    - data-timeline-node / data-timeline-connector attributes for GSAP targeting
    - gsap.context() + useEffect cleanup return pattern for Timeline
    - reducedMotion early-return guard in useEffect before any GSAP setup

key-files:
  created:
    - src/components/case-study/ProseBody.tsx
    - src/components/case-study/Timeline.tsx
    - src/components/case-study/__tests__/ProseBody.test.tsx
    - src/components/case-study/__tests__/Timeline.test.tsx
  modified: []

key-decisions:
  - "GSAP mock must include registerPlugin: vi.fn() — module-level registerPlugin call at import time requires it"
  - "Timeline node dots use color-mix(in srgb, var(--color-accent) 20%, transparent) for unfilled state — avoids hex/opacity fragility"
  - "Timeline uses data-timeline-node and data-timeline-connector attributes for test targeting without brittle class selectors"

patterns-established:
  - "ProseBody: text.split('\\n\\n').filter(p => p.trim().length > 0) — double-newline splitting with empty guard"
  - "Timeline: rowRefs + nodeRefs arrays via index-keyed ref callbacks for per-node GSAP targeting"
  - "TDD for GSAP components: mock gsap default export with registerPlugin, to, set, context; mock ScrollTrigger separately"

requirements-completed: [CSCONT-01, CSCONT-02, CSCONT-03]

# Metrics
duration: 2min
completed: 2026-03-11
---

# Phase 6 Plan 01: Narrative Content Sections — Building Blocks Summary

**ProseBody (editorial paragraph splitting) and Timeline (ScrollTrigger vertical timeline) as standalone components with 16 passing unit tests**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-11T14:36:34Z
- **Completed:** 2026-03-11T14:39:00Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments
- ProseBody splits `\n\n`-delimited text into `<p>` elements with text-lg first / text-base rest editorial hierarchy
- Timeline renders CaseStudyTimelineStep[] as vertical accent-colored connector line with per-node ScrollTrigger fade reveals
- Reduced motion path in Timeline renders all nodes fully visible with no GSAP setup whatsoever
- 16 unit tests passing across both components; TypeScript compiles clean

## Task Commits

Each task was committed atomically:

1. **Task 1: ProseBody component** - `1eef594` (feat)
2. **Task 2: Timeline component** - `b9f2570` (feat)

**Plan metadata:** (docs commit — see below)

_Note: TDD tasks had one commit each (test + implementation together after GREEN phase confirmed)_

## Files Created/Modified
- `src/components/case-study/ProseBody.tsx` - Editorial paragraph splitter, text-lg/text-base typography, space-y-6 wrapper
- `src/components/case-study/Timeline.tsx` - Vertical accent line + circular nodes, ScrollTrigger per-node reveals, reduced motion path
- `src/components/case-study/__tests__/ProseBody.test.tsx` - 8 tests covering splitting, class assignment, empty filtering
- `src/components/case-study/__tests__/Timeline.test.tsx` - 8 tests covering node rendering, text content, reduced motion visibility

## Decisions Made
- GSAP mock must include `registerPlugin: vi.fn()` — the module-level `gsap.registerPlugin(ScrollTrigger)` call runs at import time in Vitest and requires the method to exist on the mock.
- Timeline unfilled node dots use `color-mix(in srgb, var(--color-accent) 20%, transparent)` rather than a hex with opacity. This keeps the color tied to the CSS custom property and avoids GSAP tween conflicts.
- `data-timeline-node` and `data-timeline-connector` attributes added to Timeline elements for reliable test targeting without brittle class-name selectors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] GSAP mock missing registerPlugin method**
- **Found during:** Task 2 (Timeline TDD RED phase)
- **Issue:** Timeline.tsx calls `gsap.registerPlugin(ScrollTrigger)` at module level; mock didn't include that method, causing `TypeError: registerPlugin is not a function` during test import
- **Fix:** Added `registerPlugin: vi.fn()` to the GSAP mock in Timeline.test.tsx
- **Files modified:** src/components/case-study/__tests__/Timeline.test.tsx
- **Verification:** All 8 Timeline tests pass after fix
- **Committed in:** b9f2570 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary to make tests runnable. No scope creep.

## Issues Encountered
None beyond the GSAP mock deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ProseBody and Timeline are ready for wiring into CaseStudyPanel/CaseStudySection in Plan 02
- Both components accept the interfaces defined in the plan (panelRef, reducedMotion, steps/text)
- TypeScript clean, all tests green

---
*Phase: 06-narrative-content-sections*
*Completed: 2026-03-11*
