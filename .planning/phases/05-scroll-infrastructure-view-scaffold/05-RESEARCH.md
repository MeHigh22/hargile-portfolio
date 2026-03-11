# Phase 5: Scroll Infrastructure & View Scaffold - Research

**Researched:** 2026-03-11
**Domain:** GSAP overlay panels, ScrollTrigger scroller config, hash-based view routing, Zustand view state, TypeScript data extension
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Entry/exit animation style**
- Curtain wipe: two-beat choreography — slider exits first, then case study reveals
- Beat 1 (slider exit): fade + scale down to ~95% — slider recedes into background (~0.4s)
- Beat 2 (case study reveal): staggered fade-up — hero appears first, then sections stagger in top-down with fade + translateY (~0.6s)
- Total duration: ~1s (brisk, matches existing 0.8s slide transition pacing)
- Exit animation (back to slider): reverse of entry — case study fades out, slider scales back up
- Reduced motion: skip all motion, use simple opacity crossfade (consistent with Phase 4 pattern)

**Case study layout skeleton**
- Full-bleed hero image at top spanning viewport width, with project title + category overlaid
- Hero image has subtle scroll parallax (image scrolls slower than content — reuses Phase 4 parallax pattern)
- Section order below hero: Challenge → Solution → Timeline → Metrics → Gallery → Testimonial → Team → Next project CTA
- Content width: centered prose column (~720-800px max-width) for text sections; hero and gallery break out to full width
- Mobile: same order, full-width everything, prose column collapses to viewport width with padding
- Section structure matches all 3 projects (consistent template, different stories)

**Back button & navigation chrome**
- Fixed top-left position — always visible as user scrolls
- Text link style: "← Retour" with arrow + French label
- Subtle backdrop blur (glass-morphism) behind text for readability over hero image
- No other persistent navigation chrome — back button only
- Escape key also triggers back navigation

**Placeholder data richness**
- Full realistic French content for all 3 projects (atlas, pulse, verde) — no lorem ipsum
- Each project: challenge/solution prose (2-3 paragraphs each), 4 timeline steps, 3-5 web/digital KPI metrics, testimonial quote, team credits
- Metrics: digital KPIs e.g., "+140% trafic organique", "-0.8s temps de chargement"
- Team credits use fictional French names with role titles
- CaseStudyData type extends ProjectData with caseStudy?: { challenge, solution, timeline, metrics, deliverables, testimonial, team }

**Architecture**
- Case study panel is a sibling DOM element of Slider inside AppShell (never a child)
- GSAP Observer is disabled (obs.disable(), not .kill()) on case study open and re-enabled on close
- All ScrollTrigger instances inside case study pass scroller: panelRef.current — never window
- gsap.context() scoped to case study container; .revert() called on every close path
- useViewStore Zustand store holds mode ('slider' | 'case') and activeProjectId
- useHashSync extended to parse #atlas/case-study format; popstate guard checks view mode
- CSS custom property overrides inside case study use --cs-* prefix, scoped to container element
- Native scroll for Phase 5 scaffold; add Lenis only if scroll feel is unsatisfactory after shell works
- "Voir l'étude de cas" CTA added to Slide.tsx after CaseStudyPanel destination is established

