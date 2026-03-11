# Project Research Summary

**Project:** Hargile Portfolio — Case Studies Milestone (v1.1)
**Domain:** Immersive agency portfolio SPA — scroll-triggered case study pages layered onto existing GSAP Observer slider
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

This milestone adds deep-scrollable case study pages to an already-built GSAP Observer-based portfolio slider. The v1.0 foundation (slider, per-project color theming, parallax, reduced-motion compliance) is fully shipped. The challenge is integrating a scroll-driven content layer — with animated timelines, metric counters, deliverables galleries, and section reveals — without breaking the existing GSAP Observer that hijacks all scroll input for slide navigation. The critical architectural decision is to treat case studies as a full-screen overlay layer (a sibling of the slider in the DOM, not a child) toggled by a Zustand view-mode store, with no router introduced.

The recommended approach uses only three new dependencies: Lenis for smooth scroll (not yet installed), Recharts for simple metric charts, and yet-another-react-lightbox for the gallery lightbox. Everything else — ScrollTrigger, SplitText, counter animations, section reveals, and the process timeline — comes from the already-installed GSAP package. The integration must be built in a strict order: data model first, then view store, then transition infrastructure, then the case study panel shell, then individual content sections. This order is dictated by hard dependencies — nothing renders correctly until the scroll container architecture is correct.

The highest-risk area is the interaction surface between the existing GSAP Observer and the new ScrollTrigger instances. Nine specific pitfalls are documented, and five of them must be addressed in Phase 1 before any content is built. The two that cause the most silent failure: (1) the Observer's `preventDefault: true` blocks all scroll input in the case study unless explicitly disabled on open, and (2) ScrollTrigger defaults to `window` as the scroller, but the case study must use a custom overflow container — every `ScrollTrigger.create()` call must pass `scroller: caseStudyScrollRef.current`. Get these two right in the scaffold and the rest of the milestone is straightforward.

---

## Key Findings

### Recommended Stack

The existing stack (React 19, Vite, TypeScript, Tailwind CSS v4, GSAP 3.14, Zustand) covers approximately 85% of what the case study milestone needs. GSAP's ScrollTrigger and SplitText plugins are already bundled in the installed `gsap` package — they just need to be imported and registered. GSAP's counter tween pattern (`gsap.to(obj, { value: N, onUpdate })`) replaces any external counter library.

Three new installs are warranted. Lenis (`^1.3.18`) provides smooth scroll for the case study container and integrates with ScrollTrigger via `scrollerProxy`. Recharts (`^3.8.0`) provides React-native SVG charts that accept CSS custom property values, allowing the existing per-project color theme to flow into chart fills automatically. yet-another-react-lightbox (`^3.29.1`) provides the gallery lightbox with full React 19 support and zero conflicts with GSAP's ScrollTrigger gallery reveals (it opens as a portal overlay, not inside the scroll container).

**Core new technologies:**
- `lenis ^1.3.18` — smooth scroll host for case study panel — compatible with GSAP ScrollTrigger via `scrollerProxy`; preferred over GSAP ScrollSmoother because it does not require wrapper-div DOM structure
- `recharts ^3.8.0` — declarative SVG metric charts — CSS custom property theming means project color morphing updates chart colors automatically; React 19 compatible
- `yet-another-react-lightbox ^3.29.1` — gallery lightbox — portal-based, no conflict with ScrollTrigger reveal animations on the gallery grid; keyboard and touch nav built in
- `gsap/ScrollTrigger` (built-in) — scroll-triggered section reveals, counter entry, timeline animation, gallery stagger
- `gsap/SplitText` (built-in, now free since 2025) — animated text reveals for case study headings

**What not to add:** React Router (existing `pushState` + Zustand covers the same ground without framework overhead), CountUp.js (duplicates GSAP counter tween functionality), react-spring or Framer Motion (creates a second competing animation system), AOS (CSS-class approach cannot integrate with GSAP timelines).

### Expected Features

Research identifies a clear two-tier feature set. Table stakes are what clients assume any professional case study contains. Differentiators are what separate this from a PDF or a Notion page.

