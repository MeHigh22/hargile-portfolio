# Stack Research

**Domain:** Scrollable case studies with animated timelines, metrics/charts, scroll-triggered animations, and deliverables galleries — added to existing GSAP + React 19 portfolio
**Researched:** 2026-03-11
**Confidence:** HIGH (versions verified via npm registry 2026-03-11, GSAP free-plugin status verified via official announcements)

---

## Context: What Already Exists (Do Not Re-Add)

| Already in Project | Version | Status |
|--------------------|---------|--------|
| React | ^19.2.4 | In package.json |
| Vite | ^7.3.1 | In package.json |
| TypeScript | ^5.9.3 | In package.json |
| Tailwind CSS | ^4.2.1 | In package.json |
| GSAP | ^3.14.2 | In package.json |
| @gsap/react | ^2.1.2 | In package.json |
| Zustand | ^5.0.11 | In package.json |
| clsx / tailwind-merge | latest | In package.json |

Note: Lenis appears in the prior STACK.md recommendation but is not yet installed. It is addressed below.

---

## New Additions for Case Studies Milestone

### Scroll Infrastructure

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| lenis | ^1.3.18 | Smooth scroll host for case study pages | Lenis syncs its scroll position with GSAP ScrollTrigger via the ScrollTrigger.scrollerProxy API. Provides buttery scroll feel without fighting ScrollTrigger's position tracking. Preferred over GSAP ScrollSmoother because Lenis preserves native DOM layout — no wrapper div requirements — making it compatible with Tailwind's layout classes and the existing AppShell architecture. (MEDIUM confidence on exact version — verify: `npm view lenis version`) |

No additional install needed for ScrollTrigger or SplitText — they ship inside the `gsap` package already installed. Just register the plugins.

### Charts

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| recharts | ^3.8.0 | Simple bar and line charts in metrics sections | Declarative React SVG components. No imperative chart instance to fight GSAP over. Theming via CSS custom properties that align with the existing per-project color system. Recharts 3.x dropped legacy D3 coupling for tree-shakable imports. For a portfolio showing 2-3 simple metrics charts per project, the bundle cost (~160KB minified, ~50KB gzipped) is justified by zero custom SVG authoring. |

### Gallery Lightbox

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| yet-another-react-lightbox | ^3.29.1 | Full-screen image viewer for deliverables gallery | React 19 compatible. Plugin architecture means only the features you import are bundled — base is ~40KB gzipped. Keyboard, touchscreen, and mouse navigation built in. TypeScript definitions included. Zero external dependencies. Actively maintained (22-day-old publish as of 2026-03-11). Avoids building a custom modal/lightbox that would need its own scroll-lock, focus-trap, and animation logic. |

---

## Zero-Dependency Additions (Use What's Already Installed)

These capabilities require NO new packages — they exist within the already-installed GSAP.

### Animated Counters

Use GSAP's native tween on a plain object, triggered by ScrollTrigger:

```typescript
// No library needed. Pattern:
const obj = { value: 0 };
gsap.to(obj, {
  value: 94,
  duration: 2,
  ease: "power2.out",
  scrollTrigger: { trigger: counterEl, start: "top 80%" },
  onUpdate: () => {
    counterEl.textContent = Math.round(obj.value) + "%";
  },
});
```

This is the standard GSAP community pattern. No counter library (CountUp.js, etc.) needed — adding one would duplicate functionality GSAP already provides.

### Section Reveals (Fade Up, Stagger)

Use GSAP ScrollTrigger with `gsap.from()` or `gsap.fromTo()`. ScrollTrigger ships inside the `gsap` package — register it once at app entry:

```typescript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

Pattern for staggered card reveals:
```typescript
gsap.from(".deliverable-card", {
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: { trigger: ".deliverables-grid", start: "top 75%" },
});
```

### Text Reveals (SplitText)

SplitText is now free as of 2025 (Webflow acquisition of GreenSock made all GSAP plugins free). Ships in the `gsap` package. Use for case study section headings:

```typescript
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const split = new SplitText(headingEl, { type: "lines" });
gsap.from(split.lines, {
  yPercent: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: { trigger: headingEl, start: "top 80%" },
});
```

### Process Timeline

The animated timeline (discovery → design → dev → launch) is a layout + scroll animation problem, not a library problem. Build with:
- Tailwind CSS for layout (vertical line, step dots, step content)
- GSAP ScrollTrigger to animate each step into view as user scrolls
- No dedicated timeline library needed

---

## Installation

```bash
# Smooth scroll (not yet installed, needed for case study scroll behavior)
npm install lenis

# Metrics charts
npm install recharts

