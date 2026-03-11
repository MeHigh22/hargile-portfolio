# Architecture Research

**Domain:** Immersive portfolio showcase — case study integration with existing slider
**Researched:** 2026-03-11
**Confidence:** HIGH (patterns verified against GSAP docs, existing codebase, and established agency portfolio patterns)

---

## Context: What Exists vs What's Being Added

This is a **subsequent milestone** research update. The v1.0 slider is fully built and running. This document focuses exclusively on integrating scrollable case study pages without breaking the existing system.

### Current System (Verified from Codebase)

```
App
 └── AppShell             (min-h-screen, grain overlay fixed)
      ├── Navigation       (fixed overlay)
      └── Slider           (h-screen, overflow-hidden, GSAP Observer)
           ├── Slide[0]    (absolute inset-0, display:none unless active)
           ├── Slide[1]    (absolute inset-0)
           └── Slide[N]
```

Critical constraints from the live codebase:
- `Slider` owns a GSAP `Observer` instance that calls `preventDefault()` on all wheel/touch/pointer events
- `Slide` components are `forwardRef`, no React style prop (GSAP owns inline styles)
- `useHashSync` manages `#atlas`, `#pulse`, `#verde` hash routing via `pushState`/`popState`
- `useSliderStore` (Zustand) holds `currentIndex`, `direction`, `isAnimating`
- Theme is on `document.documentElement` CSS custom properties — every component reads via `var(--color-*)`

---

## System Overview: With Case Studies Added

```
+------------------------------------------------------------------+
|                         App Shell                                 |
|  (grain overlay, fixed z-[9999])                                  |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------+    +----------------------------------+   |
|  |    Navigation       |    |  NEW: CaseStudyNav (back btn)   |   |
|  |  (slider mode)      |    |  (case study mode, replaces     |   |
|  |                     |    |   slider Navigation)            |   |
|  +--------------------+    +----------------------------------+   |
|                                                                    |
|  +------------------------------------------------------------+   |
|  |               View Layer (mode-driven)                      |   |
|  |                                                              |   |
|  |  [SLIDER VIEW]  active when viewStore.mode === 'slider'     |   |
|  |  +--------------------------------------------------------+  |   |
|  |  |  Slider (GSAP Observer active, overflow-hidden)         |  |   |
|  |  |   Slide[0..N]                                           |  |   |
|  |  +--------------------------------------------------------+  |   |
|  |                                                              |   |
|  |  [CASE STUDY VIEW]  active when viewStore.mode === 'case'   |   |
|  |  +--------------------------------------------------------+  |   |
|  |  |  CaseStudyPanel (overflow-y-auto, Lenis scroll)         |  |   |
|  |  |   ChallengeSection                                      |  |   |
|  |  |   ProcessTimeline                                       |  |   |
|  |  |   MetricsSection                                        |  |   |
|  |  |   DeliverablesGallery                                   |  |   |
|  |  +--------------------------------------------------------+  |   |
|  +------------------------------------------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
|                      State Layer                                   |
|                                                                    |
|  useSliderStore (existing)     useViewStore (NEW)                 |
|  - currentIndex                - mode: 'slider' | 'case'         |
|  - direction                   - activeProjectId: string | null   |
|  - isAnimating                                                    |
+------------------------------------------------------------------+
|                      Data Layer                                    |
|  projects[] (existing) + caseStudies[] (new, keyed by project.id) |
+------------------------------------------------------------------+
```

---

## The Core Integration Question: Router or No Router?

**Recommendation: No router. Use a Zustand view-mode store instead.**

**Rationale:**

The app has no router today. Adding React Router or TanStack Router means:
1. Wrapping the entire app in a `<RouterProvider>` or `<BrowserRouter>` — touching `main.tsx` and `App.tsx`
2. Converting the hash-based `useHashSync` into route-based navigation (non-trivial, fragile)
3. Managing GSAP Observer lifecycle across route changes
4. The project is explicitly "standalone showcase page only" — a router buys nothing that a view-mode store doesn't

A Zustand `useViewStore` with `mode: 'slider' | 'case'` and `activeProjectId` achieves identical URL behavior via `pushState` (same as `useHashSync` already does) without any framework overhead.

**URL scheme (pushState, no router):**
- Slider: `/#atlas` (existing, unchanged)
- Case study: `/#atlas/case-study` (new)

