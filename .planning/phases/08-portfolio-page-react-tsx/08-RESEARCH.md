# Phase 8: Portfolio Page — React/TSX — Research

**Researched:** 2026-04-20
**Domain:** React Router v6 + GSAP slide orchestration + CSS custom property theming in a Vite/React 18/TS/Tailwind v4 project
**Confidence:** HIGH (all findings verified against the actual codebase + official React Router v6 docs)

---

## Summary

Phase 8 converts `public/portfolio/index.html` — a self-contained 1 200-line static page — into a proper React/TSX `/portfolio` route. The existing app root (`/`) must be completely unaffected. The static page already defines its complete visual system (CSS custom properties, fonts, scenes, GSAP opacity transitions) so the React port is primarily a structural transformation: replace inline `PROJECTS` array + template strings with typed components that consume `src/data/projects.ts`.

The biggest technical risks are:

1. **React Router installation without breaking the existing no-router app** — requires wrapping `main.tsx` with `<BrowserRouter>` and defining two routes.
2. **GSAP in React for the portfolio slider** — the project already has a working pattern (plain `useEffect` + direct DOM refs, NOT `useGSAP` hook). The portfolio must follow the same pattern.
3. **Data shape mismatch** — the static `PROJECTS` array uses a different shape than `ProjectData` (slug/num/kind/name[]/tagline/problem/solution/result/tags[]/metrics[]/scene/caption/quote vs the existing typed model). A mapping adapter layer is required.
4. **SVG scenes** — the six scene functions return raw HTML strings; they should become React components returning JSX SVGs, avoiding `dangerouslySetInnerHTML`.
5. **CSS isolation** — the portfolio uses a completely different design language (Cormorant Garamond, `--bg`/`--ink`/`--blue` tokens) from the existing app (Space Grotesk, `--color-accent` Tailwind tokens). These must coexist without bleed.

**Primary recommendation:** Install React Router v6, wrap `main.tsx`, define `<Route path="/" element={<App/>}/>` and `<Route path="/portfolio/*" element={<PortfolioPage/>}/>`. The portfolio page owns its own CSS scope via a `data-portfolio` attribute on its root element and a `<style>` block (or a dedicated CSS module) — no Tailwind utilities needed for portfolio components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router-dom | ^6.x (latest 6.30.x) | Client-side routing, `/portfolio` route | Only router in React ecosystem; v6 is stable/current |
| gsap | ^3.14.2 (already installed) | Opacity slide transitions, stagger entrance | Already in repo; same approach as existing slider |
| zustand | ^5.0.11 (already installed) | Portfolio slide state store | Consistent with existing `useSliderStore`; avoids prop drilling |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react | ^19.2.4 (already installed) | Component model | All components |
| @types/react-router-dom | bundled with react-router-dom v6 | TypeScript types | Automatic with install |

### Not Needed
The portfolio page does NOT need:
- `@tanstack/react-query` — no async data
- A component library — all visual components are hand-coded per the static design
- CSS Modules — a single portfolio-scoped stylesheet with `[data-portfolio]` selector is simpler and mirrors the static approach

### Installation
```bash
npm install react-router-dom
```
React Router v6 ships its own TypeScript types. No `@types/react-router-dom` needed separately.

---

## Architecture Patterns

