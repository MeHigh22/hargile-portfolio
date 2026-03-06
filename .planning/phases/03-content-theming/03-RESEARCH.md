# Phase 3: Content & Theming - Research

**Researched:** 2026-03-06
**Domain:** Content layout, CSS custom property animation, GSAP timeline orchestration
**Confidence:** HIGH

## Summary

Phase 3 transforms 12 identical-looking project slides into individually branded experiences. The work divides into four distinct areas: (1) restructuring the Slide component from its current full-bleed-background layout into a desktop split-screen / mobile overlay layout with problem/solution/outcome narrative, (2) defining unique color palettes per project and animating CSS custom properties via GSAP during transitions, (3) adding a fixed floating contact CTA that adapts to the current theme, and (4) building staggered GSAP timeline animations for both initial page load and per-slide transitions.

All four areas use technologies already in the project stack (GSAP, Tailwind CSS 4, CSS custom properties, Zustand). The primary complexity is the color morphing system, which bridges two existing interfaces (ProjectColors with 4 tokens, ThemePalette with 8 tokens) and requires GSAP to tween CSS variables with hex color interpolation. GSAP handles hex/rgb interpolation natively when tweening CSS custom properties via its CSSPlugin, so no additional color libraries are needed.

**Primary recommendation:** Expand ProjectColors to include all 8 ThemePalette tokens per project, add a color-derivation utility for the derived tokens, tween CSS custom properties directly with GSAP in the existing animateTransition timeline, and restructure Slide.tsx to support both desktop split and mobile overlay layouts via Tailwind responsive classes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Desktop: left content / right hero split-screen layout (text on left, large hero image on right)
- Mobile (< 768px): fall back to full-bleed hero background with content overlay and gradient scrim
- Narrative structured as three distinct labeled sections: Problem / Solution / Outcome (each 1-2 sentences)
- Metadata displayed as pill/chip tags (industry, tech items, year) using accent color
- Full atmosphere shift per project -- accent, background, gradients, and text tones all change
- Each project defines 3-4 core colors (accent, background, 1-2 brand colors); bgElevated, bgCard, textSecondary are derived algorithmically
- Color morph happens simultaneously with GSAP slide transition (during, not after)
- Morph duration matches slide transition: 0.8s with power3.inOut easing
- GSAP tweens CSS custom properties for smooth interpolation
- Fixed floating CTA button, bottom-right corner, visible on every slide
- Opens mailto: link (no modal, no extra section)
- Button text: "Travaillons ensemble" (French)
- Hover effect: subtle scale-up + soft glow matching current project's accent color
- CTA button color adapts to current project theme via CSS custom properties
- Cinematic reveal feel: 150-200ms stagger between elements
- Applied on BOTH initial page load AND every slide-to-slide transition
- Stagger order (top-down): category label -> title -> narrative -> metadata tags
- Hero image: subtle scale (105% -> 100%) + fade-in concurrent with text stagger
- Elements fade up and slide in (translateY + opacity)
- Uses GSAP timeline coordinated with existing slide transition
- Content in French throughout

### Claude's Discretion
- Exact spacing and typography within the split layout
- Derived color algorithm (e.g., lighten/darken ratios for bgElevated, bgCard)
- Exact easing curves for element-level staggers
- Loading/error states for hero images
- CTA button exact size and corner radius

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Each project displays a high-quality hero visual (screenshot/mockup) | Split layout pattern with responsive hero image. Current heroImg URLs exist in project data. Desktop: right panel hero. Mobile: full-bleed background with overlay. |
| CONT-02 | Each project shows a brief "what we solved" narrative (problem, solution, outcome) | Extend ProjectData with problem/solution/outcome fields. Render as three labeled sections in left panel. |
| CONT-03 | Each project displays metadata tags (industry, tech stack, year) | Add industry field to ProjectData. Parse tech string into array for pill tags. Render as accent-colored chips. |
| CONT-04 | User can reach a contact CTA to inquire about working with Hargile | Fixed floating button in AppShell (outside Slider). mailto: link. Theme-reactive via CSS custom properties. |
| VIS-01 | Page color palette morphs dynamically per project during navigation | Expand ProjectColors -> full ThemePalette per project. GSAP tweens 8 CSS custom properties during animateTransition timeline. |
| VIS-02 | Page loads with smooth, staggered entry animations | GSAP timeline with 150-200ms stagger on initial load + per-slide transition. Elements: category -> title -> narrative -> metadata. Hero: scale + fade. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.x | Animation engine for color morphing, stagger timelines, slide transitions | Already in project; handles CSS custom property tweening with built-in color interpolation |
| @gsap/react | 2.1.x | useGSAP hook for React-safe GSAP usage | Already in project; required pattern for all GSAP in this codebase |
| Tailwind CSS 4 | 4.2.x | Responsive layout (split-screen vs overlay), pill tags, spacing | Already in project; @theme tokens integrate with CSS custom properties |
| Zustand | 5.0.x | Slider state, currentIndex subscription for theme reactivity | Already in project; CTA and theme system subscribe to currentIndex |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.x | Conditional class composition | Already in devDeps; use for responsive/conditional class logic in Slide |
| tailwind-merge | 3.5.x | Merge Tailwind classes without conflicts | Already in devDeps; use when building reusable components with class overrides |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP color tween | chroma-js / color manipulation lib | GSAP already handles hex interpolation natively; adding a library is unnecessary |
| CSS custom properties | CSS-in-JS (styled-components) | Project decision: CSS custom properties only, no runtime CSS-in-JS |
| Manual color derivation | Tailwind oklch() | Tailwind 4 supports oklch but project uses hex throughout; keep consistent |