The existing `useHashSync` is extended to parse this format. When the hash contains `/case-study`, the view store switches to case mode. Browser back/forward works via the same `popstate` listener.

---

## Integration Architecture

### View Switching Pattern

```typescript
// NEW: useViewStore.ts
interface ViewState {
  mode: 'slider' | 'case';
  activeProjectId: string | null;
  openCaseStudy: (projectId: string) => void;
  closeCaseStudy: () => void;
}
```

The transition sequence when a user clicks "Voir l'étude de cas" on a slide:

```
User clicks CTA on Slide
        |
        v
openCaseStudy(projectId) called
        |
        v
1. Pause/disable GSAP Observer (obs.disable())
2. GSAP exit animation: current slide scales/fades out
3. viewStore.mode = 'case', activeProjectId = projectId
4. CaseStudyPanel mounts/becomes visible
5. GSAP entrance: CaseStudyPanel slides up from bottom
6. Lenis instance starts (was stopped during slider)
7. pushState(`#${projectId}/case-study`)
        |
        v
[Case study is now active — scroll works normally]
```

Reverse (back to slider):
```
User clicks "Retour" button
        |
        v
closeCaseStudy() called
        |
        v
1. Lenis stops
2. ScrollTrigger.getAll().forEach(st => st.kill()) — clean up case study triggers
3. GSAP exit: CaseStudyPanel slides down
4. viewStore.mode = 'slider'
5. Slider becomes visible, Observer re-enabled (obs.enable())
6. Re-apply current project theme (applyTheme called)
7. pushState(`#${projectId}`) — back to slider hash
```

### Observer Lifecycle Management

The GSAP Observer in `Slider.tsx` calls `preventDefault()` on all wheel/touch/pointer events. This must be disabled while the case study panel is scrolling. The Observer instance already supports `.enable()` / `.disable()`. The `obs` ref must be exposed or the store triggers a disable signal.

**Implementation:** Store the Observer instance in a module-level ref accessible outside `Slider`, or pass an `obsRef` up to the view orchestration layer.

```typescript
// In Slider.tsx — expose the observer ref for lifecycle control
const obsRef = useRef<ReturnType<typeof Observer.create> | null>(null);

useEffect(() => {
  obsRef.current = Observer.create({ ... });
  return () => obsRef.current?.kill();
}, []);

// Expose via a stable callback from viewStore or via context
// Simplest: store obsRef in a module singleton
```

### ScrollTrigger + Lenis Integration for Case Studies

The existing Lenis instance is already in the codebase but disabled during slider operation. For case studies:

1. Lenis resumes when case study opens
2. ScrollTrigger uses `scroller: casePanelRef.current` (the scrollable container, not window) OR Lenis is set as the scroll driver

The standard Lenis + ScrollTrigger wiring (MEDIUM confidence — verified via GSAP community forums):

```typescript
// In CaseStudyPanel or a useCaseStudyScroll hook
useEffect(() => {
  if (!lenis) return;

  // Sync Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off('scroll', ScrollTrigger.update);
    // cleanup ticker add requires gsap.ticker.remove
  };
}, [lenis]);
```

---

## Component Breakdown: New vs Modified

### Modified Components

| Component | What Changes | Why |
|-----------|-------------|-----|
| `App.tsx` | Add `<CaseStudyPanel>` alongside `<Slider>`, conditionally rendered by view mode | View mode switching |
| `useHashSync.ts` | Parse `#id/case-study` format, call `openCaseStudy` when matched | URL sync for case studies |
| `Slide.tsx` | Add "Voir l'étude de cas" CTA button that calls `openCaseStudy(project.id)` | Entry point to case study |
| `Slider.tsx` | Expose Observer instance for enable/disable; respond to view mode | Observer lifecycle |

### New Components