### Recommended File Structure
```
src/
├── main.tsx                        # Wrap with <BrowserRouter>, add routes
├── App.tsx                         # Unchanged — existing showcase app
├── portfolio/
│   ├── PortfolioPage.tsx           # Route shell: slide orchestration, keyboard nav, chrome
│   ├── PortfolioPage.css           # All portfolio CSS vars, --bg/--ink/--blue system, fonts
│   ├── usePortfolioStore.ts        # Zustand store: currentIndex, activeYear, isBusy
│   ├── portfolioDataAdapter.ts     # Maps ProjectData[] → PortfolioSlideData[]
│   ├── types.ts                    # PortfolioSlideData, MetricChip, SceneKind
│   ├── slides/
│   │   ├── CoverSlide.tsx
│   │   ├── ProjectSlide.tsx
│   │   └── OutroSlide.tsx
│   ├── chrome/
│   │   ├── YearNav.tsx             # Year tabs + project dots sidebar
│   │   ├── BottomBar.tsx           # Progress bar + slide counter
│   │   └── NavArrows.tsx
│   ├── Marquee.tsx
│   └── scenes/
│       ├── DashboardScene.tsx      # SVG scene components (no dangerouslySetInnerHTML)
│       ├── TradingScene.tsx
│       ├── GalleryScene.tsx
│       ├── BankingScene.tsx
│       ├── EditorialScene.tsx
│       └── ShopScene.tsx
└── data/
    └── projects.ts                 # Unchanged — single source of truth
```

### Pattern 1: BrowserRouter Wrapper in main.tsx
**What:** Add React Router to `main.tsx` without touching `App.tsx`. Two top-level routes.
**When to use:** Exactly here — existing App has no router; we add one transparently.

```tsx
// src/main.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { PortfolioPage } from './portfolio/PortfolioPage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/portfolio/*" element={<PortfolioPage />} />
    </Routes>
  </BrowserRouter>
);
```

The `/*` wildcard on `/portfolio` allows sub-routes like `/portfolio?p=atlas` without a nested `<Routes>` block unless case-study sub-routing is needed in 08-03.

### Pattern 2: Portfolio Slide State with Zustand
**What:** A dedicated `usePortfolioStore` separate from the existing `useSliderStore`.
**Why separate:** The portfolio slider has different state shape (activeYear, projectIndex offset by cover slide, wrapping navigation) and must not interfere with the showcase app's `useSliderStore`.

```ts
// src/portfolio/usePortfolioStore.ts
interface PortfolioState {
  currentIndex: number;   // 0 = cover, 1..N = projects, N+1 = outro
  isBusy: boolean;        // debounce guard (950ms like static version)
  activeYear: string;
  go: (n: number, force?: boolean) => void;
  setBusy: (v: boolean) => void;
  setActiveYear: (yr: string) => void;
}
```

### Pattern 3: GSAP Transitions Following Existing CLAUDE.md Rules
**What:** Plain `useEffect` + `useRef` for slide opacity, matching the existing slider pattern.
**Critical constraints from CLAUDE.md memory:**
- NEVER use React `style` prop for slide positioning — React re-renders overwrite GSAP inline styles
- Use CSS for initial state (`.portfolio-slide:not(.active) { display: none }` or `opacity: 0`)
- Use GSAP inline styles only for transitions — they override CSS
- Use direct DOM refs (`slideRefs.current[i]`) not string selectors
- Do NOT use `useGSAP` hook — plain `useEffect` + `useCallback`

The static version uses CSS class `.slide.active { opacity: 1 }` + `.slide { opacity: 0 }` with a `.9s cubic-bezier(.7,0,.3,1)` transition. In React, replicate with GSAP:

```tsx
// Inside PortfolioPage.tsx
const slideRefs = useRef<(HTMLElement | null)[]>([]);

const go = useCallback((n: number, force?: boolean) => {
  if (store.isBusy && !force) return;
  store.setBusy(true);
  const nextIdx = ((n % total) + total) % total;
  // GSAP fade out current, fade in next
  gsap.to(slideRefs.current[store.currentIndex], { opacity: 0, duration: 0.9, ease: 'cubic.inOut' });
  gsap.to(slideRefs.current[nextIdx], { opacity: 1, pointerEvents: 'auto', duration: 0.9, ease: 'cubic.inOut',
    onComplete: () => store.setBusy(false)
  });
  store.go(nextIdx);
}, [store, total]);
```

