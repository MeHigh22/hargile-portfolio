# Phase 4: Depth & Production Quality - Research

**Researched:** 2026-03-10
**Domain:** GSAP parallax animation, CSS accessibility media queries, image optimization, Vite bundle splitting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Parallax depth feel:**
- Hero image only — no parallax on text panel or background elements
- Subtle intensity: ~10-15px max shift (Linear/Stripe level — noticeable but not distracting)
- Desktop/laptop mouse movement only — no mobile device tilt (gyroscope)
- Hero image scaled to ~105% to hide edges revealed by parallax shift
- Parallax pauses during slide transitions, resumes when new slide settles (avoids competing motions and GPU contention)

**Performance & asset strategy:**
- WebP as primary image format with JPG fallback via `<picture>` element
- Responsive srcset at 3 breakpoints: ~640w, ~1280w, ~1920w (aligns with 768px layout breakpoint)
- Lazy loading: keep native `loading="lazy"` for distant slides + preload adjacent slide images (next/prev) when a slide becomes active
- Full performance audit scope: images, fonts (font-display: swap, preloading, subsetting), CSS, and JS bundle splitting
- Images are the primary optimization target, but fonts and bundle also in scope

**Reduced motion fallback (prefers-reduced-motion):**
- Slide transitions: replace sliding + staggered reveal with gentle opacity crossfade (~0.3s)
- Parallax: disabled entirely
- Content reveal stagger: skip — all content appears immediately (no translateY motion)
- Color morphing: keep — color transitions are atmosphere shifts, not spatial motion (WCAG safe)
- Page load animation: same reduced-motion rules apply (no special exception for initial load)
- Consistent behavior everywhere — if motion is reduced, it's reduced globally

**Transition polish:**
- Keep current 0.8s duration with power3.inOut easing (established in Phase 3, all stagger timings tuned to it)
- Proactive will-change: add `will-change: transform` on parallax elements and active slides; remove on inactive slides to save memory
- CTA button: keep current scale+glow hover (no additional micro-interactions — magnetic pull is v2 ANIM-03)
- Grain overlay: keep as-is at opacity 0.012 — negligible GPU cost, not worth device detection

### Claude's Discretion
- Exact parallax easing curve and lerp/smoothing approach
- Image compression quality levels per breakpoint
- Font subsetting character ranges
- Bundle splitting strategy (code splitting boundaries)
- will-change lifecycle management details
- Crossfade timing fine-tuning for reduced motion mode

### Deferred Ideas (OUT OF SCOPE)
- Rich project storytelling: expanded content panels with timelines, detailed "what was done" sections, and discovery flows for diving deeper into each project — future phase (content expansion)
- Magnetic cursor pull on CTA button — v2 requirement ANIM-03
- Per-project mood-driven entry animations — v2 requirement ANIM-01
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIS-03 | Project visuals have 3D-enhanced parallax depth responding to mouse movement | GSAP quickTo for mouse tracking, CSS scale(1.05) to hide edges, animatingRef pause pattern |
| PERF-03 | All transitions maintain 60fps with lazy-loaded assets | will-change lifecycle, GSAP ticker RAF synchronization, native loading="lazy" + adjacent preload |
| PERF-04 | Reduced motion fallback for accessibility (prefers-reduced-motion) | gsap.matchMedia() with reduceMotion condition, opacity crossfade fallback, parallax disable |
</phase_requirements>

---

## Summary

Phase 4 adds three independent but interlocking concerns: mouse-reactive parallax depth on hero images (VIS-03), 60fps performance with lazy-loaded assets (PERF-03), and full prefers-reduced-motion accessibility (PERF-04).

The parallax implementation fits naturally into the existing GSAP + plain useEffect/useCallback architecture. GSAP's `quickTo()` method is the correct tool — it is purpose-built for high-frequency property updates like mousemove and is significantly more efficient than repeated `gsap.to()` calls. Mouse events store raw coordinates; `gsap.ticker.add()` applies smoothed interpolation every frame. The parallax is scoped to the active slide's hero image element, targeted via `slideRefs`, and paused by checking `animatingRef.current` — the same lock already used in Phase 3.

