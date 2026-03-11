# Feature Research

**Domain:** Immersive agency portfolio showcase (single-page, animation-heavy, client-facing)
**Researched:** 2026-03-11 (updated for v1.1 case study milestone)
**Confidence:** MEDIUM-HIGH

---

## v1.0 FOUNDATION (Already Built — Reference Only)

The following features were researched and built in the slider/foundation phase. They are listed here as context for the case study milestone's dependency analysis.

| Feature | Status |
|---------|--------|
| Smooth project slider with GSAP Observer | Shipped |
| Per-project color theming with `applyTheme()` + CSS custom properties | Shipped |
| Mouse parallax with `useParallax` hook | Shipped |
| Hero visuals, narrative copy, tech stack tags per slide | Shipped |
| Smooth entry animations | Shipped |
| Responsive layout | Shipped |
| Reduced-motion compliance (`prefers-reduced-motion`) | Shipped |
| 60fps performance baseline | Shipped |

---

## v1.1 CASE STUDIES (Current Milestone — New Features Only)

### Context

Case study pages are the second layer of the portfolio: a client clicks/taps into a project from the slider and arrives at a deep, scrollable narrative. The goal is for the case study itself to feel like a demonstration of Hargile's craft — polished, intentional, premium. Potential clients should finish reading and feel confident about hiring Hargile.

---

### Table Stakes (Clients Expect These)

Features a potential client visiting an agency portfolio will assume exist inside any case study. Missing any of these makes the case study feel incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Challenge / problem statement section | Every professional case study opens with context. Clients need to understand what was broken before they can appreciate what was fixed. | LOW | Top of case study. Static copy + atmospheric visual or project screenshot. No interaction required. |
| Solution / approach section | Clients need to understand what Hargile actually did, not just the outcome. | LOW | Descriptive copy with supporting visuals. Can be static on v1.1. |
| Results / metrics section | Non-technical clients remember numbers. "300% uplift in conversion" is the sentence they repeat in their next meeting. | MEDIUM | 3–5 animated number counters per project. Triggered on scroll entry via GSAP ScrollTrigger. |
| Deliverables / screenshots gallery | Shows the tangible output. Clients need to see the actual product screens, not just read about them. | MEDIUM | CSS Grid image gallery with staggered scroll-triggered reveals. Images lazy-loaded. Dependency: lazy loading pattern already in project. |
| Back-navigation to slider | Users must be able to return to the project carousel without losing context or getting stranded. | LOW | Persistent sticky back button. On click, reverses the entry transition. |
| Responsive layout for case study sections | Same client may review on phone after seeing it on a conference room display. | MEDIUM | Case study sections reflow. Gallery collapses to single column on mobile. |
| Reduced-motion compliance | Already established in the slider; must be consistent throughout. Clients with vestibular disorders are in every agency's client list. | LOW | CSS `prefers-reduced-motion` disables counter animations, parallax, and scroll reveals. Pattern already in project. |
| Color theme inheritance from slider | The client just watched Atlas / Pulse / Verde with its specific color world in the slider. If the case study is white/grey, the continuity breaks and it feels like a different product. | LOW | Calls the existing `applyTheme()` function on case study mount. Near-zero implementation cost. Dependency: existing theming system. |

### Differentiators (Competitive Advantage)