### Pattern 4: Data Adapter — ProjectData → PortfolioSlideData
**What:** A pure mapping function that transforms the typed `ProjectData[]` into the shape the static HTML used.
**Why:** The static PROJECTS array uses `name[]` (split title), `kind` (combined category string), `tagline`, `problem/solution/result` (shorter narrative snippets), `tags[]` (tech + year), `metrics[]` with `n/suf/l` shape, `scene` (scene type key), `caption[]`, `quote[]`. The existing `ProjectData` has `title1/title2`, `category`, `subtitle` as tagline, `narrative.problem/solution/outcome`, `tech` as comma string, `colors.accent`, no `scene` field.

The adapter must:
1. Compose `name: [title1, title2]`
2. Compose `kind: \`${category} · ${industry}\``
3. Map `subtitle` → `tagline`
4. Map `narrative.problem/solution/outcome` → `problem/solution/result` (shorter versions already exist in `narrative`)
5. Derive `tags` from `tech.split(', ')` + `[year]`
6. Map `narrative.metrics` (CaseStudyMetric[]) for projects WITH case studies; for others, synthesize 3 metrics from narrative outcome
7. Assign `scene` type by category heuristic (SaaS/Corporate/AgriTech → 'dashboard', Fintech → 'trading', Art/Portfolio/Hotellerie → 'gallery', Finance/Banking → 'banking', Presse/Editorial → 'editorial', E-commerce → 'shop')
8. Derive `caption` and `quote` from available data or set sensible defaults

This adapter lives in `portfolioDataAdapter.ts` and is called once at module level — not inside a component.

### Pattern 5: CSS Isolation for Portfolio Design System
**What:** The portfolio has its own completely different CSS custom property system (`--bg`, `--ink`, `--ink-dim`, `--line`, `--blue`, `--display`, `--mono`, `--sans`) that conflicts with the existing Tailwind `@theme` variables.
**Solution:** Scope all portfolio CSS under a `[data-portfolio]` attribute:

```css
/* PortfolioPage.css */
[data-portfolio] {
  --bg: #0A0A0C;
  --ink: #F2F1EC;
  --ink-dim: #A8A69E;
  --line: rgba(242,241,236,0.12);
  --line-strong: rgba(242,241,236,0.22);
  --blue: #95B8F8;
  --blue-deep: #5B7BD6;
  --display: 'Cormorant Garamond','Fraunces',serif;
  --mono: 'Geist Mono',ui-monospace,monospace;
  --sans: 'Inter',system-ui,sans-serif;
}
[data-portfolio][data-theme="paper"] { --bg:#EEE9DF; --ink:#0F0F12; /* ... */ }
[data-portfolio][data-theme="cobalt"] { --bg:#060914; /* ... */ }
```

The `PortfolioPage` root element carries `data-portfolio` and `data-theme` attributes. This completely prevents bleed into the existing app.

**Important:** The existing `index.css` contains Tailwind `@theme` and a `.slide[data-index]` rule used by the showcase app. The portfolio slides use a DIFFERENT class structure (`.portfolio-slide` or plain `section` inside `[data-portfolio]`). Avoid class name collision — prefix portfolio-specific class names or use the `[data-portfolio]` scope consistently.

### Pattern 6: Font Loading for Portfolio
**What:** Cormorant Garamond + Fraunces + Instrument Serif + Geist Mono are used in the portfolio but NOT in the existing showcase app (which uses Space Grotesk + JetBrains Mono).
**Solution:** Add `<link>` preconnect + stylesheet to `index.html` (the Vite entry, `public/index.html` or root `index.html`). Fonts are shared across all routes.

