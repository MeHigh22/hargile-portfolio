# Phase 2: Slider & Navigation - Research

**Researched:** 2026-03-06
**Domain:** GSAP-driven carousel with multi-input navigation, deep linking, and progress indication
**Confidence:** HIGH

## Summary

Phase 2 transforms the current grid layout into a full-screen, slide-based project carousel driven by GSAP animations. The stack is already decided: GSAP 3.14 with @gsap/react for animation, GSAP Observer plugin for unified input handling (wheel, touch, pointer, keyboard), Zustand 5 for slide state management, and the browser History API for deep linking without a router dependency.

The GSAP Observer plugin is the linchpin -- it normalizes wheel, touch swipe, pointer drag, and keyboard events into a single API with directional callbacks (onUp/onDown/onLeft/onRight). This eliminates the need for separate touch libraries or manual event wiring. Zustand holds the current slide index as the single source of truth, and the URL hash stays in sync via History API pushState/replaceState.

**Primary recommendation:** Build a Zustand store for slide state, wire GSAP Observer for all input methods, animate slide transitions with gsap.to() timelines, and sync hash-based URLs bidirectionally with the store.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | User can browse 12+ projects via smooth slider/carousel with seamless transitions | GSAP gsap.to() with xPercent/opacity transitions; useGSAP hook for lifecycle; Zustand store for current index |
| NAV-02 | User can navigate projects using keyboard arrows, touch swipe, and click controls | GSAP Observer plugin with type: "wheel,touch,pointer" + manual keydown listener; prev/next button click handlers |
| NAV-03 | Each project has a unique URL with browser back/forward support | Hash-based deep linking (#project-id) using History API pushState + popstate listener; Zustand store sync |
| NAV-04 | User can see current position and total count via progress indicator | React component reading Zustand store (currentIndex, totalCount); GSAP-animated progress bar |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.14.2 | Animation engine for slide transitions | Already decided in project stack; industry standard for performant web animation |
| @gsap/react | ^2.1.2 | useGSAP hook for React lifecycle integration | Official GSAP React binding; auto-cleanup via gsap.context() |
| zustand | ^5.0.11 | Slide state management (current index, navigation direction) | Already decided in project stack; minimal boilerplate, no Provider needed |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Conditional class merging | Active slide styling, progress indicator states |
| tailwind-merge | ^3.5.0 | Tailwind class deduplication | Component prop class overrides |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP Observer | Hammer.js / custom touch handlers | Observer is built into GSAP, normalizes all input types in ~3.5kb, no extra dependency |
| Hash-based URLs | react-router | Overkill for single-page carousel; adds 15kb+ for one route; project explicitly excludes multi-page routing |
| Zustand | React useState | Global state needed for URL sync, progress indicator, and future phase integration (color theming) |

### Not Yet Installed (Phase 2 additions)
| Library | Version | Purpose |
|---------|---------|---------|
| gsap | ^3.14.2 | Core animation (Observer plugin included) |
| @gsap/react | ^2.1.2 | useGSAP hook |
| zustand | ^5.0.11 | State management |

**Installation:**
```bash
npm install gsap @gsap/react zustand
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  store/
    useSliderStore.ts        # Zustand store: currentIndex, direction, actions
  components/
    slider/
      Slider.tsx             # Main slider container (useGSAP, Observer setup)
      Slide.tsx              # Individual slide wrapper (receives project data)
      SliderControls.tsx     # Prev/next buttons, keyboard hint
      ProgressIndicator.tsx  # Current/total display with animated bar
  hooks/
    useHashSync.ts           # Bidirectional URL hash <-> store sync
    useKeyboardNav.ts        # Keyboard arrow navigation (if separated from Observer)
```

### Pattern 1: Zustand Slider Store
**What:** Single store holding slide index, total count, animation direction, and transition lock
**When to use:** Always -- this is the central coordination point

```typescript
// src/store/useSliderStore.ts
import { create } from 'zustand';
import { projects } from '../data/projects';

interface SliderState {
  currentIndex: number;
  direction: 1 | -1;
  isAnimating: boolean;
  totalSlides: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setAnimating: (v: boolean) => void;
}

export const useSliderStore = create<SliderState>((set, get) => ({
  currentIndex: 0,
  direction: 1,
  isAnimating: false,
  totalSlides: projects.length,
  goToSlide: (index) => {
    const { currentIndex, isAnimating, totalSlides } = get();
    if (isAnimating || index === currentIndex) return;
    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    set({
      currentIndex: clamped,
      direction: clamped > currentIndex ? 1 : -1,
      isAnimating: true,
    });
  },
  nextSlide: () => {
    const { currentIndex, isAnimating, totalSlides } = get();
    if (isAnimating || currentIndex >= totalSlides - 1) return;
    set({ currentIndex: currentIndex + 1, direction: 1, isAnimating: true });
  },
  prevSlide: () => {
    const { currentIndex, isAnimating } = get();
    if (isAnimating || currentIndex <= 0) return;
    set({ currentIndex: currentIndex - 1, direction: -1, isAnimating: true });
  },
  setAnimating: (v) => set({ isAnimating: v }),
}));
```

### Pattern 2: GSAP Observer for Unified Input
**What:** Single Observer instance handles wheel, touch swipe, and pointer drag
**When to use:** On the slider container element

```typescript
// Inside Slider.tsx, within useGSAP hook
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

// Inside useGSAP callback:
Observer.create({
  target: sliderRef.current,
  type: 'wheel,touch,pointer',
  wheelSpeed: -1,
  tolerance: 10,
  preventDefault: true,
  onUp: () => store.prevSlide(),   // swipe up / scroll up = previous
  onDown: () => store.nextSlide(), // swipe down / scroll down = next
  // OR for horizontal:
  // onLeft: () => store.nextSlide(),
  // onRight: () => store.prevSlide(),
});
```

### Pattern 3: useGSAP with contextSafe Event Handlers
**What:** All GSAP animations inside useGSAP; event handlers wrapped in contextSafe
**When to use:** Always when combining GSAP + React

```typescript
// Source: https://gsap.com/resources/React/
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(() => {
    // Initial animations here -- auto-cleaned on unmount
    gsap.set('.slide', { xPercent: 100 });
    gsap.set('.slide:first-child', { xPercent: 0 });
  }, { scope: containerRef });

  // Event handlers that create animations MUST use contextSafe
  const animateToSlide = contextSafe((index: number, direction: number) => {
    const tl = gsap.timeline({
      onComplete: () => useSliderStore.getState().setAnimating(false),
    });
    tl.to('.slide.active', { xPercent: -100 * direction, duration: 0.8, ease: 'power3.inOut' });
    tl.fromTo(`.slide[data-index="${index}"]`,
      { xPercent: 100 * direction },
      { xPercent: 0, duration: 0.8, ease: 'power3.inOut' },
      '<'
    );
  });

  return <div ref={containerRef}>{/* slides */}</div>;
}
```

### Pattern 4: Hash-Based Deep Linking
**What:** Sync URL hash with slide state bidirectionally without a router
**When to use:** For NAV-03 requirement

```typescript
// src/hooks/useHashSync.ts
import { useEffect } from 'react';
import { useSliderStore } from '../store/useSliderStore';
import { projects } from '../data/projects';

export function useHashSync() {
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const goToSlide = useSliderStore((s) => s.goToSlide);

  // On mount: read hash and navigate to matching project
  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove #
    if (hash) {
      const idx = projects.findIndex((p) => p.id === hash);
      if (idx !== -1) goToSlide(idx);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When currentIndex changes: update hash
  useEffect(() => {
    const project = projects[currentIndex];
    if (project) {
      const newHash = `#${project.id}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }
    }
  }, [currentIndex]);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      const idx = projects.findIndex((p) => p.id === hash);
      if (idx !== -1) goToSlide(idx);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goToSlide]);
}
```

### Anti-Patterns to Avoid
- **Raw useEffect for GSAP:** Always use useGSAP hook. Raw useEffect causes duplicate animations in React 18 strict mode and leaks GSAP instances on unmount.
- **Multiple independent event listeners for each input type:** Use GSAP Observer to unify wheel/touch/pointer. Do not hand-wire touchstart/touchmove/touchend separately.
- **Animating during animation:** Always check `isAnimating` lock before starting new transitions. GSAP can queue conflicting tweens otherwise.
- **Using react-router for hash sync:** The project explicitly avoids multi-page routing. Native History API is sufficient and adds zero bundle size.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Touch/swipe detection | Custom touchstart/touchmove/touchend handlers | GSAP Observer plugin | Handles velocity, direction, tolerance, debouncing; normalizes iOS/Android/pointer differences |
| Animation cleanup in React | Manual gsap.killTweensOf() in useEffect return | useGSAP hook from @gsap/react | Automatic context-based cleanup; handles React 18 strict mode double-mount |
| Slide transition timing | Manual setTimeout/requestAnimationFrame chains | GSAP timelines with onComplete callbacks | Precise sequencing, easing, and completion detection built-in |
| Cross-browser wheel normalization | Custom deltaY normalization | GSAP Observer wheelSpeed option | Already handles browser inconsistencies |

**Key insight:** GSAP Observer replaces what would otherwise be 3-4 separate event systems (wheel, touch, pointer, keyboard) with a single 3.5kb unified API. The isAnimating lock in the store prevents all race conditions.

## Common Pitfalls

### Pitfall 1: React 18 Strict Mode Double Animation
**What goes wrong:** Animations fire twice in development, causing visual glitches and state desync.
**Why it happens:** React 18 strict mode mounts, unmounts, and remounts components in development.
**How to avoid:** Use useGSAP hook exclusively (never raw useEffect for GSAP). It handles cleanup via gsap.context() automatically.
**Warning signs:** Animations appearing doubled or jerky only in dev mode.

### Pitfall 2: Animation Race Conditions
**What goes wrong:** User rapidly clicks next/swipes, queueing multiple conflicting transitions.
**Why it happens:** No guard preventing new animation while current one plays.
**How to avoid:** `isAnimating` boolean in Zustand store; check before every navigation action; set false in GSAP timeline onComplete callback.
**Warning signs:** Slides overlapping, wrong slide showing after rapid input.

### Pitfall 3: Hash/State Desync Loop
**What goes wrong:** Changing the hash triggers popstate which changes the store which changes the hash, creating an infinite loop.
**Why it happens:** Bidirectional sync without loop detection.
**How to avoid:** Compare current hash to target before calling pushState. In the popstate handler, skip if index already matches. Use replaceState for initial load, pushState for user-initiated navigation.
**Warning signs:** Browser freezing, rapid URL flickering, console showing maximum update depth.

### Pitfall 4: Touch Scroll Prevention on Mobile
**What goes wrong:** Touch swipe on the slider also scrolls the page, causing janky double-movement.
**Why it happens:** Default browser scroll behavior not prevented on the slider area.
**How to avoid:** Observer's `preventDefault: true` option handles this. Also ensure the slider container is full-viewport height so there is no scrollable content.
**Warning signs:** Page bouncing or scrolling while swiping between slides on mobile.

### Pitfall 5: Keyboard Events Not Scoped
**What goes wrong:** Arrow key navigation fires even when user is focused on an input or other interactive element.
**Why it happens:** Keyboard listener on window/document without target filtering.
**How to avoid:** Check `event.target` tagName -- skip if INPUT, TEXTAREA, SELECT, or contenteditable. Observer does not handle keyboard by default; add a separate keydown listener.
**Warning signs:** Arrow keys not working for text input elsewhere on page.

## Code Examples

### Slide Transition Animation
```typescript
// Horizontal slide transition with GSAP timeline
function animateSlideTransition(
  currentSlide: HTMLElement,
  nextSlide: HTMLElement,
  direction: 1 | -1,
  onComplete: () => void
) {
  const tl = gsap.timeline({ onComplete });

  // Current slide exits in opposite direction
  tl.to(currentSlide, {
    xPercent: -100 * direction,
    duration: 0.8,
    ease: 'power3.inOut',
  });

  // Next slide enters from direction
  tl.fromTo(
    nextSlide,
    { xPercent: 100 * direction },
    { xPercent: 0, duration: 0.8, ease: 'power3.inOut' },
    '<' // start at same time as previous tween
  );
}
```

### Observer Setup with Debounce Protection
```typescript
// Inside useGSAP callback
Observer.create({
  target: sliderRef.current,
  type: 'wheel,touch,pointer',
  wheelSpeed: -1,
  tolerance: 10,
  dragMinimum: 5,
  preventDefault: true,
  onDown: () => {
    if (!useSliderStore.getState().isAnimating) {
      useSliderStore.getState().nextSlide();
    }
  },
  onUp: () => {
    if (!useSliderStore.getState().isAnimating) {
      useSliderStore.getState().prevSlide();
    }
  },
});
```

### Keyboard Navigation Handler
```typescript
// Separate from Observer since Observer doesn't handle keyboard
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (target.isContentEditable) return;

    const store = useSliderStore.getState();
    if (store.isAnimating) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      store.nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      store.prevSlide();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Progress Indicator Component