**Installation:**
```bash
# No new dependencies needed -- all libraries already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  data/
    types.ts            # Extend ProjectColors, add narrative fields to ProjectData
    projects.ts         # Unique colors + narrative content per project
  theme/
    theme-utils.ts      # Expand with deriveTheme(), morphTheme() utilities
    color-utils.ts      # NEW: color derivation (lighten/darken for bgElevated, bgCard, textSecondary)
  components/
    slider/
      Slide.tsx         # Restructure: split layout desktop, overlay mobile
      Slider.tsx        # Extend animateTransition with color morph + content stagger
    layout/
      AppShell.tsx      # Add ContactCTA as child
      ContactCTA.tsx    # NEW: fixed floating mailto button
  hooks/
    useThemeMorph.ts    # NEW (optional): encapsulate color morph logic if Slider.tsx gets too large
```

### Pattern 1: GSAP CSS Custom Property Tweening
**What:** GSAP can tween CSS custom properties on `:root` directly, including hex color interpolation.
**When to use:** Color morph during slide transitions.
**Example:**
```typescript
// GSAP tweens CSS custom properties with color interpolation
// Add to existing animateTransition timeline in Slider.tsx
tl.to(document.documentElement, {
  '--color-accent': nextProject.colors.accent,
  '--color-bg': nextProject.colors.bg,
  '--color-bg-elevated': nextProject.colors.bgElevated,
  '--color-bg-card': nextProject.colors.bgCard,
  '--color-text': nextProject.colors.text,
  '--color-text-secondary': nextProject.colors.textSecondary,
  '--color-coral': nextProject.colors.coral,
  '--color-lavender': nextProject.colors.lavender,
  duration: 0.8,
  ease: 'power3.inOut',
}, '<'); // concurrent with slide movement
```

### Pattern 2: Staggered Content Reveal Timeline
**What:** GSAP timeline with staggered fromTo animations for content elements.
**When to use:** Initial page load and every slide-to-slide transition.
**Example:**
```typescript
// Content reveal timeline (runs after/during slide-in)
const revealTl = gsap.timeline();

// Use data attributes to target elements within the active slide
const slideEl = document.querySelector(`[data-index="${newIndex}"]`);

revealTl
  .fromTo(slideEl.querySelector('[data-anim="category"]'),
    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
  .fromTo(slideEl.querySelector('[data-anim="title"]'),
    { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
  .fromTo(slideEl.querySelector('[data-anim="narrative"]'),
    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.30')
  .fromTo(slideEl.querySelector('[data-anim="tags"]'),
    { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25')
  .fromTo(slideEl.querySelector('[data-anim="hero"]'),
    { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0);
```

### Pattern 3: Color Derivation from Core Colors
**What:** Derive bgElevated, bgCard, textSecondary algorithmically from accent + background.
**When to use:** Per-project color definition. Define 3-4 core colors; derive the rest.
**Example:**
```typescript
// color-utils.ts
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

export function deriveTheme(core: { accent: string; background: string; gradientFrom: string; gradientTo: string }): ThemePalette {
  const [r, g, b] = hexToRgb(core.background);
  return {
    accent: core.accent,
    bg: core.background,
    bgElevated: lighten(core.background, 0.05),    // subtle lift
    bgCard: lighten(core.background, 0.08),          // card surface
    text: lighten(core.background, 0.92),            // near-white relative to bg
    textSecondary: `rgba(${lighten(core.background, 0.92).slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(',')},0.55)`,
    coral: core.gradientFrom,
    lavender: core.gradientTo,
  };
}
```