### Claude's Discretion
- Exact easing curves for curtain wipe beats
- Parallax scroll speed ratio for case study hero
- Backdrop blur intensity and background opacity on back button
- Section spacing rhythm and typography scale
- Exact hero image height (viewport percentage)
- Crossfade timing fine-tuning for reduced motion mode
- Fictional project narratives content (must be realistic and in French)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CSNAV-01 | User can click into a project from the slider and see a full-screen case study with an animated entry transition | Two-beat GSAP timeline: slider containerRef scales down, then CaseStudyPanel fades + staggers up. Observer.disable() blocks slider scroll during open animation and while panel is visible. |
| CSNAV-02 | User can return to the slider via a persistent back button that reverses the entry animation | Reverse timeline: CaseStudyPanel fades out → ctx.revert() cleans all ScrollTrigger instances → Observer.enable() restores slider → slider scales back up. Escape key listener registered once on panel mount. |
| CSVIS-02 | Case study inherits the project's color theme from the slider for visual continuity | applyTheme(deriveTheme(project.colors)) called at transition start; --cs-* prefix scopes overrides to panel element to prevent bleed from adjacent projects. Guard: block open while useSliderStore.isAnimating. |
| CSVIS-03 | Case study layout is responsive across mobile, tablet, and desktop | Tailwind CSS 4 responsive classes; prose column max-w-[800px] mx-auto with px-4 md:px-0; hero and gallery breakout via negative margin technique or full-width grid column span. |
| CSVIS-04 | Users with prefers-reduced-motion see a functional experience with animations simplified | useReducedMotion() already in codebase (gsap.matchMedia-based). Pass isReducedMotion flag into CaseStudyPanel; branch identical to Slider.tsx pattern: opacity crossfade, no spatial movement. |
| CSDATA-01 | Rich placeholder content exists for all 3 beta projects with realistic fake metrics, timelines, testimonials, and screenshots | Extend types.ts with CaseStudyData interface; extend projects.ts with caseStudy property per project; all content in French, realistic digital KPIs. |
</phase_requirements>

---

## Summary

Phase 5 introduces the case study overlay architecture — the most structurally significant change to the app since Phase 2. The core challenge is not animation complexity but **state machine correctness**: the app now has two modes (slider, case), and every input system (GSAP Observer, keyboard nav, browser history, ScrollTrigger) must be aware of the current mode and behave correctly in both.

The existing codebase provides strong building blocks. `useSliderStore` already implements the `isAnimating` lock pattern. `useReducedMotion` already branches GSAP animations via `gsap.matchMedia`. `useHashSync` already manages `popstate`. Phase 5 extends these patterns rather than inventing new ones: a new `useViewStore` coordinates mode, `useHashSync` is extended to handle the `#project/case-study` hash format, and a new `CaseStudyPanel` component owns a scoped `gsap.context()` that is fully reverted on every close path.

