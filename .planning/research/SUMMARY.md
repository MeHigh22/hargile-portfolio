# Research Summary: Hargile Portfolio Showcase

**Domain:** Immersive animated portfolio showcase (single-page, slider-based, 3D-enhanced 2D effects)
**Researched:** 2026-03-05
**Overall confidence:** HIGH

## Executive Summary

The Hargile portfolio showcase is a single-page, animation-heavy web application that presents 12+ client projects through an immersive slider experience with per-project color theming, parallax depth effects, and choreographed transitions. The domain is well-understood -- award-winning agency portfolios have established clear patterns for what works and what fails.

The recommended stack is **React 19 + Vite 7 + TypeScript + GSAP + Tailwind CSS 4**. React provides the component model and ecosystem; Vite provides fast, zero-overhead builds for a single-page app (Next.js and Astro are unnecessary for this scope); GSAP is the industry standard for timeline-based animation orchestration; and Tailwind CSS 4 with CSS custom properties enables per-project color theming without runtime CSS-in-JS overhead.

The critical architectural insight is the separation between GSAP (imperative timeline orchestration for slide transitions, parallax, color morphing) and Motion/Framer Motion (declarative React-aware micro-interactions for hover states and presence animations). Trying to use one library for both creates friction. The slider itself should be custom-built with GSAP rather than using a pre-built carousel library (Swiper, Embla), because the transition choreography IS the product -- a pre-built carousel's animation model would fight against the level of control needed.

The most dangerous pitfalls are: GSAP memory leaks in React (solved by using @gsap/react's useGSAP hook), CSS transitions fighting GSAP animations (solved by removing CSS transitions from GSAP-animated elements), mobile performance degradation from excessive parallax layers, and the "demo reel trap" where animation polish eclipses project content. All are preventable with known patterns established during foundation.

## Key Findings

**Stack:** React 19 + Vite 7 + TypeScript 5.9 + GSAP 3.14 + Tailwind CSS 4.2 + Zustand 5 + Lenis 1.3 + Motion 12.35
**Architecture:** Custom GSAP-driven slider with CSS custom property theming, layered parallax via CSS transforms (no WebGL), Zustand for slide state
**Critical pitfall:** GSAP memory leaks in React -- use @gsap/react's useGSAP() hook exclusively, never raw useEffect for GSAP code

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation** - Project scaffolding, data model, CSS custom property system, base layout
   - Addresses: Project data types, theme variable system, responsive skeleton
   - Avoids: Late-stage architecture changes; establishes compositor-only animation rule early

2. **Core Slider** - Custom GSAP carousel with index management, keyboard/touch navigation
   - Addresses: Primary interaction model, gesture handling, accessible carousel structure
   - Avoids: Pre-built carousel lock-in; scroll hijacking trap

3. **Theme Engine** - Per-project color palette transitions via CSS custom properties + GSAP
   - Addresses: Dynamic color morphing, background atmosphere, brand mood per project
   - Avoids: Theme flash pitfall; establishes cross-fade pattern before content integration

4. **Animation Layer** - Slide transition timelines, entrance choreography, staggered reveals
   - Addresses: Cinematic transitions, text animations, element-level sequencing
   - Avoids: Animation-before-content trap (content structure from Phase 2 is stable)

5. **Depth & Parallax** - Mouse-driven perspective shift, layered depth, ambient effects
   - Addresses: 3D-enhanced 2D visual depth, cursor-reactive elements
   - Avoids: Mobile performance issues (parallax complexity added after base works)

6. **Polish & Performance** - Lazy loading, reduced motion support, mobile optimization, all 12+ projects
   - Addresses: Production readiness, accessibility, performance budgets
   - Avoids: "Works on my machine" trap; ensures cross-device quality

**Phase ordering rationale:**
- Data model before slider (can't render slides without data)
- Slider before themes (theme transitions trigger on slide change)
- Themes before animation layer (animations are themed)
- Depth/parallax last among features (enhancement layer on stable base)
- Polish last (need full picture to optimize)

**Research flags for phases:**
- Phase 3 (Theme Engine): May need deeper research on Tailwind CSS 4's `@theme` directive and `@property` registered CSS custom properties for animatable color interpolation
- Phase 4 (Animation Layer): GSAP timeline patterns are well-documented; unlikely to need additional research
- Phase 5 (Depth & Parallax): Standard CSS transform patterns; may need research on mobile GPU performance limits

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry. Library roles well-established in the ecosystem. |
| Features | MEDIUM | Feature landscape based on training data patterns for agency portfolios. No live web verification of 2026 trends available. |
| Architecture | HIGH | Component composition, CSS custom property theming, GSAP timeline patterns are thoroughly documented and battle-tested. |
| Pitfalls | HIGH | Animation performance pitfalls, carousel UX traps, and React+GSAP integration issues are well-established across years of practice. |

## Gaps to Address

- **Tailwind CSS 4 specifics**: v4 uses CSS-first config (`@theme` directive) instead of JS config. Exact patterns for dynamic theming with `@theme` should be verified against current Tailwind v4 docs during Phase 1.
- **GSAP CSS custom property animation syntax**: Confirmed GSAP can animate CSS custom properties, but exact syntax for color interpolation (hex vs HSL) should be tested in Phase 3 spike.
- **Motion (Framer Motion) API stability**: Package was renamed from `framer-motion` to `motion`. Import paths and API surface may have changed -- verify during Phase 1 setup.
- **Lenis + GSAP ScrollTrigger integration**: Documented pattern exists but should be validated with current versions during Phase 2.
- **Mobile performance baselines**: No substitute for real-device testing. Phase 5 should include a testing matrix with specific Android/iOS devices.

---
*Research summary for: Hargile Portfolio Showcase*
*Researched: 2026-03-05*
