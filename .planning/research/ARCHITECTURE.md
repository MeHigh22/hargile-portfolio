# Architecture Research

**Domain:** Immersive portfolio showcase (single-page, animation-heavy, 12+ projects)
**Researched:** 2026-03-05
**Confidence:** HIGH (well-established patterns in award-winning portfolio sites)

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                        App Shell                                  |
|  (ThemeProvider, AnimationOrchestrator, LayoutContainer)          |
+------------------------------------------------------------------+
|                                                                    |
|  +-----------------------+    +-------------------------------+   |
|  |   Navigation Layer    |    |     Background/Atmosphere     |   |
|  |  - Project indicators |    |  - Gradient mesh              |   |
|  |  - Progress dots      |    |  - Grain overlay              |   |
|  |  - Brand mark         |    |  - Ambient particles          |   |
|  |  - CTA button         |    |  - Color theme transitions    |   |
|  +-----------------------+    +-------------------------------+   |
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                    Slider / Carousel Core                   |  |
|  |                                                              |  |
|  |  +------------------+  +------------------+  +----------+  |  |
|  |  |   ProjectSlide   |  |   ProjectSlide   |  |  Slide   |  |  |
|  |  |  +-----------+   |  |  +-----------+   |  |   N...   |  |  |
|  |  |  | HeroVisual|   |  |  | HeroVisual|   |  |          |  |  |
|  |  |  +-----------+   |  |  +-----------+   |  |          |  |  |
|  |  |  | StoryBlock|   |  |  | StoryBlock|   |  |          |  |  |
|  |  |  +-----------+   |  |  +-----------+   |  |          |  |  |
|  |  |  | TechStack |   |  |  | TechStack |   |  |          |  |  |
|  |  |  +-----------+   |  |  +-----------+   |  |          |  |  |
|  |  |  | ProjectCTA|   |  |  | ProjectCTA|   |  |          |  |  |
|  |  |  +-----------+   |  |  +-----------+   |  |          |  |  |
|  |  +------------------+  +------------------+  +----------+  |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                  Parallax / Depth Engine                     |  |
|  |  - Layer management (foreground, midground, background)      |  |
|  |  - Mouse-tracking transforms                                 |  |
|  |  - Scroll-linked animations                                  |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
|                     Project Data Layer                             |
|  (Static array/config -- no API, no CMS)                         |
+------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **App Shell** | Root layout, global providers, page-level orchestration | Single root component wrapping theme + animation context |
| **ThemeProvider** | Manages per-project color palette, transitions CSS custom properties | React Context or CSS custom property updates driven by active slide index |
| **AnimationOrchestrator** | Coordinates entrance/exit/transition timelines across components | GSAP timeline controller; ensures animations don't conflict or overlap |
| **Navigation Layer** | Persistent UI: brand, slide indicators, global CTA | Fixed-position overlay; z-indexed above slider; reacts to active index |
| **Background/Atmosphere** | Full-viewport ambient visuals: gradients, grain, particles | Canvas or CSS layers behind content; color-driven by ThemeProvider |
| **Slider Core** | Manages slide state, gesture/keyboard input, transition triggers | Horizontal or vertical slide container; emits index-change events |
| **ProjectSlide** | Renders one project's content; owns its entrance animation | Composition of HeroVisual + StoryBlock + TechStack + ProjectCTA |
| **HeroVisual** | Project screenshot/mockup with parallax depth layers | Image with layered transforms responding to mouse/scroll |
| **StoryBlock** | "What we solved" narrative text with staggered reveal | Headline + paragraph with GSAP SplitText or per-line reveal |
| **TechStack** | Technology badges/icons for the project | Horizontal list of icons with staggered fade-in |
| **ProjectCTA** | Per-project call-to-action (view site, case study) | Animated button with hover effects |
| **Parallax/Depth Engine** | Applies 3D-like depth transforms across layers | Mouse-move listener + requestAnimationFrame; applies translateX/Y/Z |
| **Project Data** | Static project definitions (title, colors, images, text) | TypeScript array or JSON file; no runtime fetching |

