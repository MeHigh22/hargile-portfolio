# Hargile Portfolio Showcase

## What This Is

An immersive portfolio showcase for Hargile that presents client projects through a slider entry point leading into deep, scrollable case studies. Each project tells its full story — challenge, process timeline, results with metrics, and deliverables — through scroll-triggered animations and rich visual storytelling. Built to impress potential clients evaluating Hargile for new projects.

## Core Value

Potential clients instantly feel the quality of Hargile's work through a showcase experience so smooth and polished that the portfolio itself demonstrates Hargile's capabilities.

## Requirements

### Validated

<!-- Shipped in v1.0 -->
- ✓ Immersive project slider/carousel with smooth transitions — v1.0
- ✓ Per-project color theme/mood that shifts dynamically — v1.0
- ✓ 3D-enhanced 2D layout with parallax and depth effects — v1.0
- ✓ Hero visual, narrative, tech stack, and CTA per slide — v1.0
- ✓ Smooth entry animations per project — v1.0
- ✓ Responsive design across devices — v1.0
- ✓ Performant with 12+ projects loaded — v1.0
- ✓ Best-in-class framework and animation stack — v1.0

### Active

- [ ] Scrollable case study view per project (click from slider to dive deep)
- [ ] Project challenge/problem section with visual storytelling
- [ ] Animated process timeline (discovery → design → dev → launch)
- [ ] Results/metrics section with animated counters and simple charts
- [ ] Deliverables/screenshots gallery with scroll-triggered reveals
- [ ] Rich placeholder content for 3 beta projects (atlas, pulse, verde)
- [ ] Scroll-triggered animations throughout case study sections
- [ ] Smooth transition from slider to case study view and back
- [ ] Intuitive navigation so clients can read through naturally

### Out of Scope

- CMS/headless content management — projects managed via code updates
- Multi-page site (about, services, contact) — standalone showcase page only
- Full 3D environment/scene — using 3D-enhanced 2D approach instead
- Mobile native app — web only
- User authentication or admin panel
- Real-time features

## Context

- Colleague Alexis envisioned a racing-game-style circuit picker — projects presented like choosing a track, with animated entrances matching each project's mood
- The team explicitly asked about evolving from plain HTML/CSS to a frontend framework
- Open to the best tech stack for the job — no framework constraints
- No rush on timeline — quality and "wow factor" are the priority
- This is a client-facing tool: every interaction should communicate Hargile's attention to detail and technical sophistication

## Constraints

- **Content**: Projects added/updated by developers in code (no CMS needed)
- **Performance**: Must remain smooth with 12+ projects — no jank on transitions
- **Audience**: Potential clients (non-technical) — the experience must feel premium, not "techy demo"

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standalone page over full site | Focused scope, maximum impact on the showcase experience | — Pending |
| 3D-enhanced 2D over full 3D | Best wow-factor-to-effort ratio, avoids WebGL complexity rabbit hole | — Pending |
| Color theme shifts per project | Creates mood variety without requiring per-project 3D scenes | — Pending |
| Framework TBD (research needed) | Team open to best tool — research will inform React vs Vue vs other | ✓ Good (React 19 + Vite 7 + GSAP) |

## Current Milestone: v1.1 Case Studies & Storytelling

**Goal:** Transform project slides into deep, scrollable case studies with animated timelines, metrics, and visual storytelling — inspired by modern agency portfolios like Redstone.

**Target features:**
- Scrollable case study pages per project
- Animated process timeline
- Results/metrics with animated counters and charts
- Deliverables gallery with scroll-triggered reveals
- Rich placeholder content for 3 beta projects

---
*Last updated: 2026-03-11 after milestone v1.1 started*
