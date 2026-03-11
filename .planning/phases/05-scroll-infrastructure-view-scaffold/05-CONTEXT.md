# Phase 5: Scroll Infrastructure & View Scaffold - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can click into a case study from the slider and return — both directions animate correctly, scroll works inside the case study, the URL reflects the view, and the page is clean on every open/close cycle. Delivers: case study overlay architecture (CSNAV-01), back navigation (CSNAV-02), color theme inheritance (CSVIS-02), responsive layout (CSVIS-03), reduced motion support (CSVIS-04), and placeholder data model with full content (CSDATA-01). Narrative section content rendering and scroll-triggered animations are Phase 6. Metrics, gallery, and polish are Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Entry/exit animation style
- Curtain wipe: two-beat choreography — slider exits first, then case study reveals
- Beat 1 (slider exit): fade + scale down to ~95% — slider recedes into background (~0.4s)
- Beat 2 (case study reveal): staggered fade-up — hero appears first, then sections stagger in top-down with fade + translateY (~0.6s)
- Total duration: ~1s (brisk, matches existing 0.8s slide transition pacing)
- Exit animation (back to slider): reverse of entry — case study fades out, slider scales back up
- Reduced motion: skip all motion, use simple opacity crossfade (consistent with Phase 4 pattern)

### Case study layout skeleton
- Full-bleed hero image at top spanning viewport width, with project title + category overlaid
- Hero image has subtle scroll parallax (image scrolls slower than content — reuses Phase 4 parallax pattern)
- Section order below hero: Challenge → Solution → Timeline → Metrics → Gallery → Testimonial → Team → Next project CTA
- Content width: centered prose column (~720-800px max-width) for text sections; hero and gallery break out to full width
- Mobile: same order, full-width everything, prose column collapses to viewport width with padding
- Section structure matches all 3 projects (consistent template, different stories)

### Back button & navigation chrome
- Fixed top-left position — always visible as user scrolls
- Text link style: "← Retour" with arrow + French label
- Subtle backdrop blur (glass-morphism) behind text for readability over hero image
- No other persistent navigation chrome — back button only (contact CTA from AppShell stays visible independently)
- Escape key also triggers back navigation (consistent with modal/overlay patterns)

### Placeholder data richness
- Full realistic French content for all 3 projects (atlas, pulse, verde) — no lorem ipsum
- Each project: challenge/solution prose (2-3 paragraphs each), 4 timeline steps with descriptions, 3-5 web/digital KPI metrics, testimonial quote, team credits
- Metrics focus on web/digital KPIs: conversion rates, page load improvements, traffic growth, engagement metrics (e.g., "+140% trafic organique", "-0.8s temps de chargement")
- Team credits use fictional French names with role titles (e.g., "Marie Dupont — Lead Designer")
- Same structure across all 3 projects, each with unique narrative content
- CaseStudyData type extends ProjectData with caseStudy?: { challenge, solution, timeline, metrics, deliverables, testimonial, team }

### Claude's Discretion
- Exact easing curves for curtain wipe beats
- Parallax scroll speed ratio for case study hero
- Backdrop blur intensity and background opacity on back button
- Section spacing rhythm and typography scale
- Exact hero image height (viewport percentage)
- Crossfade timing fine-tuning for reduced motion mode
- Fictional project narratives content (as long as they're realistic and in French)

</decisions>

<specifics>
## Specific Ideas

- Curtain wipe should feel like "the slider steps aside to reveal the full story" — cinematic, not abrupt
- Same staggered fade-up pattern as Phase 3 slide transitions — consistent animation language throughout the app
- "← Retour" matches the French content language used everywhere (not "Back")
- Back button with backdrop blur = glass-morphism feel, premium and modern
- Centered prose column for editorial reading comfort — agency case studies should read like a magazine, not a dashboard
- Full realistic French content means the portfolio looks finished even during development — no placeholder embarrassment in demos

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useSliderStore`: `isAnimating` lock pattern — reuse for blocking case study open during transitions
- `useReducedMotion`: `gsap.matchMedia` based — use for case study animation branching
- `useParallax`: Mouse-based parallax on hero images — adapt scroll-based variant for case study hero
- `useHashSync`: Hash routing for slider — extend to handle `#atlas/case-study` format
- `Slide.tsx`: `forwardRef` + `data-anim` attributes — same pattern for case study section components
- `theme-utils.ts` / `color-utils.ts`: `deriveTheme()` and `applyTheme()` — case study inherits project theme
- `AppShell.tsx`: Grain overlay + ContactCTA live here — case study panel is a sibling element

### Established Patterns
- GSAP + plain `useEffect`/`useCallback` (not useGSAP hook)
- Direct DOM refs, never string selectors
- CSS custom properties via Tailwind CSS 4 `@theme` with runtime overrides
- `power3.inOut` easing on 0.8s transitions
- `data-anim` attribute convention for GSAP targeting
- Zustand stores for shared state (no prop drilling)

### Integration Points
- `AppShell.tsx`: Case study panel rendered as sibling of Slider (not child)
- `useSliderStore`: New `useViewStore` for mode ('slider' | 'case') + activeProjectId
- `useHashSync`: Extend popstate handler to check view mode before running slider logic
- `Slider.tsx`: GSAP Observer `.disable()` on case study open, `.enable()` on close
- `Slide.tsx`: Add "Voir l'étude de cas" CTA button per slide
- `types.ts`: Extend `ProjectData` or create `CaseStudyData` type
- `projects.ts`: Add `caseStudy` data to each project

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-scroll-infrastructure-view-scaffold*
*Context gathered: 2026-03-11*