The critical technical finding is the **ScrollTrigger scroller configuration**. Since the case study panel is a `position: fixed` full-screen overlay that scrolls independently, all ScrollTrigger instances inside it must declare `scroller: panelRef.current`. Without this, ScrollTrigger listens to window scroll, which is stationary (the panel's overflow container scrolls, not the window). Additionally, ScrollTrigger must be `refresh()`'d after the panel's entry animation completes, since elements are not visible (and have no measurable position) during the animation phase. These are the two most common failure modes for this architecture.

**Primary recommendation:** Build the state machine and panel shell first (useViewStore + hash extension + Observer toggle), then the entry/exit animations, then the scroll infrastructure (ScrollTrigger scroller config), then the data layer (CaseStudyData type + content). This ordering surfaces integration failures early.

---

## Standard Stack

### Core (already installed — no new dependencies for Phase 5)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.14.2 | Entry/exit animations, ScrollTrigger for scroll-parallax in panel | Already the animation engine; ScrollTrigger is bundled |
| zustand | ^5.0.11 | useViewStore (mode + activeProjectId) | Existing pattern; zero prop-drilling |
| React 19 | ^19.2.4 | CaseStudyPanel component | Existing |
| TypeScript | ^5.9.3 | CaseStudyData type extension | Existing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| ScrollTrigger (GSAP plugin) | bundled with gsap | Scroll parallax on case study hero image | Must register: gsap.registerPlugin(ScrollTrigger) |
| @gsap/react | ^2.1.2 | Installed but project pattern uses plain useEffect | Available if needed; project deliberately avoids useGSAP hook due to context revert issues in slider — same decision applies to case study panel |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native scroll | Lenis smooth scroll | Deferred — add only if scroll feel unsatisfactory after Phase 5 shell works. Lenis would conflict with ScrollTrigger scroller config on panel element. |
| Plain useEffect + gsap.context() | @gsap/react useGSAP hook | Project decision: stick with plain useEffect; avoids context revert issues experienced in slider (see STATE.md). |
| Hash-based routing | React Router | No router introduced — useViewStore + useHashSync extension is sufficient. |

**Installation:** No new packages required for Phase 5.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── layout/
│   │   └── AppShell.tsx          # Add <CaseStudyPanel> as sibling of <Slider>
│   └── case-study/               # New directory
│       ├── CaseStudyPanel.tsx    # Full-screen overlay, owns gsap.context()
│       ├── CaseStudyHero.tsx     # Full-bleed hero with scroll parallax
│       ├── CaseStudySection.tsx  # Reusable section wrapper (data-anim attribute)
│       └── BackButton.tsx        # Fixed top-left "← Retour" with backdrop blur
├── store/
│   └── useViewStore.ts           # New: mode ('slider'|'case') + activeProjectId
├── hooks/
│   └── useHashSync.ts            # Extend: parse #atlas/case-study format
└── data/
    ├── types.ts                  # Extend: CaseStudyData interface
    └── projects.ts               # Extend: add caseStudy property per project
```

### Pattern 1: Two-Mode State Machine (useViewStore)
**What:** Zustand store holding current view mode and active project. Single source of truth that all systems (Observer, keyboard, hash, ScrollTrigger) query.
**When to use:** Any input system needs to know whether to act on the slider or the case study.
**Example:**
```typescript
// src/store/useViewStore.ts
import { create } from 'zustand';

type ViewMode = 'slider' | 'case';

interface ViewState {
  mode: ViewMode;
  activeProjectId: string | null;
  openCase: (projectId: string) => void;
  closeCase: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  mode: 'slider',
  activeProjectId: null,
  openCase: (projectId) => set({ mode: 'case', activeProjectId: projectId }),
  closeCase: () => set({ mode: 'slider', activeProjectId: null }),
}));
```

### Pattern 2: Observer Disable/Enable on Mode Change
**What:** The GSAP Observer created in Slider.tsx must be toggled based on view mode. `disable()` removes event listeners without killing the instance; `enable()` restores them.
**When to use:** Every time case study opens (disable) or closes (enable).
**Example:**
```typescript
// In Slider.tsx — expose obs ref so CaseStudyPanel or a shared effect can toggle it
// Better approach: observe useViewStore.mode in Slider.tsx useEffect
useEffect(() => {
  const unsub = useViewStore.subscribe(
    (state) => state.mode,
    (mode) => {
      if (mode === 'case') obs.disable();
      else obs.enable();
    }
  );
  return () => unsub();
}, [obs]);
```

### Pattern 3: gsap.context() Scoped to Panel — Full Lifecycle
**What:** All GSAP animations and ScrollTrigger instances inside the case study panel are created inside a single `gsap.context()`. On every close path (button click, Escape, popstate), `ctx.revert()` is called first, then the mode switches.
**When to use:** Every open/close cycle of the panel.
**Example:**
```typescript
// CaseStudyPanel.tsx — simplified lifecycle
const panelRef = useRef<HTMLDivElement>(null);
const ctxRef = useRef<gsap.Context | null>(null);

const openPanel = useCallback(() => {
  if (ctxRef.current) ctxRef.current.revert(); // guard: ensure previous session cleaned
  ctxRef.current = gsap.context(() => {
    // All gsap.to(), ScrollTrigger.create(), etc. live here
    ScrollTrigger.create({
      scroller: panelRef.current, // CRITICAL: not window
      trigger: heroRef.current,
      // ...
    });
  }, panelRef);
}, []);