**Must have (v1.1 launch — P1):**
- Entry transition from slider to case study — without this the slider is a dead end; fade-expand baseline is sufficient for v1.1
- Challenge / problem statement section — clients need context before they care about results
- Process timeline with animated scroll-triggered reveals — the signature differentiator of this milestone
- Results / metrics with GSAP animated counters — most memorable element for non-technical clients; 3-5 per project
- Deliverables gallery with staggered scroll reveals — shows tangible output
- Color theme inheritance from slider (`applyTheme()` call on case study mount) — near-zero cost, mandatory for coherence
- Back-navigation to slider — sticky back button; must reverse the entry transition
- Reduced-motion compliance — non-negotiable given the pattern already established in v1.0
- Responsive layout for case study sections — gallery collapses to single column on mobile
- Rich placeholder content for Atlas, Pulse, Verde — case studies need plausible content to demo convincingly
- ScrollTrigger cleanup via `gsap.context()` on unmount — technical prerequisite; prevents ghost triggers on slider return

**Should have (v1.x after validation — P2):**
- Testimonial / client quote pull-out — high value-to-effort ratio; static content + scroll reveal
- Team credits section — builds trust; static content
- Next project CTA at case study end — keeps clients browsing; requires slider state integration
- Reading progress bar — polish; CSS scroll-driven animations or minimal ScrollTrigger
- Parallax depth in case study sections — reuses existing `useParallax` hook at near-zero cost

**Defer to v2+ (P3):**
- GSAP Flip slider-to-case-study transition — upgrade from fade-expand to true element morphing
- Pinned horizontal storytelling panel — high complexity, breaks mobile, needs dedicated mobile solution first
- Opt-in video embeds — requires asset hosting strategy
- Custom SVG animated charts replacing counters

**Anti-features (do not build):**
- Global smooth scroll override without proper GSAP proxy setup — creates conflict surface with the existing Observer
- Video autoplay — page weight, browser blocking, `prefers-reduced-motion` conflict
- CMS-driven content management — out of scope; content as TypeScript data objects

### Architecture Approach

The case study integrates as a full-screen overlay sibling to the existing `<Slider>` component inside `AppShell`. It is never rendered as a child of the slider's `overflow-hidden` container. A new Zustand store (`useViewStore`) holds `mode: 'slider' | 'case'` and `activeProjectId`. The existing `useHashSync` hook is extended to parse the `#atlas/case-study` URL format. No router is introduced. The GSAP Observer is disabled (not killed) when entering case study mode and re-enabled on return. All case study ScrollTrigger instances are scoped to a `gsap.context()` tied to the case study container and reverted on every close.

**Build order (enforced by dependencies):**

1. `CaseStudyData` type extension and placeholder content — everything depends on data shape
2. `useViewStore` + `useHashSync` extension — transition infrastructure depends on the store
3. `useCaseStudyTransition` + Observer enable/disable wiring — panel shell depends on transitions
4. `CaseStudyPanel` shell (scroll container, Lenis, ScrollTrigger scope) — sections depend on scroll context
5. Individual content sections (`ChallengeSection`, `ProcessTimeline`, `MetricsSection`, `DeliverablesGallery`) — each independently buildable once the panel context exists
6. "Voir l'étude de cas" CTA on `Slide.tsx` — entry point wired after the destination exists

**Major components:**
1. `useViewStore` — binary mode switch (`slider | case`) + `activeProjectId`; drives all conditional rendering
2. `CaseStudyPanel` — fixed-position sibling overlay; owns Lenis instance and `gsap.context()` scope; specifies `scroller: panelRef.current` for all child ScrollTrigger calls
3. `useCaseStudyTransition` — GSAP open/close timelines; manages Observer lifecycle and `pushState`
4. `ChallengeSection`, `ProcessTimeline`, `MetricsSection`, `DeliverablesGallery` — independently buildable content sections; all use the shared scroll-reveal utility pattern
5. `CaseStudyNav` — fixed back button inside case study view; sticky, inherits project accent color

### Critical Pitfalls

1. **Observer blocks all case study scroll** — the existing Observer's `preventDefault: true` consumes every wheel/touch/pointer event. Must call `obs.disable()` (not `.kill()`) before the case study becomes interactive. Verify the Observer target is the slider container, not `window`. Address in Phase 1.