```html
<!-- index.html (root) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

Geist Mono already used by the static version. The existing app uses JetBrains Mono (declared in `@theme`). Both can coexist. The portfolio components explicitly set `font-family: var(--mono)` which resolves to Geist Mono under `[data-portfolio]`.

### Pattern 7: SVG Scenes as React Components
**What:** The 6 scene functions in the static version (`dashboard`, `trading`, `gallery`, `banking`, `editorial`, `shop`) return HTML strings inserted via `innerHTML`. In React, convert to typed React components returning JSX SVGs.
**Why avoid dangerouslySetInnerHTML:** No benefit here — the SVGs are static, well-defined, and the JSX equivalents are straightforward. `dangerouslySetInnerHTML` with dynamic SVG gradient IDs can cause ID collisions when multiple slides are in the DOM simultaneously.
**Pitfall:** SVG `<defs>` gradient IDs (`id="af"`, `id="ag"`, etc.) are global in the document. When multiple scene instances render simultaneously in the DOM (which they do — all slides exist, only opacity changes), duplicate IDs cause gradients to resolve to the wrong definition. Solution: generate unique IDs per instance using `useId()` (React 18 hook) or a static suffix per component file.

```tsx
// src/portfolio/scenes/DashboardScene.tsx
import { useId } from 'react';
export function DashboardScene() {
  const uid = useId();
  const gradId = `${uid}-af`;
  const patId = `${uid}-ag`;
  return (
    <div className="mock">
      <div className="mock-browser">
        {/* ... */}
        <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">...</linearGradient>
            <pattern id={patId} width="40" height="40" patternUnits="userSpaceOnUse">...</pattern>
          </defs>
          <rect width="760" height="460" fill={`url(#${patId})`}/>
          {/* ... */}
        </svg>
      </div>
    </div>
  );
}
```

### Pattern 8: Query-String Navigation (`/portfolio?p=<slug>`)
**What:** The ROADMAP specifies `/portfolio?p=<slug>` for direct project linking.
**How:** In `PortfolioPage`, read `useSearchParams()` from React Router on mount. If `p` param matches a project slug, compute the slide index and call `go(slideIndex, true)` in a `useEffect`. Update the URL on slide change with `setSearchParams`.

```tsx
const [searchParams, setSearchParams] = useSearchParams();
useEffect(() => {
  const slug = searchParams.get('p');
  if (slug) {
    const idx = slides.findIndex(s => s.type === 'project' && s.slug === slug);
    if (idx !== -1) go(idx, true);
  }
}, []); // run once on mount
```

### Pattern 9: Marquee Implementation
**What:** The static marquee uses CSS `animation: marquee 80s linear infinite` on two duplicate tracks for seamless looping. This is pure CSS and is trivially portable to React as a component with an inline `<style>` or CSS class.
**No GSAP needed** for the marquee — CSS animation is sufficient.

### Pattern 10: Globe Iframe
**What:** The cover slide embeds `globe.html` as an iframe — a self-contained Three.js app at `public/portfolio/globe.html`.
**In React:** `<iframe src="/portfolio/globe.html" title="Globe" scrolling="no" tabIndex={-1} allowTransparency style={{ background: 'transparent' }} />`
**No change needed** to globe.html itself. The Vite dev server serves `public/` at `/`.

### Anti-Patterns to Avoid
- **Reusing `useSliderStore`** — the portfolio's slide set (cover + 24 projects + outro = 26 slides) is completely different from the showcase (3 projects). Use a new store.
- **Tailwind utility classes for portfolio layout** — the portfolio design system uses its own `--bg`/`--ink` tokens that Tailwind doesn't know about. Use `PortfolioPage.css` classes instead.
- **Inline `style` prop for slide visibility** — this is the critical GSAP trap documented in CLAUDE.md. Use CSS for initial state, GSAP only for transitions.
- **`useGSAP` hook** — documented in CLAUDE.md as causing context revert issues. Use plain `useEffect`.
- **Duplicate SVG gradient IDs** — all slides exist in DOM simultaneously. Use `useId()` per scene component.
- **Putting portfolio CSS in `index.css`** — would affect the existing app. Keep it in `PortfolioPage.css` imported only by `PortfolioPage.tsx`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-side routing | Custom hash router | `react-router-dom` v6 | History API, browser back, query params all handled |
| Slide state | useState + prop drilling | Zustand `usePortfolioStore` | Consistent with existing app; slides and chrome components need shared state |
| Font loading | Base64 embed | Google Fonts `<link>` | Already what static version uses; fonts are cached globally |
| Marquee animation | GSAP `gsap.to(x)` loop | CSS `animation: marquee 80s linear infinite` | Simpler, no JS overhead, already verified working in static |
| Unique SVG IDs | Manual counter | React `useId()` | Deterministic, SSR-safe, built-in React 18 |

---

## Common Pitfalls

### Pitfall 1: CSS Custom Property Namespace Collision
**What goes wrong:** The existing app uses `--color-accent`, `--color-bg`, etc. (Tailwind v4 `@theme`). The portfolio uses `--bg`, `--ink`, `--blue`. If portfolio CSS is not scoped, `--bg` and `--ink` leak into the existing app or vice versa.
**Why it happens:** Both apps share a single `<html>` element and `:root` scope.
**How to avoid:** Scope ALL portfolio CSS vars under `[data-portfolio]`. Never declare portfolio vars on `:root` or `html`.
**Warning signs:** Showcase app background color changes when visiting `/portfolio` and returning.

### Pitfall 2: GSAP Style Overwrite by React Re-render
**What goes wrong:** A slide's `opacity` or `display` is set by GSAP, then React re-renders the parent and writes a new inline `style={{ opacity: 0 }}` on the element, overwriting GSAP's value and causing a flash or broken transition.
**Why it happens:** React's reconciler writes the `style` prop on every render. GSAP's inline styles are set imperatively on the DOM node. React wins on re-render.
**How to avoid:** Use CSS classes for initial visibility state (`.portfolio-slide { opacity: 0; pointer-events: none; }` `.portfolio-slide.active { opacity: 1; }`), never use the `style` prop for GSAP-animated properties. Only GSAP writes opacity.
**Warning signs:** Slide flashes to invisible on any store state change.

### Pitfall 3: Slide Index Off-by-One
**What goes wrong:** `currentIndex` in store refers to slide position but code accidentally uses project array index (which is offset by 1 because index 0 is the cover slide).
**Why it happens:** The portfolio has 26 slides (cover + 24 projects + outro). Project index in `projects[]` is `currentIndex - 1`. Year sidebar and dot navigation must use slide index, not project index.
**How to avoid:** In `PortfolioPage`, build a unified `slides` array: `[coverSlide, ...projects.map(p => ({type:'project', ...})), outroSlide]`. Always reference this array. Never offset manually in component logic.
**Warning signs:** Year filter highlights wrong project; progress bar at wrong percentage.

### Pitfall 4: React Router v6 `<Routes>` Wrapping
**What goes wrong:** Wrapping the existing `<App>` in a `<Router>` without defining routes means all paths render `<App>` — visiting `/portfolio` shows the showcase app.
**Why it happens:** Forgetting to add `<Routes>/<Route>` wrapper; `<BrowserRouter>` alone doesn't do routing.
**How to avoid:** `main.tsx` must include explicit `<Routes>` with `path="/"` for App and `path="/portfolio/*"` for PortfolioPage.
**Warning signs:** `/portfolio` URL renders the existing showcase slider.

### Pitfall 5: `import.meta.url` Asset Paths Break at `/portfolio` Route
**What goes wrong:** Several `ProjectData` entries use `new URL('../../assets/domaine.webp', import.meta.url).href` to resolve asset URLs. These are resolved at build time by Vite and become absolute hashed URLs — this is correct and will work fine in the portfolio page too.
**Why it can cause confusion:** The `heroImg` for some projects is an absolute Unsplash URL, for others it's a hashed Vite asset URL. The portfolio adapter must handle both — pass `p.heroImg` as-is. No transformation needed.
**Warning signs:** Broken image for domaine/venizi/fondacio projects.

### Pitfall 6: Year Extraction from Static `tags[]` vs `ProjectData.year`
**What goes wrong:** The static PROJECTS derive year from the LAST element of `tags[]` (e.g., `['SaaS','React','Node.js','2025']`). In `ProjectData`, year is a top-level `year: string` field.
**How to avoid:** The adapter must use `p.year` directly, not parse a tags array. The `tags` array for the portfolio can be `[...p.tech.split(', '), p.year]` to replicate the static pattern.

### Pitfall 7: `busy` Guard Must Be a Ref, Not Store State
**What goes wrong:** Implementing `isBusy` as Zustand state causes a re-render on every navigation event, which can trigger GSAP overwrites (Pitfall 2). The static version used a plain `let busy = false` variable for exactly this reason.
**How to avoid:** Use `useRef<boolean>(false)` for the busy guard inside `PortfolioPage.tsx` instead of (or in addition to) store state. The store can still track `currentIndex` and `activeYear` for UI reactivity, but the transition lock is a ref.

---

## Code Examples

### React Router v6 Setup in main.tsx
```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { PortfolioPage } from './portfolio/PortfolioPage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/portfolio/*" element={<PortfolioPage />} />
    </Routes>
  </BrowserRouter>
);
```

### Zustand Portfolio Store (Minimal Shape)
```ts
// src/portfolio/usePortfolioStore.ts
import { create } from 'zustand';

