# Phase 3: Content & Theming - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Each project tells its story through rich content panels while the page atmosphere transforms to match each project's identity. Delivers: hero visuals (CONT-01), problem/solution/outcome narratives (CONT-02), metadata tags (CONT-03), contact CTA (CONT-04), per-project color palette morphing (VIS-01), and staggered entry animations (VIS-02). 3D parallax depth effects are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Content panel layout
- Desktop: left content / right hero split-screen layout (text on left, large hero image on right)
- Mobile (< 768px): fall back to full-bleed hero background with content overlay and gradient scrim
- Narrative structured as three distinct labeled sections: Problem / Solution / Outcome (each 1-2 sentences)
- Metadata displayed as pill/chip tags (industry, tech items, year) using accent color
- Builds on existing Slide.tsx which already has left-aligned text structure

### Color palette morphing
- Full atmosphere shift per project — accent, background, gradients, and text tones all change
- Each project defines 3-4 core colors (accent, background, 1-2 brand colors); bgElevated, bgCard, textSecondary are derived algorithmically for consistent contrast
- Color morph happens simultaneously with GSAP slide transition (during, not after)
- Morph duration matches slide transition: 0.8s with power3.inOut easing
- GSAP tweens CSS custom properties for smooth interpolation
- Bridges existing ThemePalette (8 tokens) with ProjectColors (currently 4) — expand ProjectColors or add derivation layer

### Contact CTA
- Fixed floating button, bottom-right corner, visible on every slide
- Opens mailto: link (no modal, no extra section)
- Button text: "Travaillons ensemble" (French, matches existing project descriptions)
- Hover effect: subtle scale-up + soft glow matching current project's accent color
- Button color adapts to current project theme via CSS custom properties

### Entry animations
- Cinematic reveal feel: 150-200ms stagger between elements
- Applied on BOTH initial page load AND every slide-to-slide transition (each slide is a mini-reveal)
- Stagger order (top-down): category label -> title -> narrative -> metadata tags
- Hero image: subtle scale (105% -> 100%) + fade-in concurrent with text stagger
- Elements fade up and slide in (translateY + opacity)
- Uses GSAP timeline coordinated with existing slide transition

### Claude's Discretion
- Exact spacing and typography within the split layout
- Derived color algorithm (e.g., lighten/darken ratios for bgElevated, bgCard)
- Exact easing curves for element-level staggers
- Loading/error states for hero images
- CTA button exact size and corner radius

</decisions>

<specifics>
## Specific Ideas

- Content in French throughout (project descriptions already in French)
- "Travaillons ensemble" as CTA text — personal, inviting tone
- Split layout on desktop, overlay on mobile — responsive without tiny split panels
- Every slide transition should feel like entering a new branded environment
- Cinematic pacing, not rushed — the showcase itself demonstrates Hargile's craft

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Slide.tsx`: Already renders title, category, year, subtitle, client/services/tech — needs restructuring for split layout and richer content
- `theme-utils.ts`: `applyTheme()` sets 8 CSS custom properties on `:root` — extend for GSAP tween-based morphing
- `ThemePalette` interface: 8 tokens (accent, bg, bgElevated, bgCard, text, textSecondary, coral, lavender)
- `ProjectColors` interface: 4 tokens (accent, background, gradientFrom, gradientTo) — all 12 projects currently use identical `defaultColors`
- `ProjectCard.tsx`: Alternative card layout component (unused in slider flow, could inform tag styling)

### Established Patterns
- GSAP + `@gsap/react` `useGSAP` hook for all animations (never raw useEffect)
- Zustand store (`useSliderStore`) for slider state with `isAnimating` lock
- CSS custom properties via Tailwind CSS 4 `@theme` tokens with runtime overrides
- `power3.inOut` easing on 0.8s slide transitions

### Integration Points
- `Slider.tsx` `animateTransition()`: Color morph timeline should integrate here (parallel GSAP tween)
- `projects.ts` data: Each project's `colors` object needs unique values (currently all defaultColors)
- `AppShell.tsx` / `Navigation.tsx`: CTA button lives outside slider, in persistent UI layer
- `useSliderStore`: May need `currentProject` selector for CTA accent color reactivity

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-content-theming*
*Context gathered: 2026-03-06*