const closePanel = useCallback(() => {
  ctxRef.current?.revert();  // kills all ScrollTrigger instances in this context
  ctxRef.current = null;
  useViewStore.getState().closeCase();
}, []);
```

### Pattern 4: ScrollTrigger with Custom Scroller
**What:** The panel is an overflow-scrolling container. ScrollTrigger must listen to the panel element's scroll, not the window.
**When to use:** Every ScrollTrigger instance created inside CaseStudyPanel.
**Example:**
```typescript
// Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  scroller: panelRef.current,   // the overflow-scroll container
  trigger: sectionRef.current,
  start: 'top 80%',
  onEnter: () => {
    gsap.to(sectionRef.current, { opacity: 1, y: 0, duration: 0.5 });
  },
});

// CRITICAL: call after entry animation completes (elements must be in final position)
ScrollTrigger.refresh();
```

### Pattern 5: Two-Beat Entry Animation Timeline
**What:** Slider scales/fades out first (Beat 1), then case study fades in with stagger (Beat 2). Uses GSAP timeline with position parameter to sequence.
**When to use:** Every time a case study opens.
**Example:**
```typescript
// Source: established pattern from Slider.tsx animateTransition
const entryTl = gsap.timeline({
  onComplete: () => {
    // ScrollTrigger.refresh() here — elements are now in final rendered position
    ScrollTrigger.refresh();
    useSliderStore.getState().setAnimating(false);
  }
});