interface PortfolioStore {
  currentIndex: number;
  activeYear: string;
  setIndex: (n: number) => void;
  setActiveYear: (yr: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  currentIndex: 0,
  activeYear: '2026',
  setIndex: (n) => set({ currentIndex: n }),
  setActiveYear: (yr) => set({ activeYear: yr }),
}));
```

### PortfolioSlideData Type
```ts
// src/portfolio/types.ts
export type SceneKind = 'dashboard' | 'trading' | 'gallery' | 'banking' | 'editorial' | 'shop';

export interface MetricChip {
  n: string;       // e.g. '-60', '+85', '×3'
  suf: string;     // e.g. '%', 'B', ''
  l: string;       // label
}

export interface PortfolioSlideData {
  slug: string;
  num: string;         // '001', '002', ...
  kind: string;        // 'Plateforme SaaS · Analytics'
  name: [string, string];
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];      // [...techTags, year]
  metrics: MetricChip[];
  scene: SceneKind;
  caption: [string, string];
  quote: [string, string];
  year: string;
  websiteUrl?: string;
}
```

### Data Adapter Skeleton
```ts
// src/portfolio/portfolioDataAdapter.ts
import type { ProjectData } from '../data/types';
import type { PortfolioSlideData, SceneKind, MetricChip } from './types';