These features are not expected but are noticed. They are what separates this case study experience from a PDF or a standard Notion page.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Animated process timeline | Transforms a static list into a cinematic walk-through of discovery → design → development → launch. Clients feel they are watching the project happen. Aligns with the "racing circuit" narrative motif from Alexis's vision. | MEDIUM | Vertical timeline with per-node scroll-triggered reveals via GSAP ScrollTrigger. Each phase node (icon + label + description) stagger-animates in as the user scrolls down. |
| Scroll-triggered section reveals (shared utility) | Every section entering the viewport with a smooth fade-translate feels intentional and premium rather than a static page. Controls pacing like a good editorial layout. | MEDIUM | GSAP ScrollTrigger `once: true` for one-shot reveals. `scrub` mode for atmospheric parallax layers. This is a shared utility used by all content sections — build it first. |
| Slider-to-case-study entry transition | Makes the navigation feel like zooming into the project rather than a page navigation. The active slide panel expands to fill the viewport while the case study content fades in. This is the moment that establishes the case study as a continuation of the slider experience, not a separate page. | HIGH | Baseline: GSAP `.to()` clip-path or scale expansion from slide position + crossfade. Stretch goal: GSAP Flip plugin for true element-morphing. Requires a CSS fallback for any GSAP failure. Risk: if it stutters it damages credibility. |
| Parallax depth within case study sections | Foreground/background layers moving at different scroll speeds creates spatial depth, consistent with the slider experience. | LOW | Reuses the existing `useParallax` hook directly. Near-zero incremental cost once the hook exists. |
| Testimonial / client quote pull-out | A large-format client quote styled distinctively adds social proof directly within the narrative. Non-technical clients respond strongly to peer validation in context. | LOW | Large `blockquote` with scroll reveal. High value-to-effort ratio. Static content. |
| "Next project" CTA at case study end | Keeps clients browsing instead of bouncing after finishing a case study. Creates a natural reading flow through all three projects. | LOW | Minimal preview of the next project (title + color swatch) with a CTA button that triggers the slider transition to the next project. |
| Reading progress bar | Long scrollable pages benefit from a subtle progress cue. Clients feel oriented rather than lost. | LOW | Thin fixed bar at top of viewport. CSS Scroll-Driven Animations API (`animation-timeline: scroll()`) or lightweight GSAP ScrollTrigger. Zero design overhead. |
| Team credits section | Builds trust and humanizes the agency. Clients who are evaluating a long-term partner want to know real people did this work. | LOW | Small profile cards at the bottom of the case study. Static content. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full chart library (Recharts, Chart.js, Victory) | Animated charts look impressive in agency showcases. | Adds 40–80 KB to bundle for 3–5 data points per project. Requires configuration per project update. The "chart" needed is almost always 3 bars and 2 numbers. | Hand-rolled CSS bar chart with GSAP width animation on scroll entry. Zero external dependency, trivially maintainable in code. |
| Lightbox modal for gallery images | Clients want to see images at full size. | A full-screen modal breaks the scroll narrative. Requires focus trap management for accessibility. Requires keyboard dismiss. Most premium agency portfolios do not use lightbox inside case studies — they use large images inline. | Use generous image sizes in the gallery (full-width panels or large grid cells). For the rare case where a client wants full resolution, a link opening the asset in a new tab is sufficient. |
| Video autoplay in case study hero | Video adds immersion and is often already produced by clients. | Autoplaying video dramatically increases page weight. Blocked with sound in most browsers. Conflicts with `prefers-reduced-motion`. Requires hosting/CDN strategy. | Use a high-quality static frame from the video with parallax treatment. Provide an opt-in play button if a video asset exists. |
| Smooth-scroll override (Lenis or similar) | Buttery custom scroll feel. | Overriding native scroll on a content-heavy page causes accessibility failures, conflicts with browser gestures on mobile, and can interact badly with GSAP ScrollTrigger if not coordinated carefully. The existing slider already has its own scroll context — adding a second scroll hijacker creates a conflict surface. | Use GSAP ScrollTrigger with native scroll. The `scrub` parameter on ScrollTrigger already provides the smoothed feel without global scroll override. |
| Pinned horizontal storytelling panel | Dramatic effect used by award-winning agency sites. GSAP pin + horizontal scrub. | Breaks on mobile (horizontal pin in a vertical scroll context is jarring on narrow screens). Adds significant complexity. Conflicts with any content after the pinned section requiring careful height calculation. | Vertical scroll-stagger reveals for the timeline section achieve a similar "unveiling" rhythm without the pin complexity. Defer horizontal pin to v2 with a dedicated mobile solution. |
| Infinite scroll / auto-advance between projects | Feels seamless and keeps clients in the portfolio. | Removes the user's sense of place and agency. A client reading a case study needs to finish it deliberately. Auto-redirect to the next project before they are done is disrespectful. | A prominent "Next project →" CTA at the bottom with a brief preview. Explicitly guided, not automatic. |
| CMS-driven content management | Makes updating content easier for non-developers. | Explicitly out of scope per PROJECT.md. Adds backend, auth, data modeling, and deployment complexity for a portfolio updated infrequently by developers. | Content as TypeScript data objects per project. Structured types (TypeScript interfaces) enforce consistency and catch missing fields at build time. |