The reduced-motion strategy uses `gsap.matchMedia()`, which is GSAP's official API for this exact use case. It accepts named conditions including `"(prefers-reduced-motion: reduce)"` and automatically reverts when conditions change. The existing `animateTransition()` function gets a branch: in reduced-motion mode, a simple 0.3s opacity crossfade replaces the xPercent slide + stagger reveal. Color morphing and content visibility are preserved in both paths.

Asset and font optimization targets the current setup where hero images are Unsplash URLs with inline query parameters and Google Fonts are loaded via CDN (inferred from the @theme font stack). The migration plan: convert hero URLs to local optimized WebP with `<picture>` + srcset, self-host fonts with `font-display: swap` and character subsetting, and add Vite `build.rollupOptions.output.manualChunks` to separate the GSAP vendor bundle.

**Primary recommendation:** Use `gsap.quickTo()` for parallax (not raw mousemove + GSAP.to), `gsap.matchMedia()` for reduced motion (not manual window.matchMedia checks), and `<picture>` + native lazy loading for images (no additional library needed).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.14.2 (already installed) | quickTo, ticker, matchMedia | Purpose-built for high-frequency animation; quickTo avoids per-frame tween overhead |
| Vite | ^7.3.1 (already installed) | Build + bundle splitting | manualChunks in rollupOptions splits GSAP into separate vendor chunk |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Native `<picture>` + `loading="lazy"` | Browser native | WebP with JPG fallback, native lazy loading | All hero images — zero library overhead |
| `@tailwindcss/vite` | ^4.2.1 (already installed) | CSS purging | Already handles unused CSS elimination |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gsap.quickTo() | gsap.to() on every mousemove | quickTo skips unit conversion per call — lower overhead for high-frequency updates |
| gsap.matchMedia() | window.matchMedia() + addEventListener | matchMedia auto-reverts on condition change; pairs with existing GSAP context |
| Native lazy loading | react-lazyload or lazysizes | Native loading="lazy" already in use (index > 1) — no added dependency needed |
| Self-hosted fonts | Google Fonts CDN | Self-hosted eliminates third-party network dependency and allows font-display: swap + subsetting |

**Installation:** No new runtime dependencies required. All tools are in the existing stack.

---

## Architecture Patterns

### Recommended Project Structure (additions for Phase 4)

```
src/
├── hooks/
│   ├── useParallax.ts       # NEW: mouse tracking + quickTo animation for active slide hero
│   └── useReducedMotion.ts  # NEW: gsap.matchMedia wrapper, exposes isReduced boolean
├── components/
│   └── slider/
│       └── Slide.tsx        # MODIFY: img -> <picture> + srcset + data-parallax ref
│       └── Slider.tsx       # MODIFY: pass heroRef to useParallax, branch animateTransition
├── index.css                # MODIFY: add @font-face with font-display: swap, hero img scale
└── index.html               # MODIFY: add <link rel="preload"> for critical fonts
vite.config.ts               # MODIFY: add build.rollupOptions.output.manualChunks
```

### Pattern 1: Parallax with gsap.quickTo + gsap.ticker

**What:** Track mouse position on the container; use quickTo for x/y on the hero image; apply smoothing via quickTo's built-in duration/easing; pause when animatingRef is true.

**When to use:** Any high-frequency property update from mouse/pointer events. quickTo is 2-3x cheaper per call than gsap.to() for repeated single-property updates.