if (isReducedMotion) {
  // Crossfade only
  entryTl.to(sliderContainerRef.current, { opacity: 0, duration: 0.3 });
  entryTl.to(panelRef.current, { opacity: 1, duration: 0.3 }, '<');
} else {
  // Beat 1: slider recedes
  entryTl.to(sliderContainerRef.current, {
    scale: 0.95, opacity: 0, duration: 0.4, ease: 'power2.inOut'
  });
  // Beat 2: case study reveals — hero first, then sections stagger
  entryTl.fromTo(panelRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 0.2 },
    '-=0.1'
  );
  entryTl.from('[data-anim="cs-hero"]',
    { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' },
    '-=0.1'
  );
  entryTl.from('[data-anim="cs-section"]',
    { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 },
    '-=0.2'
  );
}
```

### Pattern 6: Hash Extension for Case Study URL
**What:** `useHashSync` must recognize `#atlas/case-study` format (slash-delimited) and treat it differently from the existing `#atlas` format (slider).
**When to use:** popstate handler and initial mount parsing.
**Example:**
```typescript
// Extension to useHashSync.ts
const handlePopState = () => {
  const hash = window.location.hash.slice(1);
  const parts = hash.split('/');

  if (parts.length === 2 && parts[1] === 'case-study') {
    // Navigate to case study view
    const projectId = parts[0];
    useViewStore.getState().openCase(projectId);
  } else {
    // Standard slider navigation (existing logic)
    const idx = projects.findIndex((p) => p.id === hash);
    if (idx !== -1) goToSlide(idx);
  }
};

// On case study open: pushState
window.history.pushState(null, '', `#${projectId}/case-study`);
// On case study close: go back OR pushState to slider hash
window.history.pushState(null, '', `#${projectId}`);
```

### Pattern 7: Scroll Parallax Inside Panel (ScrollTrigger variant of useParallax)
**What:** Phase 4 uses mouse-position parallax (quickTo). Case study hero needs scroll-position parallax (ScrollTrigger scrub). Separate implementation — adapt, don't reuse the same hook.
**When to use:** Case study hero image inside panelRef.
**Example:**
```typescript
// Inside gsap.context() created on panel open
ScrollTrigger.create({
  scroller: panelRef.current,
  trigger: heroRef.current,
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    // Image moves at 40% of scroll speed = parallax effect
    gsap.set(heroImgRef.current, { y: self.progress * 60 }); // 60px max shift
  },
});
```

### Anti-Patterns to Avoid
- **Window as scroller inside panel:** `ScrollTrigger.create({ trigger: el })` without `scroller: panelRef.current` — triggers never fire because window scroll is at 0 while the panel's overflow container scrolls.
- **ScrollTrigger.refresh() before entry animation completes:** Elements have `opacity: 0` or are off-screen during animation; refresh measures wrong positions. Always call in `onComplete`.
- **obs.kill() instead of obs.disable():** Killing the Observer means it cannot be re-enabled. The Observer must survive the case study session.
- **Forgetting ctx.revert() on Escape / popstate path:** A user pressing browser back without the in-app button leaves orphaned ScrollTrigger instances that fire on subsequent opens.
- **Opening case study while slider is mid-transition:** `useSliderStore.getState().isAnimating` must be checked before calling `openCase()`. Already established pattern.
- **React style prop for panel positioning:** Consistent with slider rule — CSS handles initial state, GSAP handles animation. Panel starts `visibility: hidden; pointer-events: none` via CSS, GSAP makes it visible.
- **Nesting CaseStudyPanel inside Slider:** Would be clipped by `overflow: hidden` on the slider container. Must be a sibling inside AppShell.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll event debouncing inside panel | Custom scroll listener with RAF | ScrollTrigger with `scroller` config | ScrollTrigger handles RAF, intersection, position cache, resize correctly |
| Animation cleanup registry | Custom Map of animation IDs | gsap.context() + revert() | GSAP context tracks every tween and ScrollTrigger created within its scope automatically |
| Reduced motion branching | Custom media query hook | useReducedMotion() already in codebase | Already uses gsap.matchMedia; reactive on OS preference change |
| View state management | React Context / prop drilling | Zustand useViewStore | Existing pattern; accessible from anywhere without re-render chains |
| Modal scroll lock (body scroll prevention) | document.body.style.overflow = 'hidden' | CSS `overflow: hidden` on slider container + panel as separate full-screen overlay | Body scroll lock breaks in iOS Safari; overlay approach sidesteps this entirely |

**Key insight:** GSAP's `gsap.context()` + ScrollTrigger's `scroller` config together solve the two hardest problems in this phase (animation cleanup across open/close cycles, and scroll event scoping). The project has chosen not to use Lenis for Phase 5, which is correct — Lenis + ScrollTrigger scroller config on a panel element would require additional Lenis instance configuration and creates more failure surface.

---

## Common Pitfalls

### Pitfall 1: ScrollTrigger Not Firing Inside Panel
**What goes wrong:** Section animations never trigger as user scrolls inside the case study.
**Why it happens:** ScrollTrigger defaults to `scroller: window`. The window is not scrolling — the panel's overflow container is. ScrollTrigger never sees a scroll event it cares about.
**How to avoid:** Every `ScrollTrigger.create()` inside the panel must include `scroller: panelRef.current`. Set a linting convention or a code comment at the top of the panel file as a reminder.
**Warning signs:** Animations that should trigger on scroll fire immediately on open, or never fire at all.

### Pitfall 2: Ghost ScrollTrigger Instances After Close
**What goes wrong:** On second open, ScrollTrigger instances from the previous session still exist. They fire at wrong positions, or conflict with new instances.
**Why it happens:** `ctx.revert()` was not called on one of the three close paths (button, Escape key, popstate). Easy to miss the popstate path.
**How to avoid:** Centralize close logic into a single `closePanel()` function. `ctx.revert()` is the first line of that function. Call `closePanel()` from all three trigger points. Never call `useViewStore.getState().closeCase()` without calling `ctx.revert()` first.
**Warning signs:** Console warnings about duplicate ScrollTrigger IDs; animations playing twice; scroll jumping on reopen.

### Pitfall 3: ScrollTrigger Measures Wrong Positions (refresh timing)
**What goes wrong:** Scroll-triggered animations fire at wrong scroll positions (e.g., too early).
**Why it happens:** ScrollTrigger.refresh() was called while elements were still in their animated-from state (opacity: 0, y: 30). It measures the trigger positions at that point.
**How to avoid:** Call `ScrollTrigger.refresh()` inside the entry animation timeline's `onComplete` callback, after all elements are in their final visible positions.
**Warning signs:** Section animations fire at top of panel before scrolling; parallax speed feels wrong.

### Pitfall 4: Observer Re-enabled Before Exit Animation Completes
**What goes wrong:** User can swipe to change slides while the exit animation (case study fading out, slider scaling back in) is still playing.
**Why it happens:** `obs.enable()` called immediately in `closePanel()` instead of in the exit animation's `onComplete`.
**How to avoid:** `obs.enable()` must live in the exit GSAP timeline's `onComplete` callback, not before the animation starts.
**Warning signs:** Slider responds to wheel/touch events during the close animation; slide changes mid-animation.

### Pitfall 5: Palette Bleed from Adjacent Projects on Open
**What goes wrong:** The case study shows the wrong project's color theme for a frame before snapping to correct colors.
**Why it happens:** Case study opens while slider is mid-color-morph animation; the DOM currently has interpolated color values.
**How to avoid:** Check `useSliderStore.getState().isAnimating` before calling `openCase()`. If animating, block the open (already established pattern from STATE.md).
**Warning signs:** Flash of wrong accent color on case study open; brief color mismatch between panel and project.

### Pitfall 6: popstate Race Condition Between Slider and Case Study
**What goes wrong:** Pressing browser back from `#atlas/case-study` runs the slider's popstate handler, which calls `goToSlide()` with a wrong index (because `atlas` is found in projects array).
**Why it happens:** `useHashSync` does not yet know about the `/case-study` format; it finds `atlas` in the hash and treats it as a slide navigation.
**How to avoid:** Parse the hash in popstate before any other logic. If `hash.includes('/case-study')`, handle as case study close, return early. Do not call `goToSlide()`.
**Warning signs:** Browser back from case study navigates to a different slide instead of closing the panel.