| Component | Responsibility | Notes |
|-----------|---------------|-------|
| `useViewStore.ts` | `mode`, `activeProjectId`, `openCaseStudy`, `closeCaseStudy` | Zustand store — new state atom |
| `CaseStudyPanel.tsx` | Outer scroll container, mounts/unmounts case study content, owns Lenis | Single component, receives projectId |
| `ChallengeSection.tsx` | Problem/challenge block with visual storytelling | Scroll-triggered text reveals |
| `ProcessTimeline.tsx` | Discovery → Design → Dev → Launch animated timeline | Horizontal or vertical scroll-driven |
| `MetricsSection.tsx` | Animated counters, simple SVG charts | GSAP counter animation on ScrollTrigger |
| `DeliverablesGallery.tsx` | Screenshot grid with staggered scroll reveals | CSS grid + GSAP stagger on scroll |
| `CaseStudyNav.tsx` | "Retour aux projets" button, project title, progress indicator | Fixed inside case study view |
| `useCaseStudyTransition.ts` | GSAP timeline for open/close transitions | Encapsulates slider↔case-study animation |

---

## Recommended Project Structure Extension

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          (unchanged)
│   │   ├── Navigation.tsx        (unchanged — hidden during case study)
│   │   ├── ContactCTA.tsx        (unchanged)
│   │   └── CaseStudyNav.tsx      (NEW — back button + title)
│   │
│   ├── slider/
│   │   ├── Slider.tsx            (modified — expose obsRef)
│   │   ├── Slide.tsx             (modified — add CTA trigger)
│   │   ├── SliderControls.tsx    (unchanged)
│   │   └── ProgressIndicator.tsx (unchanged)
│   │
│   └── case-study/               (NEW folder)
│       ├── CaseStudyPanel.tsx    # Outer container, Lenis, ScrollTrigger scope
│       ├── ChallengeSection.tsx  # Problem/solution visual block
│       ├── ProcessTimeline.tsx   # Phase timeline (animated)
│       ├── MetricsSection.tsx    # Counters + charts
│       └── DeliverablesGallery.tsx  # Screenshot gallery
│
├── store/
│   ├── useSliderStore.ts         (unchanged)
│   └── useViewStore.ts           (NEW — mode + activeProjectId)
│
├── hooks/
│   ├── useHashSync.ts            (modified — handle /case-study suffix)
│   ├── useCaseStudyTransition.ts (NEW — open/close GSAP timelines)
│   └── useCaseStudyScroll.ts     (NEW — Lenis + ScrollTrigger setup)
│
└── data/
    ├── projects.ts               (modified — add caseStudy field to ProjectData)
    ├── case-studies.ts           (NEW — rich content per project)
    └── types.ts                  (modified — CaseStudyData type)
```

---

## Data Model Extension

Minimal change to `ProjectData` — add an optional `caseStudy` reference. The rich case study content lives in a separate structure to keep the main slider data lean:

```typescript
// Modified types.ts
export interface ProjectData {
  // ... all existing fields unchanged ...
  caseStudy?: CaseStudyData;   // optional — slides work without it
}

// New CaseStudyData type
export interface TimelinePhase {
  label: string;          // "Découverte", "Design", "Développement", "Lancement"
  duration: string;       // "3 semaines"
  description: string;    // Short paragraph
  deliverables: string[]; // ["User research", "Wireframes"]
}

export interface MetricData {
  value: string;          // "60%"  (string for formatting flexibility)
  label: string;          // "Réduction du temps d'analyse"
  prefix?: string;        // "+" or "-"
  animateTo?: number;     // numeric target for GSAP counter (e.g. 60)
}

export interface DeliverableItem {
  title: string;
  description: string;
  imageUrl: string;
  type: 'screen' | 'print' | 'motion' | 'brand';
}

