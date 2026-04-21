---
phase: 08-portfolio-page-react-tsx
plan: 03
subsystem: ui
tags: [react, typescript, gsap, zustand, react-router, forwardref, vitest]

# Dependency graph
requires:
  - 08-01 (types.ts, usePortfolioStore, PortfolioPage.css, portfolioDataAdapter, main.tsx routing)
  - 08-02 (CoverSlide, ProjectSlide, OutroSlide, YearNav, ProgressBar, TweaksPanel, SceneRenderer)
provides:
  - src/pages/portfolio/PortfolioPage.tsx (full GSAP navigation engine)
  - src/pages/portfolio/components/CaseStudyPage.tsx (/portfolio/case-study?p=<slug>)
affects:
  - Phase 08 completion — all PORT-0x requirements now satisfiable

# Tech tracking
tech-stack:
  added: []
  patterns:
    - forwardRef pattern: React.forwardRef<HTMLDivElement, Props> on all slide components so GSAP can target real DOM nodes via slideRefs.current[i]
    - busyRef lock: useRef(false) for animation busy guard — NOT useState, prevents re-render during transition
    - go() callback: useCallback with slides + store + setSearchParams deps, handles busy guard + GSAP opacity tween + URL sync + localStorage
    - Mount useEffect with empty deps: initial slide resolved from ?p=<slug> URL param or localStorage, gsap.set() shows it instantly
    - Keyboard useEffect: re-registered on [go, store.currentIndex], e.repeat guard prevents held-key stacking
    - CaseStudyPage: flat inline-style component rendering inside PortfolioPage nested Routes, inherits CSS vars from parent [data-portfolio] scope

key-files:
  created:
    - src/pages/portfolio/components/CaseStudyPage.tsx
  modified:
    - src/pages/portfolio/PortfolioPage.tsx (stub replaced with full engine)
    - src/pages/portfolio/components/CoverSlide.tsx (forwardRef added)
    - src/pages/portfolio/components/ProjectSlide.tsx (forwardRef added)
    - src/pages/portfolio/components/OutroSlide.tsx (forwardRef added)
    - src/pages/portfolio/PortfolioPage.css (.portfolio-slide initial opacity:0 rule added)

key-decisions:
  - "adaptedProjects called at module level (const adaptedProjects = adaptProjects(projects)) — pure, no React dep, avoids re-creation on every render"
  - "go() uses busyRef.current not isAnimating store state — prevents Zustand re-render racing GSAP mid-transition"
  - "Keyboard useEffect re-subscribes on [go, store.currentIndex] — ensures stale closure doesn't fire with wrong index"
  - "CaseStudyPage renders with position: fixed; inset: 0; zIndex: 200 — overlays the stacked portfolio slides cleanly"
  - ".portfolio-slide CSS rule sets opacity:0 as initial state; GSAP set() on mount confirms it and shows starting slide instantly"

patterns-established:
  - "setSlideRef(i) factory pattern: returns (el: HTMLElement | null) => { slideRefs.current[i] = el } — assigns refs positionally without index closure issues"
  - "slides array shape: [{ type: 'cover' }, ...adaptedProjects.map(p => ({...p, type: 'project'})), { type: 'outro' }] — unified index space for cover(0), projects(1..N), outro(N+1)"
  - "URL sync: setSearchParams({ p: slug }, { replace: true }) on project slide, setSearchParams({}, { replace: true }) on cover/outro"

requirements-completed: [PORT-01, PORT-02, PORT-03, PORT-04]

# Metrics
duration: 6min
completed: 2026-04-21
---

# Phase 08 Plan 03: PortfolioPage Full Implementation Summary

**GSAP opacity navigation engine with busyRef lock, keyboard nav, URL ?p= sync, and /portfolio/case-study route — all slide components wrapped in forwardRef for direct DOM targeting**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-21T08:22:10Z
- **Completed:** 2026-04-21T08:27:43Z
- **Tasks:** 3 complete (Task 4 is human-verify checkpoint, awaiting user review)
- **Files modified:** 6