### Pattern 4: Responsive Split Layout
**What:** CSS Grid or Flexbox split with Tailwind responsive classes.
**When to use:** Slide component desktop vs mobile layout.
**Example:**
```tsx
{/* Desktop: grid two columns. Mobile: stacked with overlay */}
<div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
  {/* Left: content panel */}
  <div className="relative z-10 flex flex-col justify-center px-8 md:px-16
                  bg-gradient-to-t from-bg/90 via-bg/70 to-transparent
                  md:bg-none md:from-transparent">
    {/* content elements with data-anim attributes */}
  </div>
  {/* Right: hero image */}
  <div className="absolute inset-0 md:relative md:inset-auto">
    <img src={project.heroImg} className="h-full w-full object-cover" loading="lazy" />
  </div>
</div>
```

### Anti-Patterns to Avoid
- **Tweening React state for colors:** Do NOT store color values in React state and re-render on every animation frame. Tween CSS custom properties on the DOM directly via GSAP.
- **Separate color transition after slide completes:** User locked decision: color morph must happen DURING slide transition (concurrent), not after. Use `'<'` position in GSAP timeline.
- **Using useEffect for GSAP animations:** Always use `useGSAP` hook per project conventions. Raw useEffect does not handle GSAP cleanup properly.
- **Hardcoding all 8 theme tokens per project:** Define only 3-4 core colors per project and derive the rest. Reduces maintenance for 12 projects.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hex color interpolation | Custom lerp between hex values | GSAP CSS property tween | GSAP handles color interpolation natively when tweening CSS custom properties |
| Responsive breakpoint logic | Manual window.matchMedia listeners | Tailwind responsive classes (md:) | Tailwind 4 handles this declaratively; breakpoint md=768px already configured |
| Animation cleanup on unmount | Manual gsap.killTweensOf | useGSAP hook scope/cleanup | @gsap/react handles cleanup automatically within scope |
| Complex easing functions | Custom cubic-bezier math | GSAP named easings (power2.out, power3.inOut) | Built-in GSAP easings are optimized and well-tested |
| Color accessibility contrast | Manual WCAG contrast ratio calc | Derive light text from dark bg (lighten 90%+) | For dark-bg portfolio, white-ish text on dark bg always passes; derive conservatively |

**Key insight:** GSAP is already the animation engine and it handles CSS custom property color tweening natively. No additional animation or color library is needed.

## Common Pitfalls