export interface CaseStudyData {
  heroStatement: string;   // One-sentence project summary for case study hero
  challenge: {
    headline: string;
    body: string;          // 2-3 paragraphs
    visualUrl?: string;    // Optional supporting image
  };
  process: TimelinePhase[];
  metrics: MetricData[];
  deliverables: DeliverableItem[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}
```

This keeps `projects.ts` backward-compatible — slides render exactly as before if `caseStudy` is undefined, and the "Voir l'étude de cas" CTA only appears when the field is present.

---

## Data Flow

### View Mode Switch Flow

```
User: clicks "Voir l'étude de cas" on Slide
        |
        v
Slide calls openCaseStudy(project.id)  [viewStore action]
        |
        v
useCaseStudyTransition hook fires
  1. obs.disable()                    [Slider stops hijacking scroll]
  2. gsap.to(sliderEl, exit tl)       [Slider animates out]
  3. viewStore.set({ mode: 'case',    [React state — minimal re-render]
                     activeProjectId })
        |
        v
CaseStudyPanel renders (was hidden via display:none or visibility:hidden)
  applyTheme(project)                 [Keeps theme consistent]
  Lenis.start()                       [Smooth scroll enabled]
  ScrollTrigger.refresh()             [Recalculate trigger positions]
        |
        v
gsap.from(casePanelEl, entrance tl)  [Panel slides up]
pushState(`#${projectId}/case-study`) [URL updated]
```

### Scroll-Triggered Animation Flow (Inside Case Study)

```
Lenis scroll event fires
        |
        v
lenis.on('scroll', ScrollTrigger.update)
        |
        v
ScrollTrigger checks each trigger's progress
        |
        ├── ChallengeSection enters viewport
        │     → gsap.from(textEls, { opacity: 0, y: 40, stagger: 0.1 })
        │
        ├── ProcessTimeline enters viewport
        │     → Timeline phases animate in sequentially
        │     → Progress line draws via scaleX from 0 to 1
        │
        ├── MetricsSection enters viewport
        │     → gsap.to(obj, { val: targetNumber })  (counter animation)
        │     → SVG chart paths animate strokeDashoffset
        │
        └── DeliverablesGallery enters viewport
              → gsap.from(cards, { opacity: 0, y: 60, stagger: 0.15 })
```

### URL / Navigation Flow

```
Hash: #atlas                → Slider, currentIndex = atlas
Hash: #atlas/case-study     → CaseStudyPanel, activeProjectId = 'atlas'
Hash: #pulse                → Slider, currentIndex = pulse
Hash: (empty)               → Slider, currentIndex = 0

Browser back from case study:
  popstate fires
  hash = '#atlas'
  useHashSync: closeCaseStudy(), goToSlide(atlasIndex)
```

---

## Architectural Patterns

### Pattern 1: Overlay Layer, Not Route

**What:** Case study renders as a full-screen layer sitting above the slider, toggled by view store, not by a router.

**When to use:** Single-page showcases where the primary interaction model (the slider) must remain instantly accessible. No URL path changes, no remounting of the entire tree.

**Trade-offs:** The slider DOM always exists in the background (small memory cost). No code-splitting boundary per "page." The upside is zero router overhead, zero transition coordination with route lifecycle, and the ability to instantly kill case study animations on close.

```typescript
// App.tsx — simple layer pattern
function App() {
  const mode = useViewStore((s) => s.mode);
  return (
    <AppShell>
      <Navigation />
      <Slider />  {/* always in DOM, hidden when case study active */}
      {mode === 'case' && <CaseStudyPanel />}
    </AppShell>
  );
}
```

### Pattern 2: Scoped ScrollTrigger Cleanup

**What:** All ScrollTrigger instances for a case study are created inside `CaseStudyPanel`'s `useEffect` and cleaned up on unmount.

**When to use:** Any time ScrollTrigger is used in a component that mounts/unmounts. Critical in this project because the case study panel can open and close multiple times.

**Trade-offs:** Slightly more verbose — every `ScrollTrigger.create()` call needs a stored reference for cleanup. But leaking ScrollTrigger instances causes silent animation bugs that are very hard to debug.

```typescript
// In CaseStudyPanel.tsx
useEffect(() => {
  const triggers: ScrollTrigger[] = [];

  triggers.push(
    ScrollTrigger.create({
      trigger: challengeRef.current,
      scroller: panelRef.current,
      onEnter: () => { /* animate */ },
    })
  );

  return () => {
    triggers.forEach(t => t.kill());
    ScrollTrigger.refresh();
  };
}, [project]);
```

### Pattern 3: Observer Enable/Disable, Not Kill/Recreate

**What:** When entering case study mode, call `observer.disable()`. When returning to slider, call `observer.enable()`. Do NOT kill and recreate.

**When to use:** Any time the GSAP Observer needs to be temporarily suspended.

**Trade-offs:** Requires holding a stable reference to the Observer instance across the component lifecycle. Easier to manage than recreating, and avoids the edge case where a recreation fires before the transition animation completes.

```typescript
// Module-level singleton pattern for the Observer ref
// (avoids passing refs through component boundaries)
let sliderObserver: ReturnType<typeof Observer.create> | null = null;

export function setSliderObserver(obs: typeof sliderObserver) {
  sliderObserver = obs;
}

export function pauseSliderObserver() {
  sliderObserver?.disable();
}

export function resumeSliderObserver() {
  sliderObserver?.enable();
}
```

### Pattern 4: Theme Continuity Across Views

**What:** When the case study opens, `applyTheme(projects[activeIndex])` is called so the case study inherits the project's color palette.

**When to use:** Always — both views reference the same CSS custom properties. This is free visual coherence.

**Trade-offs:** None. The theme is already on `:root`, and the case study reads it via `var(--color-accent)` automatically. No extra wiring needed.

### Pattern 5: Counter Animation via GSAP Object Tween

**What:** To animate a number from 0 to 60 (for "60% réduction"), tween a plain object's property and update the DOM in `onUpdate`.

**When to use:** Any numeric counter animation in the metrics section.

**Trade-offs:** Slightly more code than a CSS counter, but allows easing (ease-out gives the "accelerating then slowing" feel that reads as satisfying to users), locale formatting, and decimal control.

```typescript
// MetricCounter — GSAP-driven, no React state for animation values
function MetricCounter({ animateTo, label, prefix }: MetricData) {
  const numRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: animateTo,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: triggerRef.current, once: true },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix ?? ''}${Math.round(obj.val)}%`;
        }
      },
    });
    return () => tween.kill();
  }, [animateTo, prefix]);

  return <div ref={triggerRef}><span ref={numRef}>0%</span><p>{label}</p></div>;
}
```