---

## Feature Dependencies

```
[Slider-to-case-study entry transition]
    └──requires──> [Case study panel mounted / route active]
    └──requires──> [GSAP Flip or coordinated GSAP.to timeline]
    └──enhances──> [Color theme inheritance in case study]
    └──requires──> [Back-navigation] (entry must be reversible)

[Color theme inheritance in case study]
    └──requires──> [applyTheme() — ALREADY BUILT]
    └──requires──> [CSS custom properties system — ALREADY BUILT]

[Animated process timeline]
    └──requires──> [GSAP ScrollTrigger — NEW dependency]
    └──requires──> [Structured timeline data per project]
    └──enhances──> [Scroll-triggered section reveals utility]

[Results / metrics (animated counters)]
    └──requires──> [GSAP ScrollTrigger — NEW dependency]
    └──requires──> [Structured metrics data per project]

[Deliverables gallery with scroll reveals]
    └──requires──> [Image assets per project]
    └──requires──> [Scroll-triggered section reveals utility]

[Scroll-triggered section reveals — SHARED UTILITY]
    └──requires──> [GSAP ScrollTrigger — NEW dependency]
    └──enhances──> [All content sections in case study]
    └──NOTE: build this first — all other animated sections depend on it]

[Parallax depth in case study sections]
    └──requires──> [useParallax hook — ALREADY BUILT]

[Back-navigation to slider]
    └──requires──> [Reverse of entry transition animation]
    └──requires──> [Zustand useSliderStore — ALREADY BUILT]
    └──conflicts──> [Entry transition complexity — must mirror it]

[Reading progress bar]
    └──requires──> [CSS scroll-driven animations OR GSAP ScrollTrigger]
    └──independent of all other features]

[Testimonial / client quote pull-out]
    └──requires──> [Scroll-triggered section reveals utility]
    └──requires──> [Content data per project]

[Next project CTA]
    └──requires──> [Zustand useSliderStore — to trigger slider navigation]
    └──requires──> [Project data for preview]

[ScrollTrigger cleanup on unmount]
    └──required by ALL ScrollTrigger features
    └──NOTE: Critical — ghost triggers on slider return will break the slider
    └──Implementation: gsap.context() scoped to case study component, .revert() on unmount]
```

### Dependency Notes

- **Color theme inheritance** is near-free. The existing `applyTheme()` function is a direct call. First thing to implement.
- **Scroll-triggered section reveals** is the foundational utility. All animated sections use it. Build it as a reusable hook or component before building individual sections.
- **GSAP ScrollTrigger** is the one new plugin dependency. It is part of GSAP core (already installed) but not yet used in the project. No new package needed — just import and register.
- **ScrollTrigger cleanup on unmount** is non-negotiable. Using `gsap.context()` scoped to the case study component and calling `.revert()` in the `useEffect` cleanup function prevents ghost triggers when returning to the slider. This is the most common GSAP + React bug and will silently break the slider if missed.
- **Slider-to-case-study entry transition** is the highest-risk feature. A CSS fallback (instant fade-in overlay) must exist so any GSAP failure degrades gracefully without blocking content access.
- **Pinned horizontal panel** conflicts with mobile layout and is deferred. Do not build in v1.1.

---

## MVP Definition

### Launch With (v1.1 — this milestone)

Minimum viable case study — what must ship for this milestone to deliver its stated goal.

