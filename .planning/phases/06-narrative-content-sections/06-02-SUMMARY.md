---
phase: 06-narrative-content-sections
plan: 02
subsystem: ui
tags: [react, typescript, gsap, scrolltrigger, tailwind]

# Dependency graph
requires:
  - phase: 06-narrative-content-sections
    plan: 01
    provides: ProseBody and Timeline standalone components

provides:
  - CaseStudyPanel with ProseBody and Timeline integrated
  - ScrollTrigger section reveals for below-fold sections
  - Reduced motion path showing all sections immediately

affects:
  - Phase 7 (Resultats, Livrables, Temoignage, Equipe placeholders receive scroll reveals)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Below-fold detection via getBoundingClientRect() relative to panelRect inside onComplete
    - ScrollTrigger.create inside gsap.context() for automatic cleanup on revert
    - gsap.set(sections) in reduced motion onComplete to guarantee visibility

key-files:
  created: []
  modified:
    - src/components/case-study/CaseStudyPanel.tsx

key-decisions:
  - "Below-fold detection uses getBoundingClientRect() in onComplete — at that moment the entry animation is done and positions are stable"
  - "ScrollTrigger instances created inside gsap.context() are auto-reverted when ctxRef.current.revert() is called on panel close — no extra cleanup needed"
  - "Reduced motion gsap.set(sections) runs in onComplete after ScrollTrigger.refresh() — ensures sections are visible even without a stagger entry animation"

requirements-completed: [CSCONT-01, CSCONT-02, CSCONT-03, CSVIS-01]

# Metrics
duration: 3min
completed: 2026-03-11
---

# Phase 6 Plan 02: Narrative Content Sections — Panel Integration Summary

**CaseStudyPanel wired with ProseBody (editorial prose), Timeline (vertical GSAP timeline), and ScrollTrigger reveals for below-fold sections; reduced motion path shows all content immediately**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-11T14:41:42Z
- **Completed:** 2026-03-11T14:44:16Z
- **Tasks:** 1
- **Files modified:** 1 modified

## Accomplishments
- Defi and Solution sections now use `<ProseBody>` for multi-paragraph editorial rendering with text-lg/text-base hierarchy
- Processus section replaced placeholder card grid with `<Timeline>` — vertical accent line with per-node ScrollTrigger reveals
- Phase 7 placeholder sections (Resultats, Livrables, Temoignage, Equipe) unchanged but now receive scroll reveals from the below-fold detection logic
- Below-fold sections start hidden after entry animation and reveal with fade+translateY(30px) on scroll
- Above-fold sections animated by the entry stagger are NOT double-animated (relativeTop < panelHeight skips them)
- Reduced motion: `gsap.set(sections, { opacity: 1, y: 0 })` in onComplete ensures all sections visible immediately without ScrollTrigger
- TypeScript compiles clean; all 16 ProseBody + Timeline tests pass

## Task Commits

1. **Task 1: Integrate ProseBody, Timeline, and ScrollTrigger reveals** - `53de550` (feat)

## Files Created/Modified
- `src/components/case-study/CaseStudyPanel.tsx` — Added ProseBody and Timeline imports, replaced content placeholders, added below-fold ScrollTrigger detection in onComplete, fixed reduced motion section visibility

## Decisions Made
- Below-fold detection reads `getBoundingClientRect()` inside `onComplete` — after the entry animation completes, element positions are stable and accurate.
- `ScrollTrigger.create` calls placed inside the existing `gsap.context()` scope — they are automatically reverted when `ctxRef.current.revert()` runs on close, with no additional cleanup needed.
- `gsap.set(sections, { opacity: 1, y: 0 })` in the reduced motion `onComplete` prevents sections from remaining at opacity:0 since no entry stagger is applied in that branch.

## Deviations from Plan

None - plan executed exactly as written.

Pre-existing test failures (4 tests in useSliderStore and useHashSync) unrelated to this plan exist due to the project count being trimmed from 12 to 3 projects. These are out of scope per the deviation boundary rule.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- Phase 7 (Livrables, Temoignage, Equipe, Resultats) placeholder sections are in place and already receive scroll reveals
- The narrative content experience is complete: editorial prose, animated vertical timeline, progressive section reveals

---
*Phase: 06-narrative-content-sections*
*Completed: 2026-03-11*