## Accomplishments
- CoverSlide, ProjectSlide, OutroSlide wrapped with `React.forwardRef` — GSAP can now target real DOM nodes via `slideRefs.current[i]`
- PortfolioPage.tsx stub replaced with full navigation engine: `go()` callback with busyRef guard, GSAP opacity transitions (0.9s power2.inOut), keyboard ArrowLeft/ArrowRight with `e.repeat` guard
- URL sync: `setSearchParams({ p: slug }, { replace: true })` on project navigation, localStorage persistence for resume-on-reload
- Mount useEffect: resolves start slide from `?p=<slug>` or localStorage, shows it instantly via `gsap.set()`
- CaseStudyPage renders at `/portfolio/case-study?p=<slug>` — shows challenge/solution/metrics from `caseStudy` field, falls back to `narrative` for projects without full case study
- All 4 PortfolioPage tests pass (SceneRenderer 2 + smoke 2)

## Task Commits

1. **Task 1: forwardRef on CoverSlide, ProjectSlide, OutroSlide** - `1b5747b` (feat)
2. **Task 2: PortfolioPage full navigation engine** - `92144a4` (feat)
3. **Task 3: CaseStudyPage at /portfolio/case-study** - `29bb744` (feat)

**Plan metadata:** TBD (after Task 4 human-verify)

## Files Created/Modified
- `src/pages/portfolio/PortfolioPage.tsx` — Full GSAP navigation engine replacing stub
- `src/pages/portfolio/components/CoverSlide.tsx` — forwardRef<HTMLDivElement> wrapping
- `src/pages/portfolio/components/ProjectSlide.tsx` — forwardRef<HTMLElement> wrapping
- `src/pages/portfolio/components/OutroSlide.tsx` — forwardRef<HTMLElement> wrapping
- `src/pages/portfolio/components/CaseStudyPage.tsx` — New case study route component
- `src/pages/portfolio/PortfolioPage.css` — Added `.portfolio-slide { opacity: 0; pointer-events: none }` initial state rule

## Decisions Made
- `adaptedProjects` called at module level — pure function, avoids recreation on every render, no React dep
- `busyRef.current` for animation lock (not Zustand state) — prevents re-render racing GSAP mid-transition
- Keyboard `useEffect` re-subscribes on `[go, store.currentIndex]` — avoids stale closure with wrong index
- `CaseStudyPage` uses `position: fixed; inset: 0; zIndex: 200` — cleanly overlays the stacked slides
- Added `.portfolio-slide` CSS rule for initial state since slide components use that class (not `.slide`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CSS initial state was missing `.portfolio-slide` rule**
- **Found during:** Task 2 (PortfolioPage implementation)
- **Issue:** CSS had `.slide { opacity: 0 }` but slide components use className `portfolio-slide`, not `slide`. Without the CSS initial state, slides would flash briefly before GSAP set() on mount hides them.
- **Fix:** Added `[data-portfolio] .portfolio-slide { opacity: 0; pointer-events: none }` to PortfolioPage.css
- **Files modified:** `src/pages/portfolio/PortfolioPage.css`
- **Verification:** Included in Task 2 commit; TypeScript clean; tests pass
- **Committed in:** `92144a4` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Essential for correct initial render — no scope creep.

## Issues Encountered
- Pre-existing TypeScript errors in other components (case-study tests, slider tests, SceneRenderer uid unused var) — out of scope per scope boundary rules, logged below
- `npx tsc --noEmit` (without `-p tsconfig.app.json`) was using cached incremental state and silently passing — ran `npx tsc -p tsconfig.app.json --noEmit` to get accurate results

## Deferred Items
Pre-existing issues found outside scope of 08-03:
- `src/pages/portfolio/components/SceneRenderer.tsx(6,25)`: `uid` prop declared in SceneWrapper but never used in its JSX (the prop exists purely as pass-through, used by child scenes)
- `src/components/slider/__tests__/Slide.test.tsx`: Missing `ambience` + `imageRatio` fields in test fixture (ProjectData type was extended)
- `src/components/case-study/__tests__/NextProjectCard.test.tsx`: Circular wrap test expects `atlas` but project order changed

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- /portfolio route fully functional: GSAP navigation engine, keyboard nav, URL sync, localStorage, YearNav, ProgressBar, TweaksPanel all wired
- /portfolio/case-study?p=<slug> renders project case study data
- Task 4 human-verify checkpoint required before plan is fully complete
- After Task 4 approval, all PORT-01 through PORT-04 requirements are satisfied

## Self-Check: PARTIAL
- Tasks 1-3 committed: 1b5747b, 92144a4, 29bb744 — FOUND
- Task 4 (human-verify): PENDING — dev server running at http://localhost:5174
