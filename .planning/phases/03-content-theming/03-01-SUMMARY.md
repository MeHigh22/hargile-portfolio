---
phase: 03-content-theming
plan: 01
subsystem: data, theme
tags: [color-utils, derive-theme, project-data, hex-colors, gsap-safe]

requires:
  - phase: 01-foundation
    provides: ThemePalette type, ProjectData type, Tailwind CSS variable theming
provides:
  - Extended ProjectData with narrative and industry fields
  - 12 projects with unique color palettes
  - deriveTheme utility mapping 4 ProjectColors to 8-token ThemePalette
  - hexToRgb, rgbToHex, lighten color manipulation utilities
affects: [03-02 content-layout, 03-03 color-morphing]

tech-stack:
  added: []
  patterns: [hex-only color values for GSAP compatibility, lighten-blend-toward-white derivation]

key-files:
  created:
    - src/theme/color-utils.ts
    - src/theme/__tests__/color-utils.test.ts
  modified:
    - src/data/types.ts
    - src/data/projects.ts
    - src/data/__tests__/projects.test.ts

key-decisions:
  - "All derived colors in hex format (no rgba) for GSAP CSS custom property tween compatibility"
  - "textSecondary derived via lighten(background, 0.60) instead of rgba opacity"
  - "gradientFrom maps to coral, gradientTo maps to lavender in ThemePalette"

patterns-established:
  - "Color derivation: deriveTheme(ProjectColors) -> ThemePalette for runtime palette generation"
  - "Narrative structure: problem/solution/outcome in French for each project"

requirements-completed: [CONT-02, CONT-03, VIS-01]

duration: 4min
completed: 2026-03-06
---

# Phase 3 Plan 1: Data Model & Color Derivation Summary

**Extended ProjectData with per-project narratives/industry and deriveTheme utility producing hex-only ThemePalettes from 4 core colors**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-06T12:39:22Z
- **Completed:** 2026-03-06T12:43:12Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- deriveTheme converts 4 ProjectColors into a complete 8-token ThemePalette with all hex values
- All 12 projects now have unique accent colors, complementary gradient palettes, French narrative text, and industry metadata
- 62 tests passing across 7 test files, zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create color-utils.ts with deriveTheme and unit tests (TDD RED)** - `a4ccec8` (test)
2. **Task 1: Create color-utils.ts with deriveTheme and unit tests (TDD GREEN)** - `867522d` (feat)
3. **Task 2: Extend types and populate 12 projects** - `6229e8d` (feat)

## Files Created/Modified
- `src/theme/color-utils.ts` - hexToRgb, rgbToHex, lighten, deriveTheme utilities
- `src/theme/__tests__/color-utils.test.ts` - 18 unit tests for color derivation
- `src/data/types.ts` - Added ProjectNarrative interface, industry and narrative fields to ProjectData
- `src/data/projects.ts` - 12 projects with unique colors, French narratives, industry metadata
- `src/data/__tests__/projects.test.ts` - Added tests for unique accents, narratives, industry

## Decisions Made
- All derived colors use hex format (no rgba) to avoid GSAP CSS custom property tween issues
- textSecondary derived via lighten(background, 0.60) rather than rgba opacity blending
- gradientFrom maps to coral and gradientTo maps to lavender in ThemePalette mapping

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data model foundation complete for content layout (03-02) and color morphing (03-03)
- deriveTheme ready to be called at runtime for per-project theme switching
- All 12 projects have the data needed for content sections and color transitions

---
*Phase: 03-content-theming*
*Completed: 2026-03-06*