```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.quickTo()
// useParallax.ts

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MAX_SHIFT = 12; // px — within 10-15px user constraint

export function useParallax(
  containerRef: React.RefObject<HTMLDivElement>,
  getHeroEl: () => HTMLElement | null,
  isAnimatingRef: React.RefObject<boolean>
) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const quickXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // quickTo: duration is the smoothing lag, not a fixed time
    // Each mousemove call restarts the tween toward the new target
    const setupQuickTo = () => {
      const hero = getHeroEl();
      if (!hero) return;
      quickXRef.current = gsap.quickTo(hero, 'x', { duration: 0.6, ease: 'power2.out' });
      quickYRef.current = gsap.quickTo(hero, 'y', { duration: 0.6, ease: 'power2.out' });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isAnimatingRef.current) return; // pause during transitions
      const rect = container.getBoundingClientRect();
      // Normalize to -1..1 range from center
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    // Ticker applies the stored mouse position each frame
    const onTick = () => {
      if (isAnimatingRef.current) return;
      quickXRef.current?.(mouseRef.current.x * MAX_SHIFT);
      quickYRef.current?.(mouseRef.current.y * MAX_SHIFT);
    };

    setupQuickTo();
    container.addEventListener('mousemove', onMouseMove);
    gsap.ticker.add(onTick);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(onTick);
      // Reset hero position on unmount
      const hero = getHeroEl();
      if (hero) gsap.set(hero, { x: 0, y: 0 });
    };
  }, [containerRef, getHeroEl, isAnimatingRef]);

  // Re-initialize quickTo when the active slide changes (new hero element)
  return { reinitialize: () => { /* call setupQuickTo() after transition completes */ } };
}
```