- [ ] **Slider-to-case-study entry transition (baseline)** — without this the slider is a dead end; a simple fade-expand is sufficient for v1.1
- [ ] **Challenge section** — static copy + visual; clients need context before caring about results
- [ ] **Process timeline with animated reveals** — the signature differentiator of this milestone; scroll-triggered node-by-node stagger
- [ ] **Results / metrics with animated counters** — most memorable element for non-technical clients; 3–5 counters per project
- [ ] **Deliverables gallery with scroll reveals** — shows the actual output; staggered grid reveal on scroll entry
- [ ] **Color theme inheritance** — mandatory for coherence with slider; near-zero effort
- [ ] **Back-navigation to slider** — clients must be able to return
- [ ] **Reduced-motion compliance** — non-negotiable given existing pattern in project
- [ ] **Responsive layout for case study sections** — mobile clients are real
- [ ] **Rich placeholder content for Atlas, Pulse, Verde** — case studies need plausible content to demo convincingly
- [ ] **ScrollTrigger cleanup on unmount** — technical prerequisite for everything; prevents slider regression

### Add After Validation (v1.x)

Features to add once the core case study is working and stable.

- [ ] **Testimonial / client quote pull-out** — high value-to-effort; add when core sections are done
- [ ] **Team credits section** — adds humanity; static content
- [ ] **Next project CTA** — improves browsing flow; requires slider state integration
- [ ] **Reading progress bar** — polish detail; pure CSS or minimal ScrollTrigger
- [ ] **Parallax depth in case study sections** — hook already exists; low effort; add as polish layer

### Future Consideration (v2+)

- [ ] **GSAP Flip slider-to-case-study transition (upgrade)** — upgrade from fade-expand to true element morphing if v1.1 baseline is well-received
- [ ] **Pinned horizontal storytelling panel** — high complexity; breaks mobile; needs dedicated mobile solution first
- [ ] **Opt-in video embed** — requires asset hosting strategy; defer until projects have video assets
- [ ] **Custom SVG animated chart** — hand-rolled bar chart could replace plain counters for a richer metrics section in v2

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Entry transition (fade-expand baseline) | HIGH | LOW | P1 |
| Challenge section (static) | HIGH | LOW | P1 |
| Process timeline with animated reveals | HIGH | MEDIUM | P1 |
| Results / animated counters | HIGH | MEDIUM | P1 |
| Deliverables gallery | HIGH | MEDIUM | P1 |
| Color theme inheritance | HIGH | LOW | P1 |
| Back-navigation | HIGH | LOW | P1 |
| Scroll-triggered reveals (shared utility) | HIGH | MEDIUM | P1 |
| Reduced-motion compliance | HIGH | LOW | P1 |
| Responsive case study layout | HIGH | MEDIUM | P1 |
| Rich placeholder content (3 projects) | HIGH | MEDIUM | P1 |
| ScrollTrigger cleanup on unmount | HIGH (technical) | LOW | P1 |
| Testimonial quote pull-out | MEDIUM | LOW | P2 |
| Team credits | MEDIUM | LOW | P2 |
| Next project CTA | MEDIUM | LOW | P2 |
| Reading progress bar | LOW | LOW | P2 |
| Parallax in case study sections | MEDIUM | LOW | P2 |
| GSAP Flip entry transition (upgrade) | MEDIUM | HIGH | P3 |
| Pinned horizontal storytelling panel | MEDIUM | HIGH | P3 |
| Opt-in video embed | LOW | HIGH | P3 |
| Custom SVG animated chart | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add when P1 is stable
- P3: Nice to have, future consideration / v2+

---

## Competitor Feature Analysis

Top-tier agency portfolios and award-winning GSAP sites examined for pattern reference.

| Feature | Metalab (metalab.com) | Award-winning GSAP portfolios (Awwwards) | Our Approach |
|---------|----------------------|------------------------------------------|--------------|
| Slider → case study transition | Dedicated route with branded page-level transition | GSAP Flip or clip-path expansion from card element | Fade-expand baseline (v1.1), GSAP Flip upgrade (v2) |
| Section reveals | Staggered fade-up on scroll entry | ScrollTrigger scrub with parallax depth layers | GSAP ScrollTrigger `once: true` reveals; `scrub` for atmospheric parallax |
| Metrics display | Bold typographic counters, large numerals | Animated counter with ScrollTrigger trigger | GSAP counter tween triggered on viewport entry |
| Process timeline | Numbered list with iconography | Horizontal pin + scrub OR vertical scroll-stagger | Vertical scroll-stagger (avoids pin complexity and mobile issues) |
| Gallery | Full-bleed image rows, minimal chrome | Masonry or stacked panels with staggered reveal | CSS Grid gallery with staggered GSAP reveals per image |
| Navigation in case study | Minimal sticky back arrow | Project title + back in fixed header | Sticky back button inheriting project accent color |
| Scroll behavior | Native scroll, no override | Mix of native scroll + Lenis for smoothness | Native scroll + GSAP ScrollTrigger only; no scroll override |