## Recommended Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Root: providers + layout
│   ├── main.tsx                   # Entry point
│   └── global.css                 # CSS reset, custom properties, base styles
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx         # Brand + indicators + CTA
│   │   └── Background.tsx         # Gradient mesh + grain + particles
│   │
│   ├── slider/
│   │   ├── SliderContainer.tsx    # Core slider logic + gestures
│   │   ├── ProjectSlide.tsx       # Single slide composition
│   │   ├── HeroVisual.tsx         # Project image with parallax layers
│   │   ├── StoryBlock.tsx         # Narrative text with reveals
│   │   ├── TechStack.tsx          # Tech badges
│   │   └── ProjectCTA.tsx         # Per-project action button
│   │
│   └── ui/
│       ├── ParallaxLayer.tsx      # Reusable depth-shifted wrapper
│       ├── AnimatedText.tsx       # Text with split/stagger animations
│       └── MagneticButton.tsx     # Button with magnetic hover effect
│
├── hooks/
│   ├── useMouseParallax.ts        # Mouse-tracking depth transforms
│   ├── useSlider.ts               # Slide state + gesture management
│   ├── useProjectTheme.ts         # Color transitions for active project
│   └── useAnimationTimeline.ts    # GSAP timeline creation + cleanup
│
├── data/
│   ├── projects.ts                # Project definitions (static array)
│   └── types.ts                   # ProjectData interface
│
├── theme/
│   ├── colors.ts                  # Per-project color palettes
│   └── ThemeProvider.tsx          # Context for dynamic theme switching
│
├── animations/
│   ├── transitions.ts             # Slide transition timelines
│   ├── entrances.ts               # Per-element entrance animations
│   └── config.ts                  # Duration/easing constants
│
└── utils/
    ├── lerp.ts                    # Linear interpolation for smooth values
    ├── clamp.ts                   # Value clamping
    └── prefersReducedMotion.ts    # Accessibility check
```

## Architectural Patterns

### Pattern 1: Composition Over Monolith

The slider is NOT one giant component. Each slide is a composition of independent sub-components (HeroVisual, StoryBlock, TechStack, ProjectCTA) that each own their own animation behavior. The SliderContainer only manages which slide is active and transition orchestration.

**Why:** When each sub-component owns its animations, you can change the StoryBlock reveal without touching HeroVisual parallax. You also avoid a 500-line "Slide" component.

```typescript
// ProjectSlide.tsx -- composition, not monolith
export function ProjectSlide({ project, isActive }: Props) {
  return (
    <div className="slide" data-active={isActive}>
      <HeroVisual
        image={project.heroImage}
        layers={project.parallaxLayers}
        isActive={isActive}
      />
      <StoryBlock
        headline={project.headline}
        description={project.description}
        isActive={isActive}
      />
      <TechStack techs={project.techStack} isActive={isActive} />
      <ProjectCTA href={project.url} isActive={isActive} />
    </div>
  );
}
```

### Pattern 2: Theme as CSS Custom Properties

Per-project color themes work best as CSS custom property updates rather than inline styles or styled-components theme objects. This lets every element in the tree respond to theme changes without prop drilling or re-renders.

**Why:** A single `document.documentElement.style.setProperty('--accent', newColor)` updates the entire page. GSAP can tween custom properties for smooth color transitions. Zero React re-renders for color changes.

```typescript
// ThemeProvider -- updates CSS custom properties, not React state
function applyTheme(project: ProjectData) {
  const root = document.documentElement;
  gsap.to(root, {
    '--accent': project.colors.accent,
    '--bg': project.colors.background,
    '--text': project.colors.text,
    duration: 0.8,
    ease: 'power2.inOut',
  });
}
```

### Pattern 3: Imperative Animation, Declarative Layout

React handles what is rendered (declarative DOM). GSAP handles how it moves (imperative animation). Do NOT try to drive complex animations through React state/re-renders -- this creates jank.

**Why:** GSAP operates outside React's render cycle, directly manipulating DOM properties at 60fps. React state updates cause reconciliation overhead that kills animation smoothness.

```typescript
// Hook pattern: GSAP ref, not React state
function useSlideEntrance(ref: RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline();
    if (isActive) {
      tl.fromTo(ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 });
    } else {
      tl.to(ref.current, { opacity: 0, y: -20, duration: 0.3 });
    }
    return () => { tl.kill(); };
  }, [isActive]);
}
```

### Pattern 4: Layered Depth System (3D-enhanced 2D)

Instead of actual 3D/WebGL, create perceived depth through multiple layers that move at different rates in response to mouse movement and scroll. Three layers minimum: background (slowest), midground, foreground (fastest).

**Why:** Achieves the 3D effect the project requires without the complexity and performance cost of Three.js/WebGL. Works on all devices. Degrades gracefully.

```typescript
// Depth layer configuration per project
interface ParallaxConfig {
  layers: {
    element: string;        // CSS selector or ref
    depth: number;          // 0 = background (no move), 1 = foreground (max move)
    maxOffset: number;      // Maximum pixel displacement
  }[];
}
```

### Pattern 5: Data-Driven Slides

All project content lives in a single typed data file. The component tree renders from this data. Adding a new project means adding one object to an array -- no new components, no new routes, no new files.

```typescript
// data/projects.ts
export interface ProjectData {
  id: string;
  title: string;
  headline: string;                    // "What we solved" one-liner
  description: string;                 // 2-3 sentence story
  heroImage: string;                   // Path to main visual
  parallaxLayers?: string[];           // Optional depth layer images
  techStack: string[];                 // Technology names
  url?: string;                        // External link
  colors: {
    accent: string;                    // Primary accent for this project
    background: string;                // Background tint
    text: string;                      // Text color
    gradientFrom: string;              // Gradient start
    gradientTo: string;                // Gradient end
  };
  mood: 'bold' | 'elegant' | 'playful' | 'technical';  // Drives entrance animation style
}