### Pitfall 1: GSAP Won't Interpolate CSS Custom Properties as Colors
**What goes wrong:** If CSS custom properties are set as strings, GSAP might not recognize them as colors for interpolation.
**Why it happens:** GSAP needs the property to resolve to a color value. Custom properties set via `style.setProperty` as hex strings are tweened correctly by GSAP's CSSPlugin.
**How to avoid:** Always use hex format (#rrggbb) for color properties being tweened. Do NOT use named colors or hsl() format for tween targets. GSAP recognizes hex and rgb() for interpolation.
**Warning signs:** Colors jumping instead of smoothly transitioning.

### Pitfall 2: Stagger Animation Targeting Wrong Slide Elements
**What goes wrong:** `gsap.to('.category')` targets ALL slides' category labels, not just the incoming slide.
**Why it happens:** All 12 slides are in the DOM simultaneously (current architecture).
**How to avoid:** Scope selectors to the specific slide using `data-index` attribute: `[data-index="${newIndex}"] [data-anim="category"]`. Or use GSAP's scoping with a container ref.
**Warning signs:** Elements on hidden slides animating; flickering content on non-active slides.

### Pitfall 3: Color Morph Flash on Initial Load
**What goes wrong:** Page loads with default theme colors, then flashes to first project's colors.
**Why it happens:** CSS custom properties in @theme use hardcoded defaults; project-specific colors only apply after JS initializes.
**How to avoid:** Set the first project's colors as the @theme defaults in index.css, OR run applyTheme synchronously in the initial useGSAP setup (before first paint).
**Warning signs:** Brief flash of blue accent before project's actual accent appears.

### Pitfall 4: Entry Animation Replays When Returning to a Visited Slide
**What goes wrong:** Returning to slide 0 from slide 1 re-triggers the full stagger sequence even though it was already shown.
**Why it happens:** Animation logic runs on every slide change.
**How to avoid:** This is actually the desired behavior per user decision ("Applied on BOTH initial page load AND every slide-to-slide transition"). Each slide transition is a "mini-reveal." Ensure outgoing slide elements are reset (opacity: 0, y offset) so the reveal animation has a clean starting state.
**Warning signs:** Elements already visible before animation starts (not reset from previous view).

### Pitfall 5: CTA Button Z-Index Conflicts
**What goes wrong:** CTA button appears behind slide content or gets clipped by slider overflow:hidden.
**Why it happens:** Slider container has `overflow-hidden` and slides use `absolute inset-0 z-10`.
**How to avoid:** Place CTA in AppShell (outside Slider component entirely) with z-50. It sits alongside Navigation in the persistent UI layer.
**Warning signs:** Button disappearing during transitions or being unclickable.

### Pitfall 6: textSecondary with rgba() Breaks GSAP Color Tween
**What goes wrong:** GSAP cannot interpolate between rgba() strings stored as CSS custom properties.
**Why it happens:** textSecondary is currently `rgba(237,242,252,0.55)` -- GSAP can tween rgba, but the custom property value must be recognizable as a color.
**How to avoid:** Two options: (a) Use hex with alpha (#edf2fc8c) or (b) tween a separate opacity custom property. Recommendation: Use hex8 format or tween the base color and apply opacity via Tailwind's opacity modifier.
**Warning signs:** textSecondary jumping instead of morphing, or not changing at all.

## Code Examples

### Extending ProjectData Type
```typescript
// src/data/types.ts
export interface ProjectNarrative {
  problem: string;
  solution: string;
  outcome: string;
}

export interface ProjectColors {
  accent: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface ProjectData {
  id: string;
  title1: string;
  title2: string;
  category: string;
  year: string;
  subtitle: string;
  client: string;
  services: string;
  duration: string;
  tech: string;
  heroImg: string;
  colors: ProjectColors;
  industry: string;           // NEW for CONT-03 tags
  narrative: ProjectNarrative; // NEW for CONT-02
}
```

### Example Unique Project Colors
```typescript
// Each project gets unique core colors; derived tokens computed at build-time or init
{
  id: 'atlas',
  colors: {
    accent: '#96b8f7',    // Cool blue
    background: '#06080d',
    gradientFrom: '#96b8f7',
    gradientTo: '#b896f7',
  },
  // ...
},
{
  id: 'verde',
  colors: {
    accent: '#4ade80',    // Green for eco marketplace
    background: '#061a0d',
    gradientFrom: '#4ade80',
    gradientTo: '#22d3ee',
  },
  // ...
},
{
  id: 'aura',
  colors: {
    accent: '#f7a896',    // Warm coral for perfumery
    background: '#0d0806',
    gradientFrom: '#f7a896',
    gradientTo: '#f796d3',
  },
  // ...
},
```

### Contact CTA Component
```tsx
// src/components/layout/ContactCTA.tsx
import { useSliderStore } from '../../store/useSliderStore';

export function ContactCTA() {
  return (
    <a
      href="mailto:contact@hargile.com"
      className="fixed bottom-8 right-8 z-50
                 rounded-full bg-accent px-6 py-3
                 font-display text-sm font-semibold text-bg
                 shadow-lg shadow-accent/20
                 transition-transform hover:scale-105
                 hover:shadow-xl hover:shadow-accent/30"
    >
      Travaillons ensemble
    </a>
  );
}
```

### Color Morph Integration in animateTransition
```typescript
// In Slider.tsx animateTransition function, add color tween to existing timeline
const nextColors = deriveTheme(projects[newIndex].colors);

tl.to(document.documentElement, {
  '--color-accent': nextColors.accent,
  '--color-bg': nextColors.bg,
  '--color-bg-elevated': nextColors.bgElevated,
  '--color-bg-card': nextColors.bgCard,
  '--color-text': nextColors.text,
  '--color-text-secondary': nextColors.textSecondary,
  '--color-coral': nextColors.coral,
  '--color-lavender': nextColors.lavender,
  duration: 0.8,
  ease: 'power3.inOut',
}, '<'); // concurrent with slide movement
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS transitions on class swap | GSAP tween CSS custom properties | GSAP 3.x (2019+) | Smooth multi-property color interpolation without class-based state |
| JavaScript color libraries (tinycolor, chroma-js) | GSAP native color interpolation | GSAP 3.x | No extra dependency for animation-time color tweening |
| Tailwind CSS 3 extend + JIT | Tailwind CSS 4 @theme tokens | 2024 | Native CSS custom property integration, no config.js needed |
| framer-motion layout animations | GSAP timeline orchestration | Project decision | Consistent with existing GSAP-only pattern in codebase |

**Deprecated/outdated:**
- `applyTheme()` instant swap pattern: Currently sets properties instantly. Will be replaced by GSAP tween for smooth morphing. Keep function for initial load, but transitions use GSAP.
- Navigation theme toggle: The current light/dark toggle in Navigation.tsx will likely be removed or reworked since per-project theming replaces the manual toggle.

## Open Questions

1. **textSecondary rgba() format for GSAP tweening**
   - What we know: Current textSecondary uses `rgba(r,g,b,0.55)` format. GSAP can tween rgba values.
   - What's unclear: Whether GSAP correctly interpolates rgba CSS custom property strings across different alpha values per project.
   - Recommendation: Test with a simple prototype. If problematic, switch to hex8 format (`#rrggbbaa`) or separate the alpha into its own custom property.

2. **Navigation component theme toggle fate**
   - What we know: Navigation currently has a manual light/dark theme toggle that calls `applyTheme()`.
   - What's unclear: Whether to remove it entirely or keep it as a secondary override.
   - Recommendation: Remove the toggle -- per-project color morphing replaces it. The HARGILE wordmark and nav bar styling will adapt via CSS custom properties automatically.

3. **Hero image loading for off-screen slides**
   - What we know: All 12 slides are mounted in DOM. Each has a background-image or img tag.
   - What's unclear: Whether all 12 hero images load eagerly or if browser lazy-loads them.
   - Recommendation: Use `loading="lazy"` on img tags. For the first 2-3 slides, use `loading="eager"` or preload to avoid visible loading on initial navigation.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.x + @testing-library/react 16.x |
| Config file | vite.config.ts (test section inline) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Slide renders hero image with correct src | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "hero"` | No - Wave 0 |
| CONT-02 | Slide renders problem/solution/outcome sections | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "narrative"` | No - Wave 0 |
| CONT-03 | Slide renders industry, tech, year as pill tags | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "tags"` | No - Wave 0 |
| CONT-04 | ContactCTA renders mailto link with correct text | unit | `npx vitest run src/components/layout/__tests__/ContactCTA.test.tsx` | No - Wave 0 |
| VIS-01 | deriveTheme produces valid ThemePalette from core colors | unit | `npx vitest run src/theme/__tests__/color-utils.test.ts` | No - Wave 0 |
| VIS-02 | Stagger animation config values are correct | manual-only | Manual visual verification -- GSAP timeline execution requires browser | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/slider/__tests__/Slide.test.tsx` -- covers CONT-01, CONT-02, CONT-03
- [ ] `src/components/layout/__tests__/ContactCTA.test.tsx` -- covers CONT-04
- [ ] `src/theme/__tests__/color-utils.test.ts` -- covers VIS-01 (deriveTheme)
- [ ] All 12 projects in projects.ts need unique colors and narrative content (data, not tests)

## Sources

### Primary (HIGH confidence)
- Codebase analysis: src/components/slider/Slider.tsx, Slide.tsx, theme-utils.ts, useSliderStore.ts, types.ts, projects.ts, AppShell.tsx, Navigation.tsx, index.css
- GSAP CSS custom property tweening: verified by existing project usage of GSAP + CSS custom properties pattern

### Secondary (MEDIUM confidence)
- GSAP color interpolation behavior with CSS custom properties: consistent with GSAP 3.x documented behavior (CSSPlugin handles hex/rgb interpolation)
- Tailwind CSS 4 @theme token override pattern: verified by existing index.css @theme block in codebase

### Tertiary (LOW confidence)
- GSAP rgba() string interpolation on CSS custom properties: needs validation (see Open Questions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and in use
- Architecture: HIGH - extends existing patterns (GSAP timeline, CSS custom properties, Zustand)
- Pitfalls: HIGH - derived from actual codebase analysis (scoping issues, z-index, rgba format)
- Color derivation: MEDIUM - algorithm is straightforward but exact lighten/darken ratios need visual tuning

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable stack, no fast-moving dependencies)