---

## Anti-Patterns

### Anti-Pattern 1: Adding React Router

**What people do:** Install React Router v7, convert the app to use `<Route path="/:projectId/case-study">`, rewrite navigation logic.

**Why it's wrong:** The app has zero routing today and the existing hash navigation (`useHashSync`) is purpose-built. A router forces a full app restructure, breaks the GSAP Observer lifecycle model (Observers don't know about route unmounts), and provides no benefit that `pushState` + Zustand doesn't already cover. The project spec explicitly says "standalone showcase page."

**Do this instead:** `useViewStore` + `pushState` + extended `useHashSync`. Same URL behavior, zero framework overhead, zero risk of breaking the existing slider.

### Anti-Pattern 2: Using Window Scroll for Case Study ScrollTrigger

**What people do:** Mount the case study as a full DOM section, let it scroll the window, use `ScrollTrigger` with the default window scroller.

**Why it's wrong:** The Slider is `h-screen overflow-hidden` and the AppShell is `min-h-screen overflow-x-hidden`. The window scroll is currently owned by the slider's Observer. Two things cannot own window scroll simultaneously. Using window scroll for the case study requires the slider to be fully hidden/removed from the layout flow, causing layout shifts.

**Do this instead:** `CaseStudyPanel` is a separate `position: fixed; inset: 0; overflow-y: auto` overlay. Lenis targets this element as its scroll container. ScrollTrigger instances specify `scroller: panelRef.current`. The window scroll is untouched.

### Anti-Pattern 3: Killing and Recreating the GSAP Observer

**What people do:** In Slider cleanup, `obs.kill()`. When returning to slider, recreate with `Observer.create({...})` in a new effect.

**Why it's wrong:** Re-creating the Observer during an in-progress transition can fire gesture events against a half-animated UI. `kill()` also destroys the instance permanently — if something holds a stale reference, calling `.enable()` on a dead instance throws.

**Do this instead:** `obs.disable()` when leaving slider mode. `obs.enable()` when returning. Keep the Observer alive for the app's lifetime.

### Anti-Pattern 4: React State for Scroll Progress

**What people do:** Track scroll position in `useState`, update on scroll, pass to child components as props to drive animations.

**Why it's wrong:** Scroll events fire at 60fps+. Each `setState` call triggers React reconciliation. This is the same problem as using React state for animation values — it causes jank and defeats the purpose of GSAP.

**Do this instead:** `scrollTrigger` callbacks (onUpdate, onEnter, onLeave) update DOM nodes directly via GSAP or direct `.style` mutation. React state only holds coarse boolean flags ("has this section been entered?") at most.

### Anti-Pattern 5: Inline `style` on Animated Elements

**What people do:** Set initial position via `style={{ opacity: 0, transform: 'translateY(40px)' }}` on elements that GSAP will animate.