2. **ScrollTrigger watching wrong scroller** — ScrollTrigger defaults to `window`. The case study must be a custom overflow container. Every `ScrollTrigger.create()` inside the case study must pass `scroller: caseStudyScrollRef.current`. Call `ScrollTrigger.refresh()` in a `useLayoutEffect` after the panel renders and has measurable height. Address in Phase 1.

3. **Case study rendered as child of slider's `overflow: hidden` container** — clips case study content and breaks `position: fixed` pinning (further compounded by GSAP's `will-change: transform` on slide elements during transitions, which creates a new containing block). Render the case study as a sibling of `<Slider>` in `App.tsx`. This is a DOM architecture decision made once at scaffold time; refactoring later is expensive. Address in Phase 1.

4. **ScrollTrigger instances accumulate across open/close cycles** — ghost triggers fire out of sequence on re-open; memory grows monotonically. Use `gsap.context()` scoped to the case study container and call `.revert()` on every close path (button, Escape key, browser back). Never use `ScrollTrigger.killAll()` — it kills slider instances too. Address in Phase 1.

5. **Hash URL collision** — the existing `useHashSync` has no concept of case study sub-paths. Browser back from `#atlas/case-study` currently triggers `goToSlide()` with an unrecognized hash. Guard the `popstate` handler: if case study is open, call `closeCaseStudy()` and return before slider navigation logic runs. Address in Phase 1.

6. **CSS custom property theme collision** — case study per-section color changes must NOT tween `:root` variables. Scope case study color overrides to `--cs-*` prefixed variables on the case study container element. Also guard the "open case study" action: block it while `isAnimating` is true in the slider store (otherwise the case study opens mid-interpolation with a blended palette). Address in Phase 2.

7. **Lenis + ScrollTrigger position drift without `scrollerProxy`** — if Lenis is used, it must be configured with ScrollTrigger's `scrollerProxy` API before any ScrollTrigger instances are created, or Lenis must be omitted in favor of native scroll. Decision must be made in Phase 1 and held consistently. Address in Phase 1.

---

## Implications for Roadmap

All Phase 1 pitfall items are load-bearing infrastructure. None of the case study content sections can be correctly built until the scroll container architecture, Observer lifecycle, scroller configuration, `gsap.context()` cleanup, and hash routing are established. This strongly dictates a scaffold-first, content-second phase structure.

### Phase 1: Scroll Infrastructure and View Scaffolding

**Rationale:** Five of the nine documented critical pitfalls must be resolved before any content section is built. A wrong decision here (case study as slider child, Observer not disabled, wrong scroller) is architectural and expensive to undo mid-development. Establish the full integration skeleton first so every subsequent section is built on a verified, correct foundation.

**Delivers:** Working open/close transition between slider and case study; scroll that actually works inside the case study container; URL routing that does not break the slider back button; `gsap.context()` cleanup that leaves zero ghost triggers after open/close cycles; verified empty case study shell.

**Addresses (features):** Entry transition (fade-expand baseline), color theme inheritance, back navigation, ScrollTrigger cleanup infrastructure, responsive case study container.

**Avoids (pitfalls):** Observer blocking case study scroll (Pitfall 1); ScrollTrigger using wrong scroller (Pitfall 2); `overflow: hidden` parent clipping (Pitfall 3); ScrollTrigger instance accumulation (Pitfall 4); hash URL collision (Pitfall 5); Lenis + ScrollTrigger drift without scrollerProxy (Pitfall 7).

**Stack elements:** Lenis install, GSAP Observer enable/disable, GSAP ScrollTrigger registration, `useViewStore`, `useHashSync` extension.

**Research flag:** Standard patterns — ARCHITECTURE.md and PITFALLS.md provide exact implementation code for every decision point; no additional research needed.

### Phase 2: Data Model and Narrative Sections (Challenge + Timeline)

**Rationale:** With scroll infrastructure verified, add the TypeScript data model and build the two highest-complexity content sections. The process timeline is the signature differentiator of this milestone and must not be rushed into an unstable scaffold. The `CaseStudyData` type extension also unblocks all subsequent content sections.

**Delivers:** `CaseStudyData` type + placeholder content for Atlas, Pulse, Verde; `ChallengeSection` with scroll-triggered text reveals (SplitText headings + fade-up paragraphs); `ProcessTimeline` with per-node stagger animation as user scrolls.