export const projects: ProjectData[] = [
  { id: 'project-1', title: '...', /* ... */ },
  // Add new projects here -- nothing else changes
];
```

## Data Flow

### Slide Navigation Flow

```
User Input (swipe/click/keyboard/scroll)
        |
        v
  SliderContainer (gesture handler)
        |
        v
  Active Index State (useState or ref)
        |
        +---> ThemeProvider.applyTheme(projects[newIndex])
        |         |
        |         v
        |     CSS Custom Properties updated (GSAP tween)
        |         |
        |         v
        |     Background, Navigation, all themed elements
        |     reactively update via CSS var() references
        |
        +---> AnimationOrchestrator
        |         |
        |         v
        |     1. Exit timeline for old slide (0.3s)
        |     2. Transition timeline (slide movement, 0.5s)
        |     3. Enter timeline for new slide (0.6s staggered)
        |
        +---> Navigation indicators update
        |
        +---> ProjectSlide[newIndex].isActive = true
                  |
                  v
              Sub-components trigger entrance animations
              (HeroVisual parallax reveal, StoryBlock text split,
               TechStack stagger, CTA slide-up)
```

### Mouse Parallax Flow

```
Mouse Move Event
        |
        v
  requestAnimationFrame throttle
        |
        v
  Calculate normalized position (-1 to 1) from viewport center
        |
        v
  For each parallax layer:
    offset = normalizedPos * layer.depth * layer.maxOffset
        |
        v
  Apply via CSS transform (translateX/Y) -- NO React re-render
  Use lerp() for smoothed following (0.05-0.1 factor)
```

### Theme Transition Flow

```
Active Index Changes
        |
        v
  Read projects[index].colors
        |
        v
  GSAP tween CSS custom properties on :root
  (--accent, --bg, --text, --gradient-from, --gradient-to)
        |
        v
  Duration: 0.6-0.8s, ease: power2.inOut
        |
        v
  Every element using var(--accent) etc. updates automatically
  Background gradients, text colors, borders, glows all shift
```

## Anti-Patterns

### Anti-Pattern 1: React State for Animation Values

**What:** Using `useState` or `useReducer` to track animation progress (opacity, x position, scale).

**Why bad:** Each state update triggers React reconciliation. At 60fps that is 60 re-renders per second per animated value. Results in visible jank, especially on mobile.

**Instead:** Use GSAP or CSS transitions to animate DOM properties directly via refs. React only knows "is this slide active?" (boolean), not "what is the current opacity?" (continuous value).

### Anti-Pattern 2: Heavy Third-Party Carousel Libraries

**What:** Using Swiper, Slick, Embla, or similar carousel libraries for the main slider.

**Why bad:** These libraries impose their own DOM structure, animation approach, and gesture handling. For a showcase where the carousel IS the product, you need full control over transitions, timing, and effects. Fighting a carousel library's opinions wastes more time than building a purpose-built slider.

**Instead:** Build a custom slider with GSAP-driven transitions. It is approximately 100-150 lines of core logic for index management, gesture detection, and keyboard handling. Everything else is animation timelines you control completely.

### Anti-Pattern 3: All Slides in DOM Simultaneously

**What:** Rendering all 12+ project slides with full resolution images and animations in the DOM at once.

**Why bad:** 12+ hero images (likely 1-2MB each), 36+ parallax layers, dozens of animated elements. Initial load is heavy. GPU memory for off-screen parallax layers is wasted.

**Instead:** Render current slide + 1 adjacent on each side (3 total visible in DOM). Lazy-load images for upcoming slides. Use IntersectionObserver or index-based logic to mount/unmount distant slides.

### Anti-Pattern 4: Inline Color Values Per Component

**What:** Passing color props through every component: `<StoryBlock textColor={project.colors.text} accentColor={project.colors.accent} />`.

**Why bad:** Prop drilling colors through 4+ levels. Every color change causes re-renders down the tree. Hard to animate color transitions smoothly.

**Instead:** CSS custom properties on :root. Components just use `color: var(--text)`. Theme engine tweens the custom properties. Zero prop drilling, zero re-renders for color changes.

### Anti-Pattern 5: Scroll Hijacking Without Escape

**What:** Taking over the browser scroll completely to drive slide transitions, with no way for the user to scroll normally.

**Why bad:** Users feel trapped. Accessibility nightmare. Breaks expected browser behavior. Some award-winning sites do this, but many visitors hate it.

**Instead:** Use a hybrid approach. The showcase section can use horizontal scroll-snapping or gesture-driven navigation, but provide clear affordances (arrows, dots, keyboard support). If the page has any vertical content, let vertical scroll work normally. Always support keyboard navigation (arrow keys, tab).

## Build Order (Dependencies)

The following order respects component dependencies -- each phase builds on what came before:

```
Phase 1: Foundation
  ├── Project scaffolding (Vite + React + TypeScript)
  ├── Project data types + static data file (2-3 seed projects)
  ├── CSS custom properties system (theme variables)
  └── Global styles (reset, typography, base tokens)
       Dependencies: None. Everything else depends on this.

