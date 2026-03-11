# Roadmap: Hargile Portfolio Showcase

## Overview

This roadmap delivers an immersive, single-page portfolio showcase for Hargile in four phases. We start with the technical foundation and responsive skeleton, then build the core slider interaction, layer in project content with dynamic color theming, and finish with 3D depth effects and production-grade performance. Each phase delivers a verifiable capability -- by the end, potential clients experience a showcase that itself demonstrates Hargile's craft.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

**Milestone v1.0 (Complete)**

- [x] **Phase 1: Foundation** - Project scaffolding, data model, CSS theme variable system, and responsive layout skeleton (completed 2026-03-06)
- [x] **Phase 2: Slider & Navigation** - Custom GSAP-driven project carousel with keyboard, touch, click controls, deep linking, and progress indicator (completed 2026-03-06)
- [x] **Phase 3: Content & Theming** - Project content panels (hero, narrative, metadata, CTA) with per-project color palette morphing and entry animations (completed 2026-03-06)
- [x] **Phase 4: Depth & Production Quality** - 3D parallax depth effects, 60fps transitions, lazy loading, and accessibility fallbacks (completed 2026-03-10)

**Milestone v1.1: Case Studies & Storytelling**

- [ ] **Phase 5: Scroll Infrastructure & View Scaffold** - Case study overlay architecture, view-mode store, Observer lifecycle, ScrollTrigger scope, hash routing guard, and placeholder data model
- [ ] **Phase 6: Narrative Content Sections** - Challenge/solution prose, animated process timeline, color theme inheritance, and all scroll-triggered section reveals
- [ ] **Phase 7: Metrics, Gallery & Polish** - Animated metric counters, deliverables gallery, testimonial pull-out, team credits, reading progress bar, and next-project CTA

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
- [x] 01-01-PLAN.md -- Scaffold Vite+React+TS, Tailwind CSS 4 theming, typed project data model, test infrastructure
- [x] 01-02-PLAN.md -- Responsive layout shell (AppShell, Navigation, ProjectCard) with theme toggle verification

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
- [x] 02-01-PLAN.md -- Core GSAP slider with Zustand store, Observer multi-input, slide transitions, and 12+ projects
- [x] 02-02-PLAN.md -- Deep linking (hash URLs with history), keyboard navigation, and progress indicator

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
- [x] 03-01-PLAN.md -- Data model extensions (narratives, industry, unique colors) and color derivation utility
- [x] 03-02-PLAN.md -- Split-screen content layout, metadata pill tags, and floating contact CTA
- [x] 03-03-PLAN.md -- GSAP color morphing during transitions and staggered content reveal animations

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
- [x] 04-01-PLAN.md -- Reduced motion hook, picture element with WebP srcset, font preloading, GSAP vendor chunk splitting
- [x] 04-02-PLAN.md -- Mouse parallax depth on hero images, reduced motion transition branch, will-change lifecycle, adjacent image preloading

### Phase 5: Scroll Infrastructure & View Scaffold
**Goal**: Users can click into a case study from the slider and return to the slider — both directions animate correctly, scroll works inside the case study, the URL reflects the view, and the page is clean on every open/close cycle
**Depends on**: Phase 4
**Requirements**: CSNAV-01, CSNAV-02, CSVIS-02, CSVIS-03, CSVIS-04, CSDATA-01
**Success Criteria** (what must be TRUE):
  1. Clicking the case study CTA on any project slide animates a full-screen case study panel into view; the slider is visually replaced but not destroyed
  2. Clicking the back button inside the case study reverses the entry animation and returns the user to the exact slide they came from
  3. The case study panel scrolls independently; slider input (wheel, touch, keyboard) has no effect while the case study is open
  4. The URL updates to reflect the case study view (e.g. `#atlas/case-study`); browser back exits the case study, not the slider
  5. The case study inherits the project's color theme on open; no color bleed from adjacent projects appears
  6. Closing and reopening a case study multiple times leaves no ghost scroll animations from previous sessions
**Plans**: TBD

### Phase 6: Narrative Content Sections
**Goal**: Users can read the full challenge, solution, and process story for each project, with content that reveals section-by-section as they scroll
**Depends on**: Phase 5
**Requirements**: CSCONT-01, CSCONT-02, CSCONT-03, CSVIS-01
**Success Criteria** (what must be TRUE):
  1. Each case study displays a challenge/problem section and a solution/approach section with readable prose specific to that project
  2. Scrolling through the case study reveals each section with a staggered fade-and-translate animation; sections above the fold are already visible on open
  3. The process timeline (discovery, design, development, launch) reveals its steps one by one as the user scrolls past each node
  4. All scroll-triggered text animations are absent or replaced with instant visibility for users with prefers-reduced-motion enabled
**Plans**: TBD

### Phase 7: Metrics, Gallery & Polish
**Goal**: Users finish reading each case study having seen compelling results, browsed deliverable screenshots, read a client quote, and been offered a path to the next project
**Depends on**: Phase 6
**Requirements**: CSCONT-04, CSCONT-05, CSCONT-06, CSCONT-07, CSNAV-03, CSNAV-04
**Success Criteria** (what must be TRUE):
  1. The metrics section counts up 3-5 numbers (e.g. "+40% conversion") as the user scrolls into view; counters run once and do not reset on re-scroll
  2. The deliverables gallery displays project screenshots in a responsive grid; each image reveals with a staggered scroll animation
  3. A testimonial pull-out and a team credits block appear near the bottom of each case study
  4. A "next project" preview at the bottom of the case study lets the user continue browsing without returning to the slider
  5. A reading progress bar visible at the top of the case study tracks how far through the content the user has scrolled
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-03-06 |
| 2. Slider & Navigation | 2/2 | Complete | 2026-03-06 |
| 3. Content & Theming | 3/3 | Complete | 2026-03-06 |
| 4. Depth & Production Quality | 2/2 | Complete | 2026-03-10 |
| 5. Scroll Infrastructure & View Scaffold | 0/? | Not started | - |
| 6. Narrative Content Sections | 0/? | Not started | - |
| 7. Metrics, Gallery & Polish | 0/? | Not started | - |