# Deliverables gallery lightbox
npm install yet-another-react-lightbox
```

Everything else (ScrollTrigger, SplitText, counter animations, section reveals) comes from the already-installed `gsap` package.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| GSAP ScrollTrigger (built-in) | Intersection Observer API | When you have no GSAP dependency and want zero overhead. This project already has GSAP — adding IntersectionObserver for reveals would be redundant. |
| GSAP native counter tween | CountUp.js | When you have no animation library and want minimal setup. With GSAP already installed, CountUp.js adds ~5KB for functionality GSAP provides for free. |
| Recharts | Chart.js + react-chartjs-2 | When you need Canvas rendering for mobile performance, or when you need 10+ chart types. For 2-3 simple bar/line charts, Recharts' React-native SVG is simpler to theme with CSS custom properties. |
| Recharts | Visx (airbnb) | When you need maximum customization and have D3 expertise. Visx is lower-level and requires more authoring time — overkill for portfolio metrics display. |
| yet-another-react-lightbox | PhotoSwipe + React wrapper | When you need extremely minimal JS and a pure DOM approach. PhotoSwipe's React integration is less maintained. YARL has better TypeScript support and React 19 compatibility. |
| yet-another-react-lightbox | lightGallery | When you need video support, social sharing, and comment features. lightGallery is heavier and designed for content platforms, not portfolio showcases. |
| Lenis | GSAP ScrollSmoother | When your entire site is GSAP-only and you can accept ScrollSmoother's required `#smooth-wrapper`/`#smooth-content` DOM structure. The existing AppShell architecture makes Lenis the lower-friction choice. |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| CountUp.js | Duplicates GSAP `gsap.to()` counter tween functionality already in the project. Adds ~5KB for zero gain. | GSAP native tween on plain object |
| react-spring / motion (for scroll reveals) | GSAP ScrollTrigger is already handling orchestrated animation. Adding a second animation system for scroll reveals creates conflicting animation managers and makes cleanup unpredictable. | GSAP ScrollTrigger consistently |
| AOS (Animate On Scroll) | CSS-class-based approach — cannot integrate with GSAP timelines or per-project color morphing. Designed for simple sites without existing animation infrastructure. | GSAP ScrollTrigger |
| D3.js directly | D3 is what Recharts is built on. Using D3 raw for simple bar/line charts requires 10x more authoring effort than Recharts declarative components. | Recharts |
| Swiper for gallery grid | Swiper's opinionated DOM structure conflicts with GSAP-driven reveal animations on the gallery grid. | Custom CSS Grid + GSAP ScrollTrigger reveals + YARL for lightbox |
| React Router | The case study view is a panel/overlay within the single-page app, not a separate route. Adding routing forces URL management, scroll restoration complexity, and back-button handling that the panel approach avoids entirely. | Zustand state (`activeCaseStudy: string | null`) + CSS/GSAP transition |

---

## Integration Notes for Existing Architecture

### Lenis + ScrollTrigger Integration

Lenis requires ScrollTrigger to use its scroll position as the source of truth. Standard pattern:

```typescript
// In case study component or root layout
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Recharts + CSS Custom Properties

Recharts accepts `stroke` and `fill` as props. Pass CSS custom property values from the per-project theme:

```tsx
<Bar dataKey="value" fill="var(--color-accent)" />
```

The color morph system (GSAP animating CSS custom properties) will automatically update chart colors when the active project theme changes.

### YARL (lightbox) + GSAP Gallery Reveals

YARL opens as a portal overlay — it does not interfere with GSAP's ScrollTrigger instances on the gallery grid. The grid items animate in via ScrollTrigger; clicking a thumbnail opens YARL. No conflicts.

### ScrollTrigger Cleanup in React

With the existing `useEffect`-based GSAP pattern (no `useGSAP` hook per project memory), always return a cleanup:

```typescript
useEffect(() => {
  const triggers: ScrollTrigger[] = [];
  // ... create triggers, push to array
  return () => triggers.forEach(t => t.kill());
}, []);
```

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| recharts ^3.8.0 | React ^19.2.4 | Recharts 3.x added React 18/19 compatibility. Verify peer deps on install. |
| yet-another-react-lightbox ^3.29.1 | React ^19.2.4 | Explicitly supports React 16.8+, 17, 18, 19. |
| lenis ^1.3.18 | GSAP ^3.14.2, ScrollTrigger | Standard integration pattern is stable and well-documented in GSAP community forums. |
| gsap/SplitText (built-in) | @gsap/react ^2.1.2 | SplitText must be re-run after text re-renders. Use `onSplit` callback or run inside `useLayoutEffect` after DOM settles. |

---

## Sources

- GSAP plugins now free: https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/ (MEDIUM — Codrops editorial, corroborated by GSAP community forum discussions)
- GSAP ScrollTrigger official docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (HIGH)
- GSAP React integration: https://gsap.com/resources/React/ (HIGH)
- Lenis vs ScrollSmoother: https://zuncreative.com/en/blog/smooth_scroll_meditation/ (MEDIUM — third-party editorial)
- YARL version 3.29.1: npm registry, last published 2026-02-17 (HIGH)
- Recharts version 3.8.0: npm registry, 3,714 dependent projects (HIGH)
- Recharts 3.x migration: https://github.com/recharts/recharts/wiki/3.0-migration-guide (HIGH)
- Bundle sizes: Recharts ~160KB min / ~50KB gzip per Bundlephobia historical data; YARL ~40KB gzip per library docs (LOW confidence on exact current sizes — verify before committing to build budget)

---

*Stack research for: Case studies milestone — scroll-triggered animations, charts, timeline, gallery additions to existing GSAP + React 19 portfolio*
*Researched: 2026-03-11*
