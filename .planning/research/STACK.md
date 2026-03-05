# Stack Research

**Domain:** Immersive animated portfolio showcase with 3D-enhanced 2D effects
**Researched:** 2026-03-05
**Confidence:** HIGH (all versions verified via npm registry 2026-03-05)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | ^19.2.4 | UI framework | Component model ideal for composing per-project slides with independent animation behavior. Largest ecosystem for animation libraries (GSAP, Motion). Team expressed interest in moving from plain HTML to a framework -- React has the deepest animation tooling support. |
| Vite | ^7.3.1 | Build tool + dev server | Fastest DX for a single-page app. No SSR/SSG overhead (unnecessary for a standalone showcase). Hot module replacement keeps animation iteration tight. Zero-config React+TS setup. |
| TypeScript | ^5.9.3 | Type safety | Per-project theme configs, animation parameters, and slide data models benefit from compile-time validation. Catches misconfigured color palettes before runtime. |
| Tailwind CSS | ^4.2.1 | Utility-first CSS | Rapid styling with CSS-first configuration (v4's `@theme` directive). CSS custom properties work naturally for per-project color theming. The `@tailwindcss/vite` plugin integrates directly with Vite. |

### Animation & Effects

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| GSAP | ^3.14.2 | Primary animation engine | Industry standard for timeline-based, sequenced animations. ScrollTrigger for scroll-driven effects. Unmatched control for choreographed slide transitions (exit old slide, morph colors, enter new slide). Can animate CSS custom properties directly for color theme transitions. Free for non-gated websites (this portfolio qualifies). |
| @gsap/react | ^2.1.2 | React integration | Official `useGSAP()` hook -- drop-in replacement for useEffect that auto-cleans GSAP tweens and timelines on unmount. Prevents the most common React+GSAP bug (memory leaks from orphaned animations). |
| motion | ^12.35.0 | Declarative micro-animations | For simple hover/tap states, `AnimatePresence` mount/unmount transitions, and layout animations. Complements GSAP: use GSAP for orchestrated timelines, Motion for React-aware declarative state transitions. Package was renamed from `framer-motion` to `motion`. |
| Lenis | ^1.3.18 | Smooth scrolling | Lightweight smooth scroll that integrates with GSAP ScrollTrigger. Creates the premium "buttery" scroll feel. Actively maintained successor to the locomotive-scroll philosophy. |

### State Management

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Zustand | ^5.0.11 | Lightweight global state | Manages current slide index, active color theme, and transition lock state. Works outside the React tree (callable from GSAP timeline callbacks). No provider wrapping. Minimal boilerplate. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | latest | Conditional class names | When Tailwind utility classes need conditional logic |
| tailwind-merge | latest | Merge conflicting Tailwind classes | When composing component style variants |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| @vitejs/plugin-react | React Fast Refresh in Vite | SWC-based for speed |
| ESLint | Code quality | Standard React/TS config |
| Prettier | Code formatting | Consistent style |

## Why NOT Next.js

This is a **single standalone page** with no routing, no server-side rendering needs, and no SEO-critical text content (it is a visual showcase). Next.js adds a routing system, server components, middleware, and build complexity that provide zero value here. Vite gives faster builds, simpler mental model, and no framework fighting the animation-heavy single-page architecture.

If the site later evolves into a multi-page site with blog/SEO needs, Next.js becomes the right choice. For the current scope, it is pure overhead.

## Why NOT Astro

Astro excels at content-heavy, mostly-static sites with islands of interactivity. This project is the opposite -- a single page that is almost entirely interactive JavaScript (orchestrated animations, parallax, color transitions). Astro's island architecture would fight against the full-page animation orchestration where every element participates in coordinated timelines.

## Why NOT Three.js / React Three Fiber

PROJECT.md explicitly scopes out full 3D environments. The "3D-enhanced 2D" effect (parallax, depth, perspective) is achievable with CSS transforms (`perspective`, `rotateX/Y`, `translateZ`) orchestrated by GSAP. WebGL adds massive bundle size (~500KB+), complex setup, mobile performance concerns, and accessibility challenges -- all for an effect that CSS transforms achieve at 10% of the complexity.

## Installation

```bash
# Create project
npm create vite@latest hargile-showcase -- --template react-ts

# Primary animation engine
npm install gsap @gsap/react

# Declarative micro-animations
npm install motion

# Smooth scroll
npm install lenis

# Styling
npm install tailwindcss @tailwindcss/vite

# State management
npm install zustand

# Utilities
npm install clsx tailwind-merge
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| React + Vite | Next.js 16 | When you need SSR, routing, SEO for content-heavy pages |
| React + Vite | Astro | When building a content-heavy site with minimal JS interactivity |
| GSAP | anime.js | Simpler projects without timeline orchestration needs |
| GSAP + Motion combo | Motion only | When all animations are declarative state transitions (no timelines) |
| Custom GSAP slider | Swiper 12 | Standard carousel without deep animation integration |
| Custom GSAP slider | Embla Carousel 8 | Headless carousel when you don't need GSAP-level timeline control |
| Zustand | React Context | When state is simple and contained within one component tree |
| Tailwind CSS 4 | CSS Modules | When team prefers scoped CSS without utility classes |
| Lenis | locomotive-scroll | Do not -- locomotive-scroll is less maintained; Lenis is the actively maintained choice |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Three.js / R3F | Out of scope per PROJECT.md. CSS transforms achieve the "3D-enhanced 2D" goal without WebGL complexity, bundle bloat, or mobile perf issues. | GSAP with CSS 3D transforms (perspective, translateZ, rotateX/Y) |
| Swiper.js for main carousel | Swiper's DOM structure and animation model conflict with GSAP timeline-driven transitions. You fight the library instead of leveraging it. | Custom GSAP-driven slider (~100-150 lines of core logic) |
| jQuery | Dead weight. GSAP replaced jQuery animation over a decade ago. | GSAP |
| animate.css | Class-based animations lack timeline control and dynamic parameterization for per-project theming. | GSAP timelines |
| Locomotive Scroll | Maintenance has stalled. Lenis is actively maintained, lighter, and integrates better with GSAP ScrollTrigger. | Lenis |
| Redux / MobX | Massive overkill for tracking slide index and active theme. | Zustand |
| Styled Components / Emotion | Runtime CSS-in-JS adds bundle size and runtime cost. No advantage over Tailwind + CSS custom properties for this use case. | Tailwind CSS 4 with CSS custom properties |
| CSS-only animations for slide transitions | Cannot orchestrate multi-property, multi-element timelines with the precision needed for choreographed color morph + parallax transitions. | GSAP timelines |

## GSAP Licensing Note

GSAP is free for websites that don't gate content behind a paywall. A portfolio showcase qualifies for the "No Charge" license. Core plugins (ScrollTrigger, Draggable, Flip) are included free. Proprietary plugins (MorphSVG, DrawSVG, SplitText) require a paid Club membership -- none are required for this project, though SplitText would be a nice-to-have for text reveal animations.

## Key Architecture Decision: GSAP Primary, Motion Secondary

**Use GSAP for:**
- Slide transition timelines (coordinated multi-element choreography)
- Per-project color theme morphing (animating CSS custom properties)
- Parallax depth effects
- Complex entry/exit sequences
- Any animation requiring precise timing control

**Use Motion for:**
- Hover/tap micro-interactions on buttons and cards
- `AnimatePresence` for mount/unmount transitions
- Layout animations when elements reflow
- Simple spring-based interactions

This avoids the common pitfall of making one library do everything. GSAP excels at timeline orchestration; Motion excels at declarative React-aware state transitions. They complement each other cleanly.

## Sources

- npm registry: all versions verified 2026-03-05 via `npm view [package] version`
- GSAP licensing: https://gsap.com/pricing/ (No Charge license for non-gated sites)
- @gsap/react package description confirmed via npm: "Tools for using GSAP in React, like useGSAP()"
- Architecture patterns based on training data knowledge of GSAP, React, Vite ecosystems (MEDIUM confidence on specific API patterns, HIGH confidence on library purposes and roles)

---
*Stack research for: Immersive animated portfolio showcase with 3D-enhanced 2D effects*
*Researched: 2026-03-05*