```typescript
// src/components/slider/ProgressIndicator.tsx
import { useSliderStore } from '../../store/useSliderStore';

export function ProgressIndicator() {
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const totalSlides = useSliderStore((s) => s.totalSlides);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      <span className="font-mono text-sm text-text-secondary">
        {String(currentIndex + 1).padStart(2, '0')}
      </span>
      <div className="w-32 h-0.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
      <span className="font-mono text-sm text-text-muted">
        {String(totalSlides).padStart(2, '0')}
      </span>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Swiper.js / Slick carousel | Custom GSAP + Observer | 2024-2025 | Full control over transitions; no library-imposed DOM structure |
| react-router for hash nav | Native History API | Always available | Zero bundle cost for single-page hash routing |
| Redux for slide state | Zustand 5 | 2024 (Zustand v5 stable) | 1/10th the boilerplate; no Provider wrapper; direct getState() for non-React code |
| useEffect for GSAP | useGSAP from @gsap/react | 2024 (GSAP free release) | Automatic cleanup, strict mode safe, scope-based selectors |
| Separate touch/wheel/pointer listeners | GSAP Observer | 2022+ | Single API, ~3.5kb, handles all input normalization |

**Deprecated/outdated:**
- Swiper.js: Not deprecated, but overkill and constraining for bespoke portfolio transitions
- GSAP Club plugins behind paywall: As of 2024, ALL GSAP plugins including Observer, SplitText, MorphSVG are 100% free

## Open Questions

1. **Horizontal vs vertical slide direction**
   - What we know: Observer supports both onUp/onDown and onLeft/onRight. The project data model does not constrain this.
   - What's unclear: User preference for horizontal (left/right swipe) vs vertical (up/down scroll-like) navigation.
   - Recommendation: Default to **horizontal** (left/right) as it maps naturally to "next/previous" and avoids confusion with page scrolling. Vertical can be added later if desired.

2. **Wrapping vs clamped navigation**
   - What we know: Current store implementation clamps at 0 and totalSlides-1 (no wrapping).
   - What's unclear: Whether the carousel should wrap around (last -> first, first -> last).
   - Recommendation: Start **clamped** (no wrapping). Wrapping adds animation complexity (infinite loop illusion) and is a v2 feature (ANAV-01 track-picker metaphor). Easier to add later than to debug now.

3. **Number of projects: currently 5, requirement says 12+**
   - What we know: Phase 1 created 5 sample projects. NAV-01 requires 12+.
   - What's unclear: Whether to add more sample projects in this phase or defer to Phase 3 (Content).
   - Recommendation: Add 7-8 more placeholder projects in this phase to verify the slider handles 12+ items. Content details can be refined in Phase 3.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| Config file | Inline in vite.config.ts or standalone vitest.config.ts (needs verification -- not found as separate file, likely inline) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Slide transitions animate between projects | unit (store logic) + manual (visual) | `npx vitest run src/store/__tests__/useSliderStore.test.ts -x` | No -- Wave 0 |
| NAV-02 | Keyboard, touch, click all trigger navigation | unit (store) + manual (input devices) | `npx vitest run src/store/__tests__/useSliderStore.test.ts -x` | No -- Wave 0 |
| NAV-03 | Hash URLs load correct slide; back/forward works | unit (hash sync logic) | `npx vitest run src/hooks/__tests__/useHashSync.test.ts -x` | No -- Wave 0 |
| NAV-04 | Progress indicator shows current/total | unit (component renders correct values) | `npx vitest run src/components/slider/__tests__/ProgressIndicator.test.tsx -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before /gsd:verify-work