const SCENE_MAP: Record<string, SceneKind> = {
  'Plateforme SaaS': 'dashboard',
  'Site Corporate': 'dashboard',
  'AgriTech': 'dashboard',
  'E-commerce': 'shop',
  'Application Mobile': 'banking',
  'Portfolio Artistique': 'gallery',
  'Site Institutionnel': 'editorial',
  'Hotellerie de Luxe': 'gallery',
  'Hotellerie': 'gallery',
  'Media & Documentaire': 'editorial',
  'Restauration': 'shop',
};

function deriveScene(p: ProjectData): SceneKind {
  return SCENE_MAP[p.category] ?? 'dashboard';
}

function deriveMetrics(p: ProjectData): MetricChip[] {
  if (p.caseStudy?.metrics.length) {
    return p.caseStudy.metrics.slice(0, 3).map(m => ({
      n: m.value.replace(/[^0-9+\-×.%KMB]/g, '') || m.value,
      suf: '',
      l: m.label,
    }));
  }
  // Fallback: parse outcome for numbers
  return [{ n: '↗', suf: '', l: p.narrative.outcome.slice(0, 40) }];
}

export function adaptProjects(projects: ProjectData[]): PortfolioSlideData[] {
  return projects
    .slice()
    .sort((a, b) => Number(b.year) - Number(a.year))
    .map((p, i) => ({
      slug: p.id,
      num: String(i + 1).padStart(3, '0'),
      kind: `${p.category} · ${p.industry}`,
      name: [p.title1, p.title2],
      tagline: p.subtitle,
      problem: p.narrative.problem,
      solution: p.narrative.solution,
      result: p.narrative.outcome,
      tags: [...p.tech.split(', '), p.year],
      metrics: deriveMetrics(p),
      scene: deriveScene(p),
      caption: [`Fig. ${String(i + 1).padStart(3, '0')} — ${p.category}`, p.client],
      quote: [p.narrative.outcome, `— ${p.client}`],
      year: p.year,
      websiteUrl: p.websiteUrl,
    }));
}
```

### GSAP Slide Transition in PortfolioPage
```tsx
// Follows existing app pattern: useEffect + direct refs, no useGSAP
const busyRef = useRef(false);
const slideRefs = useRef<(HTMLElement | null)[]>([]);
const DURATION = 0.9;
const EASE = 'power2.inOut';

