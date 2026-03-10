# Roadmap: Hargile Portfolio Showcase

## Overview

This roadmap delivers an immersive, single-page portfolio showcase for Hargile in four phases. We start with the technical foundation and responsive skeleton, then build the core slider interaction, layer in project content with dynamic color theming, and finish with 3D depth effects and production-grade performance. Each phase delivers a verifiable capability -- by the end, potential clients experience a showcase that itself demonstrates Hargile's craft.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffolding, data model, CSS theme variable system, and responsive layout skeleton
- [ ] **Phase 2: Slider & Navigation** - Custom GSAP-driven project carousel with keyboard, touch, click controls, deep linking, and progress indicator
- [x] **Phase 3: Content & Theming** - Project content panels (hero, narrative, metadata, CTA) with per-project color palette morphing and entry animations (completed 2026-03-06)
- [ ] **Phase 4: Depth & Production Quality** - 3D parallax depth effects, 60fps transitions, lazy loading, and accessibility fallbacks

## Phase Details

### Phase 1: Foundation
**Goal**: A running application with the project data model, theme variable infrastructure, and responsive layout skeleton -- ready for the slider to plug into
**Depends on**: Nothing (first phase)
**Requirements**: PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Running dev server serves a page that renders placeholder content for at least 3 sample projects
  2. Layout adapts correctly across mobile (375px), tablet (768px), and desktop (1440px) viewports
  3. CSS custom property theme system exists and can be toggled between two different color palettes visually
  4. First contentful paint is under 3 seconds on a throttled connection (simulated 3G)
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md -- Scaffold Vite+React+TS, Tailwind CSS 4 theming, typed project data model, test infrastructure
- [ ] 01-02-PLAN.md -- Responsive layout shell (AppShell, Navigation, ProjectCard) with theme toggle verification

### Phase 2: Slider & Navigation
**Goal**: Users can browse all projects through a smooth, accessible carousel with multiple input methods and shareable URLs
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. User can navigate between 12+ project slides with smooth animated transitions (no jumps or flashes)
  2. User can navigate via keyboard arrows, touch swipe gestures, and on-screen click controls
  3. Each project slide has a unique URL; copying and pasting that URL loads the correct project directly; browser back/forward moves between previously visited projects
  4. A visible progress indicator shows the user which project they are viewing and how many total exist
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md -- Core GSAP slider with Zustand store, Observer multi-input, slide transitions, and 12+ projects
- [ ] 02-02-PLAN.md -- Deep linking (hash URLs with history), keyboard navigation, and progress indicator

### Phase 3: Content & Theming
**Goal**: Each project tells its story through rich content panels while the page atmosphere transforms to match each project's identity
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, VIS-01, VIS-02
**Success Criteria** (what must be TRUE):
  1. Each project slide displays a high-quality hero visual, a "what we solved" narrative (problem/solution/outcome), and metadata tags (industry, tech stack, year)
  2. Navigating between projects causes the page color palette (backgrounds, accents, text tones) to morph smoothly -- each project feels like its own branded environment
  3. A visible contact CTA is reachable from any project slide, inviting the user to inquire about working with Hargile
  4. Page load presents a staggered entry animation that reveals content elements in sequence rather than all at once
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md -- Data model extensions (narratives, industry, unique colors) and color derivation utility
- [ ] 03-02-PLAN.md -- Split-screen content layout, metadata pill tags, and floating contact CTA
- [ ] 03-03-PLAN.md -- GSAP color morphing during transitions and staggered content reveal animations

### Phase 4: Depth & Production Quality
**Goal**: The showcase feels premium and polished -- 3D depth effects respond to the cursor, animations never drop frames, and the experience degrades gracefully for all users
**Depends on**: Phase 3
**Requirements**: VIS-03, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Project visuals respond to mouse movement with layered parallax depth -- elements shift at different rates creating a 3D perspective effect
  2. All slide transitions and animations maintain 60fps (no dropped frames visible in DevTools performance panel) with 12+ projects loaded
  3. Images and heavy assets lazy-load so that projects not yet viewed do not block initial rendering or navigation performance
  4. Users with prefers-reduced-motion enabled see a functional, content-complete experience with animations disabled or simplified
**Plans**: 2 plans

Plans:
- [ ] 04-01-PLAN.md -- Reduced motion hook, picture element with WebP srcset, font preloading, GSAP vendor chunk splitting
- [ ] 04-02-PLAN.md -- Mouse parallax depth on hero images, reduced motion transition branch, will-change lifecycle, adjacent image preloading

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-03-06 |
| 2. Slider & Navigation | 2/2 | Complete | 2026-03-06 |
| 3. Content & Theming | 3/3 | Complete   | 2026-03-06 |
| 4. Depth & Production Quality | 0/2 | Not started | - |