**Addresses (features):** Challenge section, process timeline, rich placeholder content for all three projects.

**Avoids (pitfalls):** CSS custom property theme collision (Pitfall 6) — `--cs-*` scoping established before any per-section colors are authored; timeline pinning in custom scroller (Pitfall 9) — `pinType: "transform"` established if pinning is used.

**Uses:** `gsap/SplitText` (built-in), GSAP ScrollTrigger `once: true` reveals, vertical scroll-stagger for timeline (avoids horizontal pin complexity and mobile issues).

**Research flag:** Standard patterns — well-documented GSAP ScrollTrigger stagger and SplitText patterns; no additional research needed.

### Phase 3: Metrics Section and Deliverables Gallery

**Rationale:** Metrics (animated counters) and gallery (staggered image grid) are the most memorable elements for non-technical clients and the heaviest on assets. Building them third ensures the scroll context is stable and `gsap.context()` cleanup is verified before adding ScrollTrigger density.

**Delivers:** `MetricsSection` with GSAP counter animations triggered once on viewport entry; `DeliverablesGallery` with CSS Grid, staggered scroll reveals via `gsap.from()` with stagger, and YARL lightbox integration; lazy-loaded gallery images.

**Addresses (features):** Results/metrics with animated counters, deliverables gallery with scroll reveals.

**Avoids (pitfalls):** Counter re-trigger or freeze (Pitfall 8) — use `once: true` + GSAP object tween, not `setInterval`; performance trap of 20+ individual ScrollTrigger instances — use `ScrollTrigger.batch()` for gallery card reveals.

**Uses:** GSAP ScrollTrigger `once: true`, `gsap.to(obj, { value, onUpdate })` counter pattern, `yet-another-react-lightbox`, `loading="lazy"` on gallery images. Recharts only if bar-chart representation of metrics is preferred over pure counters after reviewing the visual result.

**Research flag:** Standard patterns for counters and stagger reveals; YARL portal integration is straightforward with no ScrollTrigger conflict. No additional research needed.

### Phase 4: Polish Features and Validation

**Rationale:** Once the three core content sections are working and stable, add P2 polish features that complete the case study experience and prepare it for client presentation.

**Delivers:** Testimonial quote pull-out with scroll reveal; "Next project" CTA at case study end wired to `useSliderStore`; reading progress bar (CSS scroll-driven animation); parallax depth in atmospheric sections (reuses existing `useParallax` hook); full reduced-motion audit of all case study animations; mobile layout verification at 375px.

**Addresses (features):** All P2 features from the feature prioritization matrix.

**Avoids (UX pitfalls):** Scroll position not reset on re-open; no Escape key close; transition duration too slow (cap at 400ms); counter text overflow on mobile; process timeline unreadable at mobile breakpoints.

**Research flag:** Standard patterns — no research needed. Parallax hook reuse is direct. Next project CTA is Zustand state integration with trivial implementation.

### Phase Ordering Rationale

- Scroll infrastructure precedes content because five critical pitfalls are infrastructure failures, not content failures. Building a section in an incorrect scroll context produces false negative test results and must be rebuilt.
- Data model is in Phase 2 (not Phase 1) because Phase 1 can use a stub project to verify animation mechanics; the full data type only needs to be correct before placeholder content is authored.
- Timeline precedes metrics and gallery because it is the highest-complexity animation and benefits from being built while the scroll patterns are freshest.
- Polish is last because two P2 features (next project CTA, reading progress bar) depend on specific content section measurements and stable scroll behavior.

### Research Flags

