# Requirements: Hargile Portfolio Showcase

**Defined:** 2026-03-05
**Core Value:** Potential clients instantly feel the quality of Hargile's work through a showcase experience so smooth and polished that the portfolio itself demonstrates Hargile's capabilities.

## v1.0 Requirements (Complete)

### Navigation

- [x] **NAV-01**: User can browse 12+ projects via smooth slider/carousel with seamless transitions
- [x] **NAV-02**: User can navigate projects using keyboard arrows, touch swipe, and click controls
- [x] **NAV-03**: Each project has a unique URL (deep linking) with browser back/forward support
- [x] **NAV-04**: User can see current position and total count via progress indicator

### Content

- [x] **CONT-01**: Each project displays a high-quality hero visual (screenshot/mockup)
- [x] **CONT-02**: Each project shows a brief "what we solved" narrative (problem, solution, outcome)
- [x] **CONT-03**: Each project displays metadata tags (industry, tech stack, year)
- [x] **CONT-04**: User can reach a contact CTA to inquire about working with Hargile

### Visual Identity

- [x] **VIS-01**: Page color palette morphs dynamically per project during navigation
- [x] **VIS-02**: Page loads with smooth, staggered entry animations
- [x] **VIS-03**: Project visuals have 3D-enhanced parallax depth responding to mouse movement

### Production Quality

- [x] **PERF-01**: Layout is fully responsive across mobile, tablet, and desktop
- [ ] **PERF-02**: First contentful paint under 3 seconds
- [x] **PERF-03**: All transitions maintain 60fps with lazy-loaded assets
- [x] **PERF-04**: Reduced motion fallback for accessibility (prefers-reduced-motion)

## v1.1 Requirements (Case Studies & Storytelling)

### Case Study Navigation

- [ ] **CSNAV-01**: User can click into a project from the slider and see a full-screen case study with an animated entry transition
- [ ] **CSNAV-02**: User can return to the slider via a persistent back button that reverses the entry animation
- [ ] **CSNAV-03**: User sees a reading progress bar showing how far they've scrolled through the case study
- [ ] **CSNAV-04**: User sees a "next project" preview at the bottom of each case study to continue browsing

### Case Study Content

- [ ] **CSCONT-01**: User reads a challenge/problem section explaining what the client needed
- [ ] **CSCONT-02**: User reads a solution/approach section describing what Hargile did
- [ ] **CSCONT-03**: User sees an animated process timeline (discovery, design, development, launch) that reveals step-by-step on scroll
- [ ] **CSCONT-04**: User sees key results with animated number counters (3-5 metrics per project) triggered on scroll
- [ ] **CSCONT-05**: User browses a deliverables/screenshots gallery with staggered scroll-triggered reveals
- [ ] **CSCONT-06**: User reads a testimonial/client quote styled as a prominent pull-out
- [ ] **CSCONT-07**: User sees team credits with small profile cards at the bottom

### Case Study Visual Polish

- [ ] **CSVIS-01**: All case study sections animate into view on scroll with staggered fade-translate reveals
- [ ] **CSVIS-02**: Case study inherits the project's color theme from the slider for visual continuity
- [ ] **CSVIS-03**: Case study layout is responsive across mobile, tablet, and desktop
- [ ] **CSVIS-04**: Users with prefers-reduced-motion see a functional experience with animations simplified

### Case Study Data

- [ ] **CSDATA-01**: Rich placeholder content exists for all 3 beta projects (atlas, pulse, verde) with realistic fake metrics, timelines, testimonials, and screenshots

## Future Requirements

### Advanced Transitions

- **TRANS-01**: GSAP Flip slider-to-case-study transition (upgrade from fade-expand to element morphing)
- **TRANS-02**: Pinned horizontal storytelling panel with mobile solution

### Rich Media

- **MEDIA-01**: Opt-in video embed with play button in case study hero
- **MEDIA-02**: Custom SVG animated charts for richer metrics visualization

### Animation Polish (from v1.0 backlog)

- **ANIM-01**: Per-project mood-driven entry animations
- **ANIM-02**: Element-level project transition choreography
- **ANIM-03**: Cursor-reactive elements (magnetic buttons, tilt on hover)

### Enhanced Content (from v1.0 backlog)

- **ECONT-01**: Scroll-driven storytelling within project panels
- **ECONT-02**: Video background loops as project hero visuals
- **ECONT-03**: Branded preloader sequence

### Advanced Navigation (from v1.0 backlog)

- **ANAV-01**: Racing-circuit / track-picker navigation metaphor
- **ANAV-02**: Sound design on interactions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full 3D WebGL environment | Massive complexity, poor mobile performance |
| CMS / headless content management | Projects updated infrequently; TypeScript data objects sufficient |
| Full chart library (Recharts, Chart.js) | 40-80KB for 3-5 data points; CSS bars + GSAP counters sufficient |
| Lightbox modal for gallery | Breaks scroll narrative; large inline images preferred |
| Video autoplay | Page weight, browser blocking, reduced-motion conflict |
| Lenis smooth scroll override | Conflicts with GSAP ScrollTrigger; native scroll + scrub sufficient |
| Infinite scroll between projects | Removes user agency; explicit "next project" CTA preferred |
| Auto-advancing carousel | Users feel rushed, motion sickness |
| Scroll hijacking | Frustrates users, breaks momentum scrolling on mobile |
| Custom cursor replacement | Breaks user expectations, accessibility issues |
| Autoplay background music | Users hate it, browsers block it |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| CONT-01 | Phase 3 | Complete |
| CONT-02 | Phase 3 | Complete |
| CONT-03 | Phase 3 | Complete |
| CONT-04 | Phase 3 | Complete |
| VIS-01 | Phase 3 | Complete |
| VIS-02 | Phase 3 | Complete |
| VIS-03 | Phase 4 | Complete |
| PERF-01 | Phase 1 | Complete |
| PERF-02 | Phase 1 | Pending |
| PERF-03 | Phase 4 | Complete |
| PERF-04 | Phase 4 | Complete |
| CSNAV-01 | Phase 5 | Pending |
| CSNAV-02 | Phase 5 | Pending |
| CSNAV-03 | Phase 7 | Pending |
| CSNAV-04 | Phase 7 | Pending |
| CSCONT-01 | Phase 6 | Pending |
| CSCONT-02 | Phase 6 | Pending |
| CSCONT-03 | Phase 6 | Pending |
| CSCONT-04 | Phase 7 | Pending |
| CSCONT-05 | Phase 7 | Pending |
| CSCONT-06 | Phase 7 | Pending |
| CSCONT-07 | Phase 7 | Pending |
| CSVIS-01 | Phase 6 | Pending |
| CSVIS-02 | Phase 5 | Pending |
| CSVIS-03 | Phase 5 | Pending |
| CSVIS-04 | Phase 5 | Pending |
| CSDATA-01 | Phase 5 | Pending |

**Coverage:**
- v1.0 requirements: 15 total (14 complete, 1 pending)
- v1.1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-11 after v1.1 roadmap created (phases 5-7)*