**Key insight on pause/resume:** The `animatingRef.current` check in both `onMouseMove` and `onTick` achieves the pause-during-transition requirement. After transition completes (`animateTransition`'s `onComplete`), the ticker resumes naturally since the ref is cleared to `false`.

**Key insight on scale:** The hero element needs `transform: scale(1.05)` as a CSS baseline (not React style prop — same GSAP+React pattern from Phase 2 memory). Apply via Tailwind class `scale-[1.05]` in `Slide.tsx` on the hero container div, not the img directly.

### Pattern 2: gsap.matchMedia for Reduced Motion

**What:** Declare named media query conditions once; GSAP automatically inverts/reverts when conditions change. The `reduceMotion` boolean controls which animation path executes.

**When to use:** Any code that runs GSAP animations — both the parallax hook and the transition function branch on this same value.

```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
// useReducedMotion.ts

import { useEffect, useState } from 'react';
import gsap from 'gsap';

export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      setIsReduced(true);
      return () => setIsReduced(false); // revert callback
    });
    return () => mm.revert();
  }, []);

  return isReduced;
}
```

**Alternative: inline branch in animateTransition**

For the transition function specifically, the `context.conditions` pattern is cleaner:

```typescript
// Inside animateTransition — reduced motion branch
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
const mm = gsap.matchMedia();
mm.add({ reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
  const { reduceMotion } = ctx.conditions!;

  if (reduceMotion) {
    // Crossfade only: no xPercent, no stagger, ~0.3s
    gsap.set(nextEl, { opacity: 0, xPercent: 0 });
    gsap.set(contentEls, { opacity: 1, y: 0 }); // content visible immediately
    const tl = gsap.timeline({ onComplete: () => { /* ... */ } });
    tl.to(prevEl, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
    tl.to(nextEl, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, '<');
    tl.to(document.documentElement, { /* color morph vars */ duration: 0.3 }, '<');
  } else {
    // Full animation (existing Phase 3 code)
  }
});
```

**Note:** The gsap.matchMedia() check should be evaluated once (e.g., at module level or in a ref) rather than creating a new MatchMedia on every transition call. A singleton pattern using a module-level variable is cleaner.

### Pattern 3: Hero Image as `<picture>` with srcset

**What:** Replace the single `<img>` with a `<picture>` element providing WebP at 3 sizes + JPG fallback. The `loading` attribute goes on the `<img>` fallback tag — this is what the browser honors.

```tsx
// Source: https://web.dev/articles/preload-responsive-images
// Slide.tsx hero section

<div data-anim="hero" className="absolute inset-0 md:relative md:inset-auto -z-0 md:z-0">
  <picture>
    {/* WebP: preferred by all modern browsers */}
    <source
      type="image/webp"
      srcSet={`${project.heroImgWebp640} 640w, ${project.heroImgWebp1280} 1280w, ${project.heroImgWebp1920} 1920w`}
      sizes="(max-width: 768px) 100vw, 55vw"
    />
    {/* JPG fallback */}
    <source
      type="image/jpeg"
      srcSet={`${project.heroImg640} 640w, ${project.heroImg1280} 1280w, ${project.heroImg1920} 1920w`}
      sizes="(max-width: 768px) 100vw, 55vw"
    />
    <img
      ref={heroImgRef}  // ref for parallax targeting
      src={project.heroImg}  // fallback for very old browsers
      alt={`${project.title1} ${project.title2}`}
      loading={imgLoading}
      className="h-full w-full object-cover scale-[1.05]"
      data-parallax  // marker for parallax hook to find
    />
  </picture>
</div>
```

**Note on current images:** Hero images are currently Unsplash URLs. For this phase, the decision is to convert to local optimized assets. The `ProjectData` type in `types.ts` needs new fields for srcset URLs, OR the picture/srcset can be derived from a single base URL pattern if images are stored locally with naming conventions.

### Pattern 4: Adjacent Image Preloading

**What:** When a slide becomes active, preload the hero images of the next and previous slides using `new Image()` or `<link rel="preload">`.

```typescript
// In animateTransition onComplete callback
function preloadAdjacentImages(currentIndex: number, projects: ProjectData[]) {
  [-1, 1].forEach((offset) => {
    const adjIndex = currentIndex + offset;
    if (adjIndex < 0 || adjIndex >= projects.length) return;
    const img = new Image();
    img.src = projects[adjIndex].heroImg; // browser caches on fetch
  });
}
```

### Pattern 5: will-change Lifecycle Management

**What:** Add `will-change: transform` before animation begins on active slide + hero; remove on inactive slides after transition to avoid GPU memory overconsumption.

```typescript
// In animateTransition — before timeline starts
gsap.set(nextEl, { willChange: 'transform' });
gsap.set(nextEl.querySelector('[data-parallax]'), { willChange: 'transform' });

// In animateTransition onComplete
gsap.set(prevEl, { willChange: 'auto' });
// Keep nextEl (now active) with will-change for parallax
```

**Rule:** Never set `will-change` on all slides at once. MDN recommends only on elements about to animate and immediately removing after. In this project: active slide + its hero img = 2 elements max at a time.

### Anti-Patterns to Avoid

- **Calling gsap.to() on mousemove directly:** Creates a new tween on every mouse event (60+ per second). Use `quickTo()` instead — it updates the existing tween target.
- **Using React style prop for hero transform scale:** React re-renders overwrite inline styles, competing with GSAP. Use Tailwind class for the baseline scale, GSAP for the parallax x/y offsets.
- **Setting will-change on all slides at mount:** Promotes every slide to its own GPU layer simultaneously, consuming significant VRAM for 12+ slides.
- **Using window.matchMedia directly instead of gsap.matchMedia():** Loses auto-revert on context change and doesn't integrate with GSAP's cleanup lifecycle.
- **Applying parallax to both hero image and text panel:** Out of scope per locked decisions. Parallax on text would fight with the slide transition xPercent movement.
- **Initializing quickTo without a valid DOM element:** quickTo must be called after the element exists. Re-initialize in `animateTransition`'s `onComplete` when the active slide changes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-frame mouse animation loop | Manual RAF + lerp function | gsap.quickTo() + gsap.ticker | quickTo handles lerp internally via duration/ease; ticker is already running |
| Reduced motion detection | window.matchMedia + custom event listener | gsap.matchMedia() | Handles cleanup, auto-revert, and integrates with GSAP context |
| Image format negotiation | Custom JS format detection | `<picture>` element with `<source type="image/webp">` | Browser handles format negotiation natively |
| Responsive image selection | Custom JS viewport detection | HTML srcset + sizes attributes | Browser picks optimal source including DPR consideration |
| Font loading optimization | Custom font loader JS | `font-display: swap` in @font-face + `<link rel="preload">` | Browser-native, zero JS overhead |

**Key insight:** Every "hand-roll" in this domain has browser-native or GSAP-native equivalents that handle edge cases (DPR for srcset, system preference changes for matchMedia) that custom implementations miss.

---

## Common Pitfalls

### Pitfall 1: quickTo element stale reference after slide transition

**What goes wrong:** `quickTo()` is initialized against the hero element of the first active slide. When the slide changes, the quickTo functions still target the old (now hidden) element.

**Why it happens:** quickTo captures a DOM reference at creation time. When `prevEl` is hidden (display: none), GSAP animations on it still execute silently.

**How to avoid:** Re-create quickTo refs in `animateTransition`'s `onComplete` callback, pointing to the new active slide's hero element. Use a `heroRef` pattern: `Slide` forwards a second ref (or exposes a `getHeroEl()` getter) so the parallax hook can re-target.

**Warning signs:** Parallax appears to stop responding after the first navigation, or responds on the wrong (hidden) slide.

### Pitfall 2: Reduced motion check at module load vs at runtime

**What goes wrong:** Checking `window.matchMedia('prefers-reduced-motion')` once at module load captures the system state at import time. OS preference changes during the session won't be reflected.

**Why it happens:** Media query results are point-in-time unless you add a `change` listener (or use gsap.matchMedia which does this automatically).

**How to avoid:** Use `gsap.matchMedia()` — it subscribes to the media query and re-runs when the condition changes. For the `useReducedMotion` hook, the `mm.add()` callback fires immediately and again on change.

### Pitfall 3: Parallax fighting slide transition on navigation

**What goes wrong:** If the ticker is not properly gated by `animatingRef`, mouse movement during a transition causes the hero image to jump or jitter as both xPercent (transition) and x (parallax) animate simultaneously.

**Why it happens:** GSAP can animate multiple transforms concurrently, but xPercent + x on the same element can interfere with each other depending on transform composition.

**How to avoid:** Check `isAnimatingRef.current` in BOTH the mousemove handler (to skip storing new mouse coordinates) and the ticker callback (to skip applying quickTo calls). Reset parallax x/y to 0 in `animateTransition`'s setup before the new slide enters.

### Pitfall 4: picture element + loading="lazy" — attribute placement

**What goes wrong:** Placing `loading="lazy"` on a `<source>` element instead of the `<img>` fallback. Browsers only honor `loading` on `<img>`, not `<source>`.

**Why it happens:** Natural confusion between where format hints (`<source>`) and loading behavior (`<img>`) are declared.

**How to avoid:** Always put `loading`, `width`, `height`, `alt`, and `src` on the `<img>` fallback. The `<source>` elements only carry `type`, `srcSet`, and `sizes`.

### Pitfall 5: will-change overuse degrading performance

**What goes wrong:** Setting `will-change: transform` on all 12+ slides at mount time to "be safe." This creates 12+ GPU compositor layers simultaneously, consuming VRAM and potentially slowing page scrolling on lower-end devices.

**Why it happens:** Attempting to be proactive about performance backfires when applied too broadly.

**How to avoid:** Only the active slide and its hero image get `will-change: transform`. Apply in `animateTransition` before the timeline starts; remove from the outgoing slide in `onComplete`.

### Pitfall 6: gsap.matchMedia context recreated on every render/call

**What goes wrong:** Creating `gsap.matchMedia()` inside a function that runs frequently (e.g., inside `animateTransition`) creates multiple independent MatchMedia instances, each subscribing to media query changes — memory leak.

**Why it happens:** gsap.matchMedia() is designed to be created once, not per animation call.

**How to avoid:** Create a single gsap.matchMedia instance at module level or in a stable ref initialized once in `useEffect`. Export a singleton or use a module-level variable.

---

## Code Examples

Verified patterns from official sources:

### quickTo for mouse parallax
```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.quickTo()
const xTo = gsap.quickTo(heroEl, 'x', { duration: 0.6, ease: 'power2.out' });
const yTo = gsap.quickTo(heroEl, 'y', { duration: 0.6, ease: 'power2.out' });

// On every tick (NOT directly on mousemove):
gsap.ticker.add(() => {
  if (isAnimatingRef.current) return;
  xTo(normalizedX * MAX_SHIFT);
  yTo(normalizedY * MAX_SHIFT);
});
```

### gsap.matchMedia reduced motion
```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
const mm = gsap.matchMedia(); // create once at module level

mm.add({ reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
  const { reduceMotion } = ctx.conditions!;
  if (reduceMotion) {
    // crossfade path
  } else {
    // full animation path
  }
  // return cleanup function if needed
});
```

### picture element with WebP + srcset
```tsx
// Source: https://web.dev/articles/preload-responsive-images (MEDIUM confidence)
<picture>
  <source type="image/webp" srcSet="img-640.webp 640w, img-1280.webp 1280w, img-1920.webp 1920w" sizes="(max-width: 768px) 100vw, 55vw" />
  <source type="image/jpeg" srcSet="img-640.jpg 640w, img-1280.jpg 1280w, img-1920.jpg 1920w" sizes="(max-width: 768px) 100vw, 55vw" />
  <img src="img-1280.jpg" alt="..." loading="lazy" className="h-full w-full object-cover scale-[1.05]" />
</picture>
```

### Vite manualChunks for GSAP vendor splitting
```typescript
// Source: Vite official docs (MEDIUM confidence)
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
```

### matchMedia mock for Vitest tests
```typescript
// Source: https://rebeccamdeprey.com/blog/mock-windowmatchmedia-in-vitest
// test-setup.ts addition
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // override per-test with vi.mocked(window.matchMedia).mockReturnValue(...)
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| gsap.to() on every mousemove | gsap.quickTo() | GSAP 3.x | Major performance win for high-frequency updates |
| ScrollTrigger.matchMedia() | gsap.matchMedia() | GSAP 3.9+ | Standalone, not tied to ScrollTrigger |
| Manual RAF loop for smoothing | gsap.ticker.add() | GSAP 3.x | Synced with GSAP's internal timer, avoids double RAF |
| img srcset only | picture + source type + srcset | HTML living standard | Browser picks format AND size |
| @font-face without display | font-display: swap | CSS Fonts Level 4 | Prevents FOIT (flash of invisible text) |

**Deprecated/outdated:**
- `ScrollTrigger.matchMedia()`: Replaced by `gsap.matchMedia()` — does not require ScrollTrigger plugin.
- Inline `window.matchMedia('prefers-reduced-motion').matches` without a change listener: misses runtime OS preference updates.

---

## Open Questions

1. **Hero images are currently Unsplash URLs — no local assets exist**
   - What we know: `projects.ts` uses `https://images.unsplash.com/...?w=1600&h=900&fit=crop&q=85` URLs. Unsplash does support query-param based sizing (w=, q=) and format (fm=webp).
   - What's unclear: Will the plan use real local image assets, or adapt Unsplash URLs for srcset? Local assets are production-correct but require actual images. Unsplash URL manipulation works for demo purposes.
   - Recommendation: For Phase 4 planning, design the `<picture>` implementation to work with local assets in `public/images/`. The data type change (adding srcset fields to `ProjectData`) is the same either way. Use Unsplash URL manipulation as a fallback for now if real assets are not ready.

2. **Font loading: Google Fonts CDN vs self-hosted**
   - What we know: `index.css` declares `--font-sans: 'Inter'`, `--font-display: 'Space Grotesk'`, `--font-mono: 'JetBrains Mono'`. There is no `<link>` to Google Fonts visible in the code read — unclear if fonts are loaded via a link in `index.html` or if they fall back to system fonts.
   - What's unclear: Whether `index.html` has Google Fonts import links (not read yet).
   - Recommendation: Read `index.html` at plan time. If Google Fonts CDN: migrate to self-hosted with `@font-face` + `font-display: swap` and add `<link rel="preload">` in `index.html` for the 2-3 most critical font files.

3. **Parallax quickTo reinit on slide change**
   - What we know: The parallax hook targets a specific DOM element (the active slide's hero `<img>`). The active slide changes on navigation.
   - What's unclear: The cleanest integration point for re-targeting quickTo — whether to expose a method from the hook, use a ref callback, or integrate directly into `animateTransition`'s `onComplete`.
   - Recommendation: Pass `activeIndex` as a dep to the parallax hook so it re-initializes quickTo when the slide changes. The hook reads `slideRefs.current[activeIndex].querySelector('[data-parallax]')`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| Config file | `vite.config.ts` (test.globals, test.environment: jsdom, setupFiles: src/test-setup.ts) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIS-03 | Slide's hero img has `data-parallax` attribute | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs new assertion) |
| VIS-03 | Hero img has `scale-[1.05]` class applied | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs new assertion) |
| VIS-03 | `useParallax` hook registers/removes ticker and mousemove listener | unit | `npx vitest run src/hooks/__tests__/useParallax.test.ts` | ❌ Wave 0 |
| PERF-03 | Slide `<picture>` element rendered with WebP source | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs new assertion) |
| PERF-03 | `loading="lazy"` still applied on index >= 2 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (already passes, will need update for picture element) |
| PERF-04 | Reduced motion: `useReducedMotion` returns correct boolean from matchMedia | unit | `npx vitest run src/hooks/__tests__/useReducedMotion.test.ts` | ❌ Wave 0 |
| PERF-04 | matchMedia mock established in test-setup | setup | N/A — test-setup.ts addition | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/hooks/__tests__/useParallax.test.ts` — covers VIS-03 hook behavior
- [ ] `src/hooks/__tests__/useReducedMotion.test.ts` — covers PERF-04 matchMedia detection
- [ ] `src/test-setup.ts` — add `window.matchMedia` mock (required for any test importing gsap.matchMedia or useReducedMotion)

---

## Sources

### Primary (HIGH confidence)
- `https://gsap.com/docs/v3/GSAP/gsap.quickTo()` — quickTo API, signature, mouse tracking pattern
- `https://gsap.com/docs/v3/GSAP/gsap.matchMedia()` — matchMedia API, reduceMotion pattern, conditions object
- `https://gsap.com/docs/v3/GSAP/gsap.ticker/` — ticker API, add/remove, RAF synchronization