**Why it's wrong:** On React re-renders (theme changes, view mode changes), React reconciles and resets inline styles, fighting GSAP's transforms. This is the documented "React re-renders overwrite GSAP inline styles" pitfall from the existing project memory.

**Do this instead:** Set initial state via `data-*` CSS rules (as done in the existing slider) or via a `gsap.set()` call inside the animation's `useEffect`, after the component mounts.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Slider ↔ ViewStore | Slider reads `mode`; on mode change, disables Observer | Observer ref must be accessible to view store actions |
| CaseStudyPanel ↔ SliderStore | Reads `currentIndex` to know which project's data to show | No writes — case study is read-only toward slider state |
| useHashSync ↔ ViewStore | Hash parser sets both `currentIndex` and `mode`/`activeProjectId` | Single source of URL truth |
| CaseStudyPanel ↔ ThemeEngine | Panel calls `applyTheme(project)` on mount | Keeps CSS custom properties consistent with open project |
| Lenis ↔ ScrollTrigger | `lenis.on('scroll', ScrollTrigger.update)` + ticker | Standard integration; must be torn down on panel unmount |

### Build Order for This Milestone

The following order respects component dependencies:

```
Step 1: Data Model Extension
  ├── Extend CaseStudyData type in types.ts
  ├── Add placeholder caseStudy content for atlas/pulse/verde
  └── Keep projects.ts backward-compatible (caseStudy is optional)
       Dependencies: None. Everything else depends on having real data.

Step 2: View Store
  ├── useViewStore (mode, activeProjectId, open/close actions)
  └── Extend useHashSync for #id/case-study URL format
       Dependencies: Step 1 data (needs project IDs).

Step 3: Transition Infrastructure
  ├── useCaseStudyTransition hook (GSAP open/close timelines)
  ├── Observer enable/disable wiring in Slider.tsx
  └── App.tsx updated to conditionally render CaseStudyPanel
       Dependencies: Step 2 store.

Step 4: CaseStudyPanel Shell
  ├── CaseStudyPanel.tsx (scroll container, Lenis integration)
  ├── CaseStudyNav.tsx (back button + project title)
  └── Open/close animation verified end-to-end
       Dependencies: Step 3 transitions, Step 1 data.

Step 5: Case Study Sections (each independently buildable)
  ├── ChallengeSection (scroll-triggered text reveals)
  ├── ProcessTimeline (animated phase progression)
  ├── MetricsSection (GSAP counters + simple charts)
  └── DeliverablesGallery (staggered image grid)
       Dependencies: Step 4 CaseStudyPanel scroll context.

Step 6: CTA Wiring on Slides
  ├── Add "Voir l'étude de cas" button to Slide.tsx
  └── Wire to openCaseStudy(project.id) from viewStore
       Dependencies: Step 2 store, Step 4 panel exists.
```

**Rationale:** Data first because all components depend on shape. Store before transitions because transitions call store actions. Panel shell before sections because sections need the scroll context. CTA last because it's an entry point that needs the destination to exist.

---

## Scalability Considerations

| Concern | Current (3 projects) | 12+ projects |
|---------|---------------------|--------------|
| Case study DOM | All in single panel, scrollable | Same — only active project's panel is mounted |
| ScrollTrigger instances | ~8-12 per case study | Same — cleanup on unmount prevents accumulation |
| Data file size | Trivial | Per-project case-study files if needed, lazy imported |
| Transition complexity | Single panel swap | Same — view mode remains binary (slider vs case) |

---

## Sources

- GSAP Observer `enable()`/`disable()` API — [gsap.com/docs/v3/Plugins/Observer/](https://gsap.com/docs/v3/Plugins/Observer/) — HIGH confidence
- GSAP ScrollTrigger custom scroller — [gsap.com/docs/v3/Plugins/ScrollTrigger/](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — HIGH confidence
- Lenis + ScrollTrigger integration — [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) + GSAP community forums — MEDIUM confidence
- Existing codebase (Slider.tsx, useHashSync.ts, useSliderStore.ts, types.ts) — verified by direct read — HIGH confidence
- Project requirements (.planning/PROJECT.md) — HIGH confidence

---

*Architecture research for: Case study integration with existing GSAP slider portfolio*
*Updated: 2026-03-11 (v1.1 milestone — supersedes v1.0 document)*
