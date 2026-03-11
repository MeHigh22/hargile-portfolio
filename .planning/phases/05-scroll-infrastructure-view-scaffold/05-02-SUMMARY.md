---
phase: 05-scroll-infrastructure-view-scaffold
plan: 02
subsystem: ui
tags: [gsap, react, case-study, routing, observer, animation]

# Dependency graph
requires:
  - phase: 05-scroll-infrastructure-view-scaffold
    plan: 01
    provides: useViewStore, CaseStudyContent type, projects with caseStudy data
provides:
  - CaseStudyPanel full-screen overlay with entry/exit animations and gsap.context lifecycle
  - CaseStudyHero full-bleed 60vh hero with WebP/JPEG srcset and title overlay
  - CaseStudySection reusable prose wrapper with data-anim='cs-section' for GSAP targeting
  - BackButton fixed top-left with backdrop-blur and 'Retour' label
  - AppShell rendering CaseStudyPanel as Slider sibling via useViewStore.activeProjectId
  - useHashSync extended with #projectId/case-study parsing and mode guard
  - Slider Observer disable/enable subscription to useViewStore mode changes
  - Slide CTA button 'Voir l'etude de cas' opening case study on click
affects:
  - 05-03 (ScrollTrigger scroll parallax wires into panelRef from CaseStudyPanel)
  - 06 (section content animations target data-anim='cs-section' elements)
  - 07 (final metrics and gallery replace placeholder section content)

# Tech tracking
tech-stack:
  added:
    - gsap/ScrollTrigger (registered in CaseStudyPanel; used by Phase 6+ for section animations)
  patterns:
    - gsap.context() scoped to panelRef; revert() called on every close path before exit animation
    - Two-beat curtain wipe entry: slider recedes (scale 0.95 + fade) then panel reveals with hero + section stagger
    - Reduced motion branch: opacity crossfade only, no spatial movement (WCAG compliant)
    - Zustand v5 subscribe((state, prevState) => ...) pattern for Observer disable/enable
    - CSS initial state (opacity:0, visibility:hidden, pointerEvents:none) controlled by React; GSAP animates to final state
    - All hooks called before conditional return to respect React rules of hooks
    - data-slider-container attribute on Slider div for CaseStudyPanel to locate it via querySelector

key-files:
  created:
    - src/components/case-study/BackButton.tsx
    - src/components/case-study/CaseStudySection.tsx
    - src/components/case-study/CaseStudyHero.tsx
    - src/components/case-study/CaseStudyPanel.tsx
  modified:
    - src/components/layout/AppShell.tsx
    - src/hooks/useHashSync.ts
    - src/components/slider/Slider.tsx
    - src/components/slider/Slide.tsx

key-decisions:
  - "Zustand v5 subscribe uses (state, prevState) form — selector subscribe form is silently broken in v5"
  - "All hooks called unconditionally before conditional return null (React rules of hooks compliance)"
  - "gsap.context().revert() called first in closePanel before any exit animation — kills ScrollTrigger instances before panel moves"
  - "data-slider-container attribute on Slider container div allows CaseStudyPanel to locate it without prop drilling"
  - "CTA button text uses 'etude de cas' without accent (consistent with existing French content pattern in codebase)"

# Metrics
duration: ~12min
completed: 2026-03-11
---

# Phase 5 Plan 02: CaseStudyPanel Shell & Integration Summary

**Full-screen case study overlay with two-beat entry/exit animations, hash routing, Observer toggle, and slide CTA button**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-11T10:25:00Z
- **Completed:** 2026-03-11T10:37:00Z
- **Tasks:** 2
- **Files modified:** 8 (4 created, 4 modified)

## Accomplishments

- Created 4 case study components: BackButton (fixed top-left, backdrop-blur, '← Retour'), CaseStudySection (prose wrapper with data-anim), CaseStudyHero (60vh full-bleed, WebP srcset, title overlay), CaseStudyPanel (full-screen overlay with all integration logic)
- Implemented two-beat curtain wipe entry animation: slider recedes to scale(0.95) + fade, then panel reveals with hero fade-up and 7-section stagger; reduced motion branch uses simple opacity crossfade
- Wired AppShell to conditionally render CaseStudyPanel as Slider sibling when activeProjectId is truthy
- Extended useHashSync to parse #projectId/case-study format in mount effect and popstate handler; added guard to skip slider hash update when mode === 'case'
- Added Observer disable/enable subscription in Slider.tsx using Zustand v5 subscribe(state, prevState) pattern; stored Observer in obsRef for lifecycle management
- Added 'Voir l'etude de cas →' CTA button to Slide.tsx, guarded by isAnimating check, only rendered for projects with caseStudy data
- TypeScript compiles clean; 124/128 tests pass (4 pre-existing failures from projects[3]/projects[5] references — out of scope)