---

## Code Examples

Verified patterns from existing codebase and official sources:

### CaseStudyData Type Extension
```typescript
// src/data/types.ts — extend existing types
export interface CaseStudyMetric {
  label: string;   // e.g., "Trafic organique"
  value: string;   // e.g., "+140%"
}

export interface CaseStudyTimelineStep {
  phase: string;   // e.g., "Découverte"
  duration: string; // e.g., "2 semaines"
  description: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudyTeamMember {
  name: string;    // e.g., "Marie Dupont"
  role: string;    // e.g., "Lead Designer"
}

export interface CaseStudyContent {
  challenge: string;   // 2-3 paragraph prose in French
  solution: string;    // 2-3 paragraph prose in French
  timeline: CaseStudyTimelineStep[];  // 4 steps
  metrics: CaseStudyMetric[];         // 3-5 items
  deliverables: string[];             // list of deliverable descriptions
  testimonial: CaseStudyTestimonial;
  team: CaseStudyTeamMember[];
}

// Extend ProjectData (keep backward compatible — optional field)
export interface ProjectData {
  // ... existing fields ...
  caseStudy?: CaseStudyContent;
}
```

### useViewStore
```typescript
// src/store/useViewStore.ts
import { create } from 'zustand';

type ViewMode = 'slider' | 'case';

interface ViewState {
  mode: ViewMode;
  activeProjectId: string | null;
  openCase: (projectId: string) => void;
  closeCase: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  mode: 'slider',
  activeProjectId: null,
  openCase: (projectId) => set({ mode: 'case', activeProjectId: projectId }),
  closeCase: () => set({ mode: 'slider', activeProjectId: null }),
}));
```

### AppShell Integration
```tsx
// src/components/layout/AppShell.tsx — add CaseStudyPanel as sibling
import { CaseStudyPanel } from '../case-study/CaseStudyPanel';
import { useViewStore } from '../../store/useViewStore';

export function AppShell({ children }: AppShellProps) {
  const mode = useViewStore((s) => s.mode);
  const activeProjectId = useViewStore((s) => s.activeProjectId);
  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased overflow-x-hidden">
      {children}
      {/* CaseStudyPanel is a sibling — never inside Slider */}
      {activeProjectId && (
        <CaseStudyPanel projectId={activeProjectId} />
      )}
      <ContactCTA />
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.012]"
        style={{ backgroundImage: GRAIN_SVG }} aria-hidden="true" />
    </div>
  );
}
```