### Wave 0 Gaps
- [ ] `src/store/__tests__/useSliderStore.test.ts` -- covers NAV-01, NAV-02 (store logic: nextSlide, prevSlide, goToSlide, isAnimating guard, boundary clamping)
- [ ] `src/hooks/__tests__/useHashSync.test.ts` -- covers NAV-03 (hash parsing, popstate handling)
- [ ] `src/components/slider/__tests__/ProgressIndicator.test.tsx` -- covers NAV-04 (renders current index and total)
- [ ] Vitest config verification -- ensure jsdom environment is configured for component tests

## Sources

### Primary (HIGH confidence)
- [GSAP Observer Plugin Docs](https://gsap.com/docs/v3/Plugins/Observer/) -- full API, configuration options, event callbacks
- [GSAP React Integration Guide](https://gsap.com/resources/React/) -- useGSAP hook usage, contextSafe pattern, scope refs
- [gsap npm](https://www.npmjs.com/package/gsap) -- version 3.14.2 confirmed
- [@gsap/react npm](https://www.npmjs.com/package/@gsap/react) -- version 2.1.2 confirmed
- [zustand npm](https://www.npmjs.com/package/zustand) -- version 5.0.11 confirmed

### Secondary (MEDIUM confidence)
- [Codrops: Mastering Carousels with GSAP](https://tympanus.net/codrops/2025/04/21/mastering-carousels-with-gsap-from-basics-to-advanced-animation/) -- carousel patterns and best practices
- [Zustand GitHub](https://github.com/pmndrs/zustand) -- v5 API patterns

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries confirmed via npm, versions verified, project decisions locked
- Architecture: HIGH -- patterns derived from official GSAP docs and React integration guide
- Pitfalls: HIGH -- documented from official GSAP React guide (strict mode), common carousel engineering patterns

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable libraries, 30-day validity)