## Task Commits

1. **Task 1: Create CaseStudyPanel layout components and BackButton** - `9b64d74` (feat)
2. **Task 2: Wire AppShell, extend hash routing, toggle Observer, add Slide CTA** - `419c9be` (feat)

## Files Created/Modified

- `src/components/case-study/BackButton.tsx` — Fixed top-left button, backdrop-blur, '← Retour', hover transition
- `src/components/case-study/CaseStudySection.tsx` — Section wrapper with data-anim='cs-section', centered max-w-[800px] column
- `src/components/case-study/CaseStudyHero.tsx` — 60vh hero with forwardRef, picture/WebP/JPEG srcset, gradient scrim, title overlay
- `src/components/case-study/CaseStudyPanel.tsx` — Main overlay: fixed inset-0 z-[100], gsap.context lifecycle, entry/exit animations, Escape key, applyTheme, hash push, 7 sections in order
- `src/components/layout/AppShell.tsx` — Added useViewStore + CaseStudyPanel; renders panel after {children} when activeProjectId is truthy
- `src/hooks/useHashSync.ts` — Extended popstate and mount effect to handle #id/case-study format; added mode guard on hash update
- `src/components/slider/Slider.tsx` — Added obsRef, mode subscription for Observer disable/enable, data-slider-container attribute
- `src/components/slider/Slide.tsx` — Added useSliderStore + useViewStore imports; CTA button with isAnimating guard

## Decisions Made

- **Zustand v5 subscribe pattern:** The selector-first form `store.subscribe(s => s.mode, callback)` is silently broken in Zustand v5 (no error, no callback). Used `subscribe((state, prevState) => { if (state.mode !== prevState.mode) ... })` instead — confirmed working via Node test
- **React rules of hooks:** Initial draft placed conditional return before useCallback — restructured to call all hooks unconditionally, conditional return placed after all hook calls
- **gsap.context revert before exit:** ctxRef.current?.revert() is called as the first statement in closePanel — this kills all ScrollTrigger instances bound to the panel before the exit animation begins, preventing ghost instances
- **data-slider-container:** Added as HTML attribute (not CSS class) on the Slider container div so CaseStudyPanel can locate it via `document.querySelector('[data-slider-container]')` without prop drilling or context

## Deviations from Plan

None — plan executed exactly as written. One implementation clarification was needed: Zustand v5 does not support the selector subscribe form; used the state/prevState comparison pattern instead (consistent with plan note: "check existing zustand version").

## Test Results

- TypeScript: clean (0 errors)
- Tests: 124 passed / 4 failed (pre-existing failures unrelated to this plan — documented in deferred-items.md from Plan 05-01)

## Next Phase Readiness

- CaseStudyPanel shell is interactive: open/close via CTA, Back button, Escape, browser back
- Observer correctly disabled while case study is open
- Hash routing handles all case study URL formats
- Plan 05-03 (if any) can wire ScrollTrigger scroll parallax using panelRef as scroller
- Phase 6 can target data-anim='cs-section' elements for scroll-driven reveal animations

---
*Phase: 05-scroll-infrastructure-view-scaffold*
*Completed: 2026-03-11*

## Self-Check: PASSED

- `src/components/case-study/BackButton.tsx` — FOUND
- `src/components/case-study/CaseStudySection.tsx` — FOUND
- `src/components/case-study/CaseStudyHero.tsx` — FOUND
- `src/components/case-study/CaseStudyPanel.tsx` — FOUND
- `src/components/layout/AppShell.tsx` — FOUND
- `src/hooks/useHashSync.ts` — FOUND
- `src/components/slider/Slider.tsx` — FOUND
- `src/components/slider/Slide.tsx` — FOUND
- `.planning/phases/05-scroll-infrastructure-view-scaffold/05-02-SUMMARY.md` — FOUND
- Commit `9b64d74` (Task 1) — FOUND
- Commit `419c9be` (Task 2) — FOUND
- TypeScript: 0 errors
- Tests: 124 passed / 4 pre-existing failures (out of scope)