Phase 2: Core Slider
  ├── SliderContainer (index state + keyboard/gesture handling)
  ├── ProjectSlide (basic composition, no animations yet)
  ├── HeroVisual (static image, no parallax yet)
  ├── StoryBlock (static text)
  └── Navigation indicators
       Dependencies: Phase 1 data + styles.

Phase 3: Theme Engine
  ├── ThemeProvider with CSS custom property transitions
  ├── Per-project color palettes in data
  ├── Background atmosphere layer (gradient mesh)
  └── Wire theme changes to slide index
       Dependencies: Phase 2 slider index state.

Phase 4: Animation Layer
  ├── GSAP integration + animation config
  ├── Slide transition timelines (enter/exit)
  ├── Text entrance animations (StoryBlock)
  ├── Staggered reveals (TechStack, elements)
  └── AnimationOrchestrator (timeline coordination)
       Dependencies: Phase 2 components + Phase 3 theme.

Phase 5: Depth / Parallax
  ├── Mouse-tracking parallax hook
  ├── Layered depth system for HeroVisual
  ├── Background particle/atmospheric effects
  └── Parallax configuration per project in data
       Dependencies: Phase 4 animation system.

Phase 6: Polish + Performance
  ├── Lazy loading for off-screen slides
  ├── Reduced motion support
  ├── Mobile gesture refinement
  ├── Performance profiling + optimization
  ├── Image optimization (WebP/AVIF, responsive sizes)
  └── Remaining projects data entry (fill to 12+)
       Dependencies: All prior phases stable.
```

**Rationale:** You cannot animate what does not exist (slider before animations). You cannot theme-transition without knowing which slide is active (theme after slider). Parallax is an enhancement layer on top of working animations. Polish is last because you need the full picture to optimize.

## Key Architectural Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Custom slider vs library | Custom | Full control over transitions is the entire point of this project |
| Theme mechanism | CSS custom properties + GSAP | Zero re-renders, animatable, simple |
| Animation library | GSAP (GreenSock) | Industry standard for production animation; timeline API is unmatched |
| 3D approach | CSS transforms + parallax layers | Avoids Three.js/WebGL complexity; achieves the "3D-enhanced 2D" goal |
| Image strategy | Static imports, lazy-loaded | No CMS; Vite handles optimization; lazy load non-adjacent slides |
| Gesture handling | Custom (pointer events) | ~50 lines; avoids Hammer.js dependency for one interaction |
| State management | React useState + refs | Single page, single piece of state (active index). No Redux/Zustand needed |

## Scalability Considerations

| Concern | At 12 projects | At 30 projects | At 50+ projects |
|---------|----------------|-----------------|-------------------|
| DOM weight | Render 3 (current +/- 1) | Same windowing | Same, consider virtual list |
| Image load | Lazy load; ~15-25MB total | Lazy critical; preload adjacent | Thumbnail grid entry + detail view |
| Data file | Single array, trivial | Single array, still fine | Consider splitting into per-project files |
| Navigation | Dots work | Dots crowded; switch to progress bar | Need category filtering or grid picker |
| Build time | Negligible | May want image optimization pipeline | Definitely need asset pipeline |

## Sources

- GSAP documentation and best practices (gsap.com/docs) -- HIGH confidence for animation architecture
- Award-winning portfolio sites (Awwwards, FWA patterns) -- HIGH confidence for component structure
- React performance patterns for animation-heavy apps -- HIGH confidence (well-documented by React team and GSAP)
- CSS Custom Properties specification and animation support -- HIGH confidence (W3C spec, widely supported)
- Training data synthesis of portfolio showcase architecture patterns -- MEDIUM confidence (patterns are established but specific implementation details may vary)

---
*Architecture research for: Immersive portfolio showcase with animations and 3D depth effects*
*Researched: 2026-03-05*
