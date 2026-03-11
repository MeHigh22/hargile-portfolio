---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Not started
stopped_at: Completed 05-01-PLAN.md — data layer and view store
last_updated: "2026-03-11T10:31:05.960Z"
last_activity: 2026-03-11 — Roadmap created, ready for plan-phase 5
progress:
  total_phases: 7
  completed_phases: 4
  total_plans: 11
  completed_plans: 10
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-11)

**Core value:** Potential clients instantly feel the quality of Hargile's work through a showcase experience so smooth and polished that the portfolio itself demonstrates Hargile's capabilities.
**Current focus:** Phase 5 — Scroll Infrastructure & View Scaffold

## Current Position

Phase: 5 — Scroll Infrastructure & View Scaffold
Plan: —
Status: Not started
Last activity: 2026-03-11 — Roadmap created, ready for plan-phase 5

```
v1.1 Progress: [··········] 0% (0/3 phases)
```

## Performance Metrics

**Velocity (v1.0):**
- Total plans completed: 9
- Average duration: 4min
- Total execution time: ~36min

**By Phase (v1.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 Foundation | 2/2 | 7min | 3.5min |
| 02 Slider & Navigation | 2/2 | 9min | 4.5min |
| 03 Content & Theming | 3/3 | 10min | 3.3min |
| 04 Depth & Production Quality | 2/2 | ~10min | ~5min |

**Recent Trend:**
- Last plans: 04-01 (~5min), 04-02 (~5min)
- Trend: stable

*Updated after each plan completion*
| Phase 05-scroll-infrastructure-view-scaffold P01 | 15 | 2 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Stack: React 19 + Vite 7 + TypeScript + GSAP + Tailwind CSS 4 + Zustand + Lenis (from research)
- Custom GSAP slider over pre-built carousel (transition choreography IS the product)
- CSS custom properties for per-project theming (no runtime CSS-in-JS)
- [Phase 01]: Grain overlay uses inline SVG data URI with feTurbulence at opacity 0.03
- [Phase 01]: ThemePalette expanded to 8 properties (added bgCard, textSecondary) for visible theme switching
- [Phase 01]: Tailwind CSS 4 @theme tokens confirmed working with runtime CSS variable overrides
- [Phase 02]: Clamped slider navigation (no wrapping) -- simpler, avoids infinite loop complexity
- [Phase 02]: GSAP Observer for unified wheel/touch/pointer input (single API replaces 3+ event systems)
- [Phase 02]: Zustand store with isAnimating lock pattern for race condition prevention
- [Phase 02]: forceConsistentCasingInFileNames disabled for GSAP Observer type casing on Windows
- [Phase 02]: replaceState for initial hash, pushState for user navigation -- avoids history pollution
- [Phase 02]: Keyboard nav as separate hook (not GSAP Observer) -- Observer does not handle keyboard
- [Phase 03]: All derived colors in hex format (no rgba) for GSAP CSS property tween compatibility
- [Phase 03]: textSecondary via lighten(bg, 0.60) not rgba opacity -- GSAP safe
- [Phase 03]: deriveTheme maps gradientFrom->coral, gradientTo->lavender in ThemePalette
- [Phase 03]: test-setup.ts with @testing-library/jest-dom/vitest added for DOM matchers
- [Phase 03]: data-anim attribute convention (category, title, narrative, tags, hero) for GSAP targeting
- [Phase 03]: Color morph concurrent with slide movement via GSAP timeline '<' position (0.8s, power3.inOut)
- [Phase 03]: Staggered reveal starts at 0.2s into transition timeline for layered cinematic feel
- [Phase 03]: defaultTheme hardcoded to atlas derived values to avoid circular import
- [Phase 03]: altTheme removed; per-project color morphing replaces manual theme toggle
- [Phase 04-01]: useReducedMotion uses gsap.matchMedia for GSAP ecosystem consistency
- [Phase 04-01]: Unsplash URL API used for responsive WebP srcset without local asset management
- [Phase 04-01]: scale-[1.05] on hero img with overflow-hidden container provides parallax headroom
- [Phase 04-01]: data-parallax attribute on img targets Plan 02 GSAP parallax animations
- [Phase 04-01]: GSAP isolated into vendor-gsap Vite chunk (79kB) for better cache splitting
- [Phase 04-02]: useParallax uses activeIndex as dependency to re-init quickTo on slide change (prevents stale element reference)
- [Phase 04-02]: isReducedMotion as useCallback dependency enables reactive branch switching on media query change
- [Phase 04-02]: Color morphing kept in reduced motion mode — not spatial animation, WCAG-safe
- [Phase 04-02]: preloadAdjacentImages called in onComplete to avoid competing with transition GPU work
- [v1.1 Architecture]: Case study is a sibling DOM element of Slider inside AppShell, never a child — avoids overflow-hidden clip and will-change containing block issues
- [v1.1 Architecture]: GSAP Observer is disabled (obs.disable(), not .kill()) on case study open and re-enabled on close
- [v1.1 Architecture]: All ScrollTrigger instances inside case study must pass scroller: panelRef.current — never window
- [v1.1 Architecture]: gsap.context() scoped to case study container; .revert() called on every close path (button, Escape, browser back)
- [v1.1 Architecture]: useViewStore Zustand store holds mode ('slider' | 'case') and activeProjectId — no router introduced
- [v1.1 Architecture]: useHashSync extended to parse #atlas/case-study format; popstate guard checks view mode before running slider logic
- [v1.1 Architecture]: CSS custom property overrides inside case study use --cs-* prefix, scoped to case study container element (not :root)
- [v1.1 Architecture]: Native scroll preferred over Lenis for Phase 5 scaffold; add Lenis only if scroll feel is unsatisfactory after panel shell is working
- [v1.1 Architecture]: Recharts deferred — build GSAP counter animations first; add Recharts only if bar-chart representation is needed after Phase 7 visual review
- [v1.1 Architecture]: CaseStudyData type extends existing project data type with caseStudy?: { challenge, solution, timeline, metrics, deliverables, testimonial, team }
- [v1.1 Architecture]: "Voir l'étude de cas" CTA added to Slide.tsx after CaseStudyPanel destination is established (Phase 5 end)
- [v1.1 Architecture]: Block case study open while useSliderStore.isAnimating is true to prevent mid-transition palette bleed
- [Phase 05-01]: CaseStudyContent type uses optional caseStudy? field on ProjectData for backward compatibility
- [Phase 05-01]: openCase guard reads useSliderStore.getState().isAnimating directly (one-time check at call time, not reactive subscription)

### Pending Todos

- Decide: Lenis vs native scroll after Phase 5 panel shell is interactive (review scroll feel before Phase 6)
- Decide: Recharts vs pure GSAP counters after Phase 7 first pass (review counter visual before adding dependency)
- Verify: YARL (yet-another-react-lightbox) bundle size on current Bundlephobia before committing to Phase 7

### Blockers/Concerns

None currently.

## Session Continuity

Last session: 2026-03-11T10:31:05.949Z
Stopped at: Completed 05-01-PLAN.md — data layer and view store
Resume file: None