### Secondary (MEDIUM confidence)
- `https://web.dev/articles/preload-responsive-images` — picture element, srcset, sizes, link rel=preload for responsive images
- `https://rebeccamdeprey.com/blog/mock-windowmatchmedia-in-vitest` — window.matchMedia mock pattern for Vitest/jsdom
- `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change` — will-change best practices, timing, lifecycle

### Tertiary (LOW confidence)
- `https://dev.to/tassiofront/splitting-vendor-chunk-with-vite-and-loading-them-async-15o3` — manualChunks pattern (verify against current Vite 7 docs at plan time)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — gsap.quickTo, gsap.matchMedia, gsap.ticker verified from official GSAP docs
- Architecture: HIGH — patterns match existing project conventions (useEffect, direct refs, animatingRef)
- Pitfalls: HIGH — stale quickTo ref and will-change overuse are well-documented; matchMedia singleton is inferred from GSAP docs
- Asset optimization: MEDIUM — picture/srcset/lazy pattern is browser-native standard; specific Vite manualChunks syntax for Vite 7 not verified (was Vite 3 docs in search)
- Test infrastructure: HIGH — existing vitest + testing-library setup confirmed; matchMedia mock pattern verified

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (GSAP docs stable; Vite config syntax should be re-verified at plan time for Vite 7 specifics)