### Panel Initial CSS State
```css
/* Critical: CSS controls initial state, GSAP controls animation */
/* In CaseStudyPanel.tsx className — panel starts invisible */
/* className="fixed inset-0 z-[100] overflow-y-auto bg-bg opacity-0 pointer-events-none" */
/* GSAP animates opacity to 1 and sets pointer-events: auto on open */
```

### Slide CTA Button (added at Phase 5 end)
```tsx
// src/components/slider/Slide.tsx — add after existing content
<button
  data-anim="cta"
  onClick={() => {
    const store = useSliderStore.getState();
    if (!store.isAnimating) {
      useViewStore.getState().openCase(project.id);
    }
  }}
  className="mt-6 font-mono text-sm tracking-wider text-accent border border-accent/40 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors"
>
  Voir l'étude de cas →
</button>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scroll hijacking for full-page sections | Native scroll inside overflow container + ScrollTrigger scroller config | GSAP 3.x era | Removes iOS momentum scroll conflicts; no Lenis needed for Phase 5 |
| react-router for modal/overlay routing | Hash-based routing with custom popstate handler | Project-level decision (Phase 2) | No router dependency; fine-grained control over history entries |
| useGSAP hook for all animations | Plain useEffect + gsap.context() | Project-level decision (Phase 4) | Avoids context revert issues with Observer; consistent with existing Slider.tsx pattern |
| GSAP ScrollTrigger global scroller | Per-instance `scroller` config option | GSAP 3.6+ | Enables independent scroll areas without Lenis or scroll-hijacking |

**Deprecated/outdated:**
- `Lenis` for this phase: Deferred. Native scroll is the correct starting point; Lenis would complicate the `scroller` config.
- `gsap.killTweensOf()` for cleanup: Use `ctx.revert()` instead — kills everything created in that context scope atomically.

---

## Open Questions

1. **Observer ref exposure from Slider.tsx**
   - What we know: The `obs` created in `useEffect` in Slider.tsx is local to that effect closure. To toggle it from outside, it must be stored in a ref or exposed via a callback.
   - What's unclear: Whether to store `obs` in a `useRef<Observer|null>` on Slider.tsx and subscribe to `useViewStore` within the same Slider.tsx effect, or use a custom `useObserverSync` hook.
   - Recommendation: Add `obsRef = useRef<Observer|null>(null)` in Slider.tsx. Subscribe to `useViewStore.mode` inside the same `useEffect` that creates the Observer. This keeps Observer lifecycle entirely within Slider.tsx.

2. **ScrollTrigger.refresh() scope**
   - What we know: `ScrollTrigger.refresh()` refreshes ALL instances globally by default.
   - What's unclear: Whether global refresh could interfere with any residual slider ScrollTrigger instances (Phase 5 doesn't add ScrollTrigger to the slider, so likely safe).
   - Recommendation: Verify no ScrollTrigger instances exist on the slider side at Phase 5. If they do in Phase 6+, use `ScrollTrigger.refresh()` scoped call or instance-level `.update()`.

3. **Panel mount strategy: always-mounted vs conditional**
   - What we know: AppShell example above uses conditional render (`{activeProjectId && <CaseStudyPanel />`). This means the panel mounts/unmounts each open/close cycle.
   - What's unclear: Whether mounting on first open and then keeping in DOM (hidden via CSS) would avoid FOUC or animation init delay on second open.
   - Recommendation: Conditional mount is simpler and aligns with gsap.context() lifecycle (fresh context on each mount). Acceptable for Phase 5 since entry animation duration (~1s) hides any mount lag. Revisit only if flash is visible.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| Config file | vite.config.ts (vitest config inline) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CSNAV-01 | openCase() sets mode to 'case' and activeProjectId | unit | `npm run test -- useViewStore` | ❌ Wave 0 |
| CSNAV-01 | CaseStudyPanel renders when mode is 'case' | unit | `npm run test -- CaseStudyPanel` | ❌ Wave 0 |
| CSNAV-02 | closeCase() resets mode to 'slider' and activeProjectId to null | unit | `npm run test -- useViewStore` | ❌ Wave 0 |
| CSNAV-02 | Escape key triggers closeCase (component behavior) | unit | `npm run test -- CaseStudyPanel` | ❌ Wave 0 |
| CSVIS-02 | openCase blocked while useSliderStore.isAnimating is true | unit | `npm run test -- useViewStore` | ❌ Wave 0 |
| CSVIS-03 | CaseStudyPanel renders without crash on mobile viewport | unit | `npm run test -- CaseStudyPanel` | ❌ Wave 0 |
| CSVIS-04 | Reduced motion: no spatial animation props in panel (smoke) | manual-only | N/A — requires real OS preference change | — |
| CSDATA-01 | All 3 projects have caseStudy property with required fields | unit | `npm run test -- projects` | ❌ Wave 0 (extend existing test) |
| CSDATA-01 | CaseStudyContent type has all required fields populated | unit | `npm run test -- projects` | ❌ Wave 0 |

Note: GSAP animation behavior (easing, duration, ScrollTrigger firing) is tested manually in browser. Unit tests cover state logic and component render correctness only. GSAP is mocked in jsdom environment (no animation actually runs).

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/store/__tests__/useViewStore.test.ts` — covers CSNAV-01, CSNAV-02, CSVIS-02
- [ ] `src/components/case-study/__tests__/CaseStudyPanel.test.tsx` — covers CSNAV-01, CSNAV-02, CSVIS-03
- [ ] Extend `src/data/__tests__/projects.test.ts` — covers CSDATA-01

---

## Sources

### Primary (HIGH confidence)
- [GSAP ScrollTrigger Official Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — scroller config, refresh(), kill() vs disable()
- [GSAP Observer disable()](https://gsap.com/docs/v3/Plugins/Observer/disable()/) — disable/enable API confirmed reversible
- [GSAP React Integration Guide](https://gsap.com/resources/React/) — gsap.context(), cleanup patterns, strict mode behavior
- [gsap.context() Official Docs](https://gsap.com/docs/v3/GSAP/gsap.context()/) — scope, revert(), add() for context-safe handlers
- Existing codebase: `useSliderStore.ts`, `Slider.tsx`, `useHashSync.ts`, `useReducedMotion.ts`, `useParallax.ts` — all patterns confirmed by direct code reading

### Secondary (MEDIUM confidence)
- [GSAP community: ScrollTrigger in overflow container](https://gsap.com/community/forums/topic/38558-scrolltrigger-in-overflow-container/) — confirms `scroller` property is the correct approach; position: fixed not used in nested scroll context
- [GSAP community: Enable/Disable Observer (2024)](https://gsap.com/community/forums/topic/42937-enabledisable-observer/) — community confirmation of disable/enable pattern for overlay slides
- [GSAP: Avoid The Pitfalls (2024)](https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html) — cleanup patterns verified

### Tertiary (LOW confidence — flagged for validation)
- None for critical architecture decisions. All key decisions confirmed via official GSAP documentation or direct codebase reading.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; existing GSAP + Zustand + TypeScript confirmed via package.json
- Architecture (state machine, Observer toggle, gsap.context lifecycle): HIGH — confirmed via official GSAP docs and existing codebase patterns
- ScrollTrigger scroller config: HIGH — confirmed via official docs; `scroller` property is documented explicitly
- Hash routing extension: HIGH — `useHashSync.ts` read directly; extension pattern is straightforward string parsing
- Pitfalls (ghost ScrollTrigger, Observer re-enable timing): HIGH — derived from official docs behavior + direct code analysis
- Data schema (CaseStudyData): HIGH — TypeScript extension of existing types; content is placeholder prose

**Research date:** 2026-03-11
**Valid until:** 2026-04-10 (GSAP stable; no fast-moving ecosystem changes expected)
