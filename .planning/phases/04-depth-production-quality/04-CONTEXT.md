# Phase 4: Depth & Production Quality - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

The showcase feels premium and polished — 3D depth effects respond to the cursor, animations never drop frames, and the experience degrades gracefully for all users. Delivers: mouse-reactive parallax depth on hero images (VIS-03), 60fps transitions with lazy-loaded assets (PERF-03), first contentful paint under 3s (PERF-02), and prefers-reduced-motion accessibility fallback (PERF-04).

</domain>

<decisions>
## Implementation Decisions

### Parallax depth feel
- Hero image only — no parallax on text panel or background elements
- Subtle intensity: ~10-15px max shift (Linear/Stripe level — noticeable but not distracting)
- Desktop/laptop mouse movement only — no mobile device tilt (gyroscope)
- Hero image scaled to ~105% to hide edges revealed by parallax shift
- Parallax pauses during slide transitions, resumes when new slide settles (avoids competing motions and GPU contention)

### Performance & asset strategy
- WebP as primary image format with JPG fallback via `<picture>` element
- Responsive srcset at 3 breakpoints: ~640w, ~1280w, ~1920w (aligns with 768px layout breakpoint)
- Lazy loading: keep native `loading="lazy"` for distant slides + preload adjacent slide images (next/prev) when a slide becomes active
- Full performance audit scope: images, fonts (font-display: swap, preloading, subsetting), CSS, and JS bundle splitting
- Images are the primary optimization target, but fonts and bundle also in scope

### Reduced motion fallback (prefers-reduced-motion)
- Slide transitions: replace sliding + staggered reveal with gentle opacity crossfade (~0.3s)
- Parallax: disabled entirely
- Content reveal stagger: skip — all content appears immediately (no translateY motion)
- Color morphing: keep — color transitions are atmosphere shifts, not spatial motion (WCAG safe)
- Page load animation: same reduced-motion rules apply (no special exception for initial load)
- Consistent behavior everywhere — if motion is reduced, it's reduced globally

### Transition polish
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

</decisions>

<specifics>
## Specific Ideas

- Parallax should feel like the hero image has physical depth — "you notice it, but it doesn't compete with content"
- Premium portfolio feel throughout: Stripe/Linear quality level
- Reduced motion users should still feel the per-project atmosphere via color morphing
- Performance must scale to 12+ projects without degradation

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Slider.tsx`: `animateTransition()` with GSAP timeline — parallax pause/resume hooks into `animatingRef`
- `Slide.tsx`: `forwardRef` with `data-anim` attributes and `loading="lazy"` already on index > 1
- `slideRefs.current[]`: Direct DOM refs for all slides — use for will-change management and adjacent preloading
- `color-utils.ts` + `theme-utils.ts`: `deriveTheme()` and `applyTheme()` for color morphing
- `useSliderStore`: `isAnimating` state — parallax can check this to pause during transitions

### Established Patterns
- GSAP + plain `useEffect`/`useCallback` (not useGSAP hook) for all animations
- Direct DOM refs, never string selectors for GSAP targeting
- CSS custom properties via Tailwind CSS 4 `@theme` with runtime overrides
- `power3.inOut` easing on 0.8s transitions
- `data-anim` attribute convention for GSAP element targeting

### Integration Points
- `Slider.tsx` `animateTransition()`: Parallax pause/resume integrates here
- `Slide.tsx` hero `<img>`: Convert to `<picture>` with WebP/srcset
- `AppShell.tsx`: Reduced motion media query detection at top level
- `index.css` / `@theme`: Font preloading and `font-display: swap` configuration
- `vite.config.ts`: Bundle splitting and asset optimization configuration

</code_context>

<deferred>
## Deferred Ideas

- Rich project storytelling: expanded content panels with timelines, detailed "what was done" sections, and discovery flows for diving deeper into each project — future phase (content expansion)
- Magnetic cursor pull on CTA button — v2 requirement ANIM-03
- Per-project mood-driven entry animations — v2 requirement ANIM-01

</deferred>

---

*Phase: 04-depth-production-quality*
*Context gathered: 2026-03-10*