---

## Integration Points with Existing System

Specific touchpoints between new case study features and the already-built slider/theming system.

| New Feature | Depends On (Existing) | Integration Risk |
|-------------|----------------------|-----------------|
| Color theme in case study | `applyTheme()`, CSS custom properties | LOW — direct function call |
| Entry transition | GSAP instance, slide DOM refs, Zustand state | MEDIUM — must not interfere with Observer plugin while transition is active |
| Back transition | GSAP, `useSliderStore` currentIndex | MEDIUM — must restore Zustand state and reverse animation cleanly |
| Parallax in sections | `useParallax` hook | LOW — direct reuse |
| Reduced-motion | CSS `prefers-reduced-motion` pattern | LOW — pattern already established |
| ScrollTrigger animations | GSAP ScrollTrigger (not yet used) | MEDIUM — must use `gsap.context()` scoped to case study; `.revert()` on unmount is mandatory |

---

## Key Observations

**What separates good agency case studies from great ones:**

1. **Lead with the outcome, then earn the context.** The most effective case studies open with the most impressive result (the number, the award, the transformation) and then rewind to explain how it happened. Non-technical clients decide whether to keep reading in the first three seconds.

2. **The timeline is the narrative engine.** A process timeline transforms a list of deliverables into a story with a beginning, middle, and end. It is the feature that makes a client feel like they were there. Animate it on scroll so clients discover each phase in sequence rather than scanning it all at once.

3. **Restraint in animation is more impressive than abundance.** Award-winning portfolios (Immersive Garden, Locomotive, Siroppe) use 2–3 animation techniques executed flawlessly. The case study animations should feel inevitable, not showy. Each animation should serve the content's pacing, not compete with it.

4. **Gallery quality is determined by image quality, not layout complexity.** A simple CSS Grid with scroll reveals and high-quality project screenshots is more impressive than a complex masonry layout with mediocre images. The image assets matter more than the gallery interaction.

5. **The entry transition is one of the highest risk / highest reward features.** If it works flawlessly it creates a premium "zoom into the project" feeling. If it stutters or fails, it damages the exact trust the portfolio is trying to build. A simple, reliable fade-expand is better than an ambitious GSAP Flip that fails 10% of the time.

---

## Sources

- [The Art of Storytelling for Case Studies | Indeed Design](https://indeed.design/article/the-art-of-storytelling-for-case-studies/)
- [UX Case Study Structure | uxfol.io](https://blog.uxfol.io/ux-case-study-structure/)
- [Metalab.com Case Study | Awwwards](https://www.awwwards.com/metalab-com-case-study.html)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Flip Plugin Docs](https://gsap.com/docs/v3/Plugins/Flip/)
- [Animating Responsive Grid Layout Transitions with GSAP Flip | Codrops](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/)
- [Building a Layered Zoom Scroll Effect with GSAP ScrollSmoother and ScrollTrigger | Codrops](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/)
- [Joffrey Spitzer Portfolio — Astro + GSAP FLIP Transitions | Codrops](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- [GSAP Showcase](https://gsap.com/showcase/)
- [54 GSAP ScrollTrigger Examples | freefrontend.com](https://freefrontend.com/scroll-trigger-js/)
- [10 Award-Winning Websites Pushing Boundaries with GSAP | Orpetron / Medium](https://medium.com/orpetron/10-award-winning-websites-pushing-boundaries-with-gsap-animation-8b83bb45e94f)
- [Siroppe Creative Agency Case Study | Awwwards](https://www.awwwards.com/siroppe-creative-agency-case-study.html)

---

*Feature research for: Hargile portfolio case study pages (v1.1 milestone)*
*Researched: 2026-03-11*