Phases needing `/gsd:research-phase` during planning:
- None identified. All four phases use well-documented GSAP patterns, existing project patterns, or trivially simple features. The architecture document provides implementation-ready code for every major decision point.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Observer enable/disable, custom scroller, `gsap.context()`, hash routing guard — all documented in GSAP official docs and PITFALLS.md with exact code.
- **Phase 2:** SplitText + ScrollTrigger reveals, vertical timeline stagger — standard GSAP patterns with direct Codrops and GSAP showcase examples.
- **Phase 3:** Counter tween pattern, `ScrollTrigger.batch()`, YARL portal integration — documented with code in STACK.md and PITFALLS.md.
- **Phase 4:** `useParallax` reuse, Zustand CTA wiring, CSS scroll-driven progress bar — all patterns already in the codebase or trivially simple.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | npm registry versions verified 2026-03-11; GSAP plugin free status corroborated by Codrops and community forums; React 19 compatibility confirmed for all three new libraries |
| Features | MEDIUM-HIGH | Feature expectations derived from agency portfolio competitor analysis (Metalab, Awwwards) and established case study UX patterns; feature ordering is editorial but grounded in client psychology research |
| Architecture | HIGH | Patterns verified directly against existing codebase (Slider.tsx, useHashSync.ts, useSliderStore.ts); all recommended patterns backed by GSAP official documentation |
| Pitfalls | HIGH | Nine pitfalls derived from direct codebase analysis of the existing Observer/GSAP setup plus multiple corroborating GSAP community forum threads; symptoms and remedies are specific and testable |

**Overall confidence:** HIGH

### Gaps to Address

- **Lenis vs. native scroll decision:** PITFALLS.md flags that Lenis requires `scrollerProxy` wiring before any ScrollTrigger instance is created — a non-trivial setup. The alternative (CSS `scroll-behavior: smooth` with native scroll) avoids the entire integration surface and is simpler. This binary decision must be made explicitly at the start of Phase 1. Recommendation: start with native scroll, add Lenis only if the scroll feel is unsatisfactory after the panel shell is working.
- **Recharts vs. pure GSAP counters:** FEATURES.md lists full chart libraries as an anti-feature for simple metric data. STACK.md recommends Recharts if bar-chart representation is wanted. Resolution: build metric counters first (pure GSAP, zero dependencies); add Recharts only if the counter display does not satisfy the visual brief during Phase 3 review.
- **Bundle size verification:** STACK.md notes Recharts (~50KB gzip) and YARL (~40KB gzip) bundle sizes are based on historical Bundlephobia data. Verify with current Bundlephobia if the team has an explicit performance budget for the case study panel before committing to both.
- **SplitText and React 19 StrictMode:** SplitText must be re-run after any text re-render. StrictMode is currently disabled in `main.tsx` (per project memory). If StrictMode is re-enabled before v1.1 ships, SplitText calls must be wrapped in `useLayoutEffect` and the split re-run on any prop change affecting text content.

---

## Sources

### Primary (HIGH confidence)
- GSAP ScrollTrigger official docs — `gsap.com/docs/v3/Plugins/ScrollTrigger/` — scroller, pinType, batch, refresh, `once: true` patterns
- GSAP Observer official docs — `gsap.com/docs/v3/Plugins/Observer/` — enable/disable API
- GSAP React guide — `gsap.com/resources/React/` — `gsap.context()`, `useLayoutEffect` pattern, SPA cleanup
- GSAP ScrollTrigger mistakes guide — `gsap.com/resources/st-mistakes/` — SPA cleanup pattern explicitly documented
- npm registry (2026-03-11) — YARL `^3.29.1` (last published 2026-02-17), Recharts `^3.8.0`
- Recharts 3.x migration guide — `github.com/recharts/recharts/wiki/3.0-migration-guide`
- Existing codebase (`Slider.tsx`, `useHashSync.ts`, `useParallax.ts`, `useSliderStore.ts`) — direct read; HIGH confidence

### Secondary (MEDIUM confidence)
- GSAP community forums — Observer + ScrollTrigger coexistence, `scrollerProxy` with Lenis, pin in custom scroller
- Codrops — GSAP Flip transitions, ScrollTrigger scroll effect patterns, SplitText free plugin status corroboration
- Lenis + ScrollTrigger integration — `github.com/darkroomengineering/lenis` + community forum patterns
- Agency portfolio competitor analysis — Metalab, Awwwards case studies, GSAP Showcase; case study UX pattern references

### Tertiary (LOW confidence)
- Bundle sizes — Recharts ~50KB gzip, YARL ~40KB gzip per historical Bundlephobia data; verify before committing to performance budget
- Lenis vs. ScrollSmoother comparison — third-party editorial rationale holds but should be tested if smooth scroll feel is a priority

---

*Research completed: 2026-03-11*
*Ready for roadmap: yes*