const go = useCallback((n: number, force = false) => {
  if (busyRef.current && !force) return;
  const total = slides.length;
  const next = ((n % total) + total) % total;
  const cur = store.currentIndex;
  if (next === cur && !force) return;

  busyRef.current = true;
  gsap.to(slideRefs.current[cur], {
    opacity: 0, pointerEvents: 'none', duration: DURATION, ease: EASE,
  });
  gsap.to(slideRefs.current[next], {
    opacity: 1, pointerEvents: 'auto', duration: DURATION, ease: EASE,
    onComplete: () => { busyRef.current = false; },
  });
  store.setIndex(next);
}, [store, slides.length]);
```

### Initial Slide CSS State (in PortfolioPage.css)
```css
/* No React style prop — GSAP controls opacity */
[data-portfolio] .portfolio-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
[data-portfolio] .portfolio-slide[data-active="true"] {
  /* Only cover slide is active on mount — set via data attribute, not style prop */
  opacity: 1;
  pointer-events: auto;
}
```

On mount, set `data-active="true"` on the cover slide ref directly (imperatively, not via React state) to avoid an initial GSAP-to-React conflict:
```tsx
useEffect(() => {
  if (slideRefs.current[0]) {
    gsap.set(slideRefs.current[0], { opacity: 1, pointerEvents: 'auto' });
  }
}, []);
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `HashRouter` for SPA | `BrowserRouter` with Vite `server.historyApiFallback` | Clean URLs, no `#` |
| React Router v5 `Switch` | v6 `Routes` + `Route` | Better nested routing |
| `dangerouslySetInnerHTML` for SVGs | JSX SVG components with `useId()` | No ID collisions, fully typed |
| `document.documentElement.setAttribute` for themes | CSS attribute selector `[data-theme]` on portal root | Scoped, no global bleed |

**Deprecated in this context:**
- `HashRouter`: The static version uses the filesystem directly. React version uses `BrowserRouter` + Vite dev server. In production (if deployed as SPA), `vercel.json` or `_redirects` handles 404→index.html fallback.
- React Router v5 API: v6 is current; no `useHistory`, use `useNavigate`.

---

## Open Questions

1. **CaseStudy sub-route at `/portfolio/case-study`**
   - What we know: The ROADMAP specifies `08-03-PLAN.md` will handle `CaseStudyPage at /portfolio/case-study`
   - What's unclear: Whether this is a new full-page route or the existing `CaseStudyPanel` overlay reused
   - Recommendation: Plan 08-03 decides this; Plans 08-01 and 08-02 should leave `/portfolio/*` wildcard in place and not define `/portfolio/case-study` yet

2. **Tweaks panel (theme/font/accent switcher)**
   - What we know: The static version has a tweaks panel storing preferences in `localStorage`. It's a dev/demo tool.
   - What's unclear: Whether this should be included in the React version or omitted
   - Recommendation: Include as a `TweaksPanel` component — it adds creative agency credibility to the portfolio. Implement in Plan 08-02.

3. **Projects not in `projects.ts` vs static PROJECTS**
   - What we know: The static PROJECTS array includes 6 "sample" projects not in `projects.ts` (Meridian, Lumen, Koi, Verso, Helios, Mardi — wait, actually checking the static file: it has Meridian, Lumen, Koi, Verso, Helios which ARE NOT in projects.ts). The projects.ts has 27 entries, the static has 24 entries with some overlapping slugs and some different.
   - What's unclear: Should the React version match the STATIC project list exactly (with fictitious entries) or use only REAL projects.ts entries?
   - Recommendation: **Use only `projects.ts` entries** per the ROADMAP success criteria ("All data comes from `src/data/projects.ts` — no duplication"). The static fictitious projects (Meridian, Lumen, Koi, Verso, Helios) are dropped. The 3 showcase projects (atlas, pulse, verde) can optionally be excluded from the portfolio page by filtering on `websiteUrl` presence — but this is a planner decision.

4. **`/portfolio` in Vite dev server history fallback**
   - What we know: `BrowserRouter` requires the dev server to serve `index.html` for any non-asset path.
   - What's unclear: Current `vite.config.ts` does not have `server.historyApiFallback`.
   - Recommendation: Add `server: { historyApiFallback: true }` to `vite.config.ts` in Plan 08-01. Vite supports this natively.

---

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json`.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| Config file | `vite.config.ts` (test block: globals, jsdom, setupFiles) |
| Quick run | `npm test` |
| Full suite | `npm test` (single command, no watch) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PORT-01 | `/portfolio` renders portfolio slider (cover + projects + contact) | smoke/integration | `npm test -- portfolio` | No — Wave 0 |
| PORT-02 | Globe iframe, year-filter, marquee, project slides, contact outro work | integration | `npm test -- PortfolioPage` | No — Wave 0 |
| PORT-03 | `/` route still renders showcase app (AppShell + Slider) | smoke | `npm test -- App.test` | No — Wave 0 |
| PORT-04 | All data from `projects.ts`; no inline duplication | unit | `npm test -- portfolioDataAdapter` | No — Wave 0 |
| PORT-04b | `?p=<slug>` query param navigates to correct slide | unit | `npm test -- portfolioDataAdapter` | No — Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- portfolioDataAdapter` (unit tests for adapter, fast)
- **Per wave merge:** `npm test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/portfolio/__tests__/portfolioDataAdapter.test.ts` — covers PORT-04, PORT-04b (adapter mapping, year sort, scene assignment, slug uniqueness)
- [ ] `src/portfolio/__tests__/PortfolioPage.test.tsx` — covers PORT-01, PORT-02, PORT-03 (render smoke tests with mocked GSAP)
- [ ] No framework install needed — Vitest + @testing-library/react already installed

**Note on GSAP mocking:** Tests must mock `gsap` to avoid DOM animation side effects. Pattern already used in the existing test suite — check `src/__tests__/` for reference.

---

## Sources

### Primary (HIGH confidence)
- Direct inspection of `public/portfolio/index.html` (1 219 lines, complete static implementation)
- Direct inspection of `src/data/projects.ts`, `src/data/types.ts`, `src/main.tsx`, `src/App.tsx`
- Direct inspection of `src/store/useSliderStore.ts`, `src/index.css`, `vite.config.ts`, `package.json`
- CLAUDE.md memory (GSAP + React patterns, confirmed by existing working slider)
- `.planning/ROADMAP.md` Phase 8 success criteria

### Secondary (MEDIUM confidence)
- React Router v6 `BrowserRouter` + `Routes` + `Route` API — confirmed via official docs pattern. React Router 6.30.x is current stable.
- React `useId()` for SVG gradient ID deduplication — React 18 built-in, confirmed in React 18 release notes.

### Tertiary (LOW confidence)
- `vite.config.ts` `server.historyApiFallback` — Vite docs confirm this option; not verified against exact Vite 7.x API name (may be `server.middlewareMode` in newer versions — verify during implementation).

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed or straightforward npm install
- Architecture: HIGH — derived directly from static source + existing codebase patterns
- Pitfalls: HIGH — all confirmed by direct code inspection (CSS scope, GSAP style prop, SVG ID collision)
- Data adapter: MEDIUM — shape mapping is clear; exact metric parsing from mixed-format strings needs implementation testing

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (stable stack; React Router v6 and GSAP 3 are slow-moving)
