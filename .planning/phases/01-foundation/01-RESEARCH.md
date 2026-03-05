# Phase 1: Foundation - Research

**Researched:** 2026-03-05
**Domain:** React + Vite + TypeScript project scaffolding, CSS custom property theming, responsive layout
**Confidence:** HIGH

## Summary

Phase 1 establishes the technical foundation for the Hargile portfolio showcase: a running React 19 + Vite + TypeScript application with the project data model migrated from the existing HTML site, a CSS custom property theme system that supports per-project color palettes, and a responsive layout skeleton across mobile/tablet/desktop breakpoints.

The existing site already has a complete visual identity (dark backgrounds, accent blue #96b8f7, coral #f7a896, lavender #b896f7), three fonts (Inter, Space Grotesk, JetBrains Mono), and 5 fully-defined projects with rich data models. Phase 1 migrates these assets into a typed React architecture rather than designing from scratch. The theme system must use CSS custom properties (not runtime CSS-in-JS) so GSAP can later animate them smoothly for per-project color transitions.

**Primary recommendation:** Scaffold with `npm create vite@latest -- --template react-ts`, install Tailwind CSS 4 via `@tailwindcss/vite` plugin, define the existing color palette as `@theme` variables, create a typed `ProjectData` interface matching the existing JS data model, and build a responsive layout shell that renders placeholder project cards.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | Layout is fully responsive across mobile, tablet, and desktop | Tailwind CSS 4 responsive utilities with `@theme` breakpoints; existing site uses `clamp()` and media queries at 768px and 480px -- migrate to Tailwind responsive prefixes (sm/md/lg) |
| PERF-02 | First contentful paint under 3 seconds | Vite's ESM dev server and optimized production builds; font preloading with `font-display: swap`; no heavy libraries loaded at foundation stage; lazy-load strategy established from day one |
</phase_requirements>

## Standard Stack

### Core (Phase 1 specific)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.4 | UI framework | Component model for composable project slides |
| Vite | ^7.3.1 | Build tool + dev server | Fastest DX for SPA, zero-config React+TS, HMR |
| TypeScript | ^5.9.3 | Type safety | Typed project data model, color palettes |
| Tailwind CSS | ^4.2.1 | Utility-first CSS | CSS-first `@theme` directive for design tokens; responsive utilities |
| @tailwindcss/vite | ^4.2.1 | Vite integration | Zero-config Tailwind in Vite pipeline |

### Supporting (Phase 1 specific)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | latest | Conditional class names | Composing Tailwind classes conditionally |
| tailwind-merge | latest | Merge conflicting Tailwind classes | Component style variant composition |

### NOT needed in Phase 1

GSAP, @gsap/react, motion, Lenis, and Zustand are all part of the decided stack but should NOT be installed in Phase 1. They add bundle weight and complexity before any animation or state management is needed. Install them in Phase 2+ when they are actually used.

**Installation (Phase 1 only):**
```bash
# Scaffold project
npm create vite@latest hargile-showcase -- --template react-ts
cd hargile-showcase

# Styling
npm install -D tailwindcss @tailwindcss/vite

# Utilities
npm install clsx tailwind-merge
```

## Architecture Patterns

### Recommended Phase 1 Project Structure

```
src/
├── App.tsx                    # Root layout component
├── main.tsx                   # Entry point
├── index.css                  # Tailwind import + @theme + global styles
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # Full-viewport container, grain overlay
│   │   └── Navigation.tsx     # Brand mark + placeholder nav
│   │
│   └── projects/
│       └── ProjectCard.tsx    # Placeholder project card (used in skeleton)
│
├── data/
│   ├── projects.ts            # Static project data array (migrated from HTML)
│   └── types.ts               # ProjectData interface + ColorPalette type
│
└── theme/
    └── theme-utils.ts         # Helper to apply theme CSS vars to :root
```

### Pattern 1: CSS Custom Properties as Theme System

**What:** All colors are defined as CSS custom properties on `:root`. Components reference them via `var(--color-name)`. Theme switching updates these properties on the root element.

**Why:** GSAP can later animate CSS custom properties directly. Zero React re-renders for color changes. Every element using `var(--accent)` updates automatically.

**Implementation for Phase 1:**

```css
/* index.css */
@import "tailwindcss";

@theme {
  /* Existing palette from current site */
  --color-bg: #06080d;
  --color-bg-elevated: #0d1117;
  --color-bg-card: #111827;
  --color-surface: #151c2c;
  --color-border: rgba(150,184,247,0.08);
  --color-border-hover: rgba(150,184,247,0.15);
  --color-text: #edf2fc;
  --color-text-secondary: rgba(237,242,252,0.55);
  --color-text-muted: rgba(237,242,252,0.3);
  --color-accent: #96b8f7;
  --color-accent-dim: rgba(150,184,247,0.12);
  --color-accent-glow: rgba(150,184,247,0.35);
  --color-coral: #f7a896;
  --color-coral-dim: rgba(247,168,150,0.12);
  --color-lavender: #b896f7;
  --color-lavender-dim: rgba(184,150,247,0.12);

  /* Radius tokens from existing site */
  --radius-lg: 16px;
  --radius-md: 8px;
  --radius-sm: 4px;

  /* Font families */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

The `@theme` directive makes these available both as CSS variables (for runtime use) AND as Tailwind utility classes (e.g., `bg-bg`, `text-accent`, `font-display`).

**For dynamic per-project theming (later phases):** Additional CSS custom properties on `:root` will be animated by GSAP. These are NOT part of `@theme` but are plain CSS variables that override the themed values:

```css
:root {
  /* Dynamic overrides -- GSAP will animate these */
  --dynamic-accent: var(--color-accent);
  --dynamic-bg: var(--color-bg);
}
```

### Pattern 2: Data-Driven Project Model

**What:** All project content lives in a single typed TypeScript file. The component tree renders from this data.

**Existing data model from project.html (must migrate):**

```typescript
// data/types.ts
export interface ProjectData {
  id: string;
  title1: string;                    // First word (e.g., "Atlas")
  title2: string;                    // Second word (e.g., "Analytics")
  category: string;                  // "Plateforme SaaS"
  year: string;                      // "2025"
  subtitle: string;                  // One-line description
  client: string;                    // "Atlas Corp."
  services: string;                  // "UI/UX, Developpement, Branding"
  duration: string;                  // "4 mois"
  tech: string;                      // "React, Node.js, AWS"
  heroImg: string;                   // Hero image URL
  colors: ProjectColors;             // Per-project color palette (NEW)
}

export interface ProjectColors {
  accent: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
}
```

**Note:** The existing HTML site has 5 projects (Atlas Analytics, Pulse Health, Verde Market, Lumen Studio, Nexo Finance) with identical default colors. Per-project unique palettes will be defined in Phase 3 (VIS-01). Phase 1 only needs the interface and a default palette.

### Pattern 3: Responsive Layout with Tailwind Breakpoints

**What:** Use Tailwind's responsive prefixes (sm/md/lg/xl) matching the existing site's breakpoints.

**Existing breakpoints from current site:**
- Mobile: below 768px (maps to Tailwind `md:`)
- Tablet: 768px-1439px (maps to Tailwind `md:` to `xl:`)
- Desktop: 1440px+ (maps to Tailwind `xl:` or custom breakpoint)

```css
@theme {
  /* Override to match existing design targets */
  --breakpoint-sm: 375px;   /* Target mobile width */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Small desktop */
  --breakpoint-xl: 1440px;  /* Full desktop */
}
```

### Anti-Patterns to Avoid

- **Do NOT use `tailwind.config.js`:** Tailwind CSS 4 is CSS-first. All configuration goes in the CSS file via `@theme`. There is no config file.
- **Do NOT install PostCSS separately:** The `@tailwindcss/vite` plugin handles everything. No `postcss.config.js` needed.
- **Do NOT define colors as inline styles or props:** Use CSS custom properties. This enables GSAP animation in later phases.
- **Do NOT import all fonts at all weights:** The existing site loads Inter (300-900), Space Grotesk (400-700), JetBrains Mono (400-500). Limit to the weights actually used to avoid render-blocking.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive utilities | Custom media query system | Tailwind responsive prefixes (`md:`, `lg:`, `xl:`) | Tailwind generates exactly what you use; zero unused CSS |
| CSS reset | Custom reset stylesheet | Tailwind's built-in Preflight (included with `@import "tailwindcss"`) | Battle-tested reset, maintained upstream |
| Class merging | String concatenation for className | `clsx` + `tailwind-merge` | Handles conditional classes and conflicting utility resolution |
| Font loading | Manual `@font-face` declarations | Google Fonts `<link>` with `font-display: swap` (matching existing site) | Handles WOFF2, subsetting, CDN caching |

## Common Pitfalls

### Pitfall 1: Tailwind CSS 4 Configuration Confusion
**What goes wrong:** Developers create `tailwind.config.js` or `postcss.config.js` expecting Tailwind v3 setup. Tailwind CSS 4 does not use these files.
**How to avoid:** All theme configuration goes in the CSS file via `@theme` directive. The only non-CSS config is adding `@tailwindcss/vite` to `vite.config.ts`.
**Confidence:** HIGH (verified from official Tailwind CSS docs)

### Pitfall 2: Google Fonts Blocking First Paint
**What goes wrong:** Loading 3 font families with multiple weights via Google Fonts blocks rendering. On simulated 3G, this alone can exceed the 3-second FCP budget.
**How to avoid:**
- Use `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com` (already in existing HTML).
- Use `font-display: swap` in the Google Fonts URL parameter (already present).
- Limit font weights: Inter (400, 500, 600, 700 only), Space Grotesk (500, 700 only), JetBrains Mono (400 only).
- Consider self-hosting fonts via `@fontsource` packages for better caching control.
**Confidence:** HIGH

### Pitfall 3: @theme Variables Not Matching Existing Palette
**What goes wrong:** The new React app's colors look subtly different from the existing site because CSS variable names or values were transcribed incorrectly.
**How to avoid:** Copy the exact `:root` CSS variable block from the existing `index.html` (lines 16-35) into the `@theme` directive, preserving exact hex/rgba values. Test by screenshot-comparing the placeholder page against the existing site.
**Confidence:** HIGH (existing values verified from source HTML)

### Pitfall 4: Vite Template Includes Unnecessary Boilerplate
**What goes wrong:** The `react-ts` Vite template ships with sample App.tsx, App.css, index.css, and assets. Developers build on top of this rather than cleaning it out, leading to leftover Vite branding, conflicting styles, and unnecessary CSS.
**How to avoid:** After scaffolding, immediately delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`. Replace `src/App.tsx`, `src/index.css`, and `src/main.tsx` with project-specific code. Remove the `<link rel="icon">` pointing to vite.svg from `index.html`.
**Confidence:** HIGH

### Pitfall 5: Missing Grain Overlay Effect
**What goes wrong:** The existing site has a distinctive film grain overlay (`.grain` class with SVG noise filter). If this is not migrated, the new site "feels" different even if colors are identical.
**How to avoid:** Migrate the grain overlay as a fixed-position element in the AppShell component. It is a simple CSS effect using an inline SVG data URL for the noise pattern, with `opacity: 0.03` and `pointer-events: none`.
**Confidence:** HIGH (verified from existing project.html source)

## Code Examples

### Vite Config with Tailwind CSS 4

```typescript
// vite.config.ts
// Source: Official Tailwind CSS + Vite installation docs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Theme Toggle Proof-of-Concept (Success Criterion 3)

Phase 1 success criterion #3 requires toggling between two color palettes. This does NOT require the full GSAP-driven theme engine -- just a proof that CSS custom properties work:

```typescript
// theme/theme-utils.ts
export interface ThemePalette {
  accent: string;
  bg: string;
  bgElevated: string;
  text: string;
  coral: string;
  lavender: string;
}

export const defaultTheme: ThemePalette = {
  accent: '#96b8f7',
  bg: '#06080d',
  bgElevated: '#0d1117',
  text: '#edf2fc',
  coral: '#f7a896',
  lavender: '#b896f7',
};

export const altTheme: ThemePalette = {
  accent: '#f7a896',        // Swap: coral becomes accent
  bg: '#0d0806',            // Warm dark background
  bgElevated: '#17110d',    // Warm elevated
  text: '#fcf2ed',          // Warm text
  coral: '#96b8f7',         // Swap: blue becomes coral slot
  lavender: '#f796b8',      // Pink lavender
};

export function applyTheme(palette: ThemePalette) {
  const root = document.documentElement;
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-bg', palette.bg);
  root.style.setProperty('--color-bg-elevated', palette.bgElevated);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-coral', palette.coral);
  root.style.setProperty('--color-lavender', palette.lavender);
}
```

### Project Data Migration

```typescript
// data/projects.ts
// Source: Migrated from existing project.html JavaScript
import type { ProjectData } from './types';

export const projects: ProjectData[] = [
  {
    id: 'atlas',
    title1: 'Atlas',
    title2: 'Analytics',
    category: 'Plateforme SaaS',
    year: '2025',
    subtitle: "Dashboard analytique en temps reel pour la gestion de donnees d'entreprise.",
    client: 'Atlas Corp.',
    services: 'UI/UX, Developpement, Branding',
    duration: '4 mois',
    tech: 'React, Node.js, AWS',
    heroImg: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&h=900&fit=crop&q=85',
    colors: {
      accent: '#96b8f7',
      background: '#06080d',
      gradientFrom: '#96b8f7',
      gradientTo: '#b896f7',
    },
  },
  // ... pulse, verde, lumen, nexo (5 total from existing site)
];
```

### Responsive Layout Shell

```typescript
// components/layout/AppShell.tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased overflow-x-hidden">
      {/* Grain overlay -- migrated from existing site */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {children}
    </div>
  );
}
```

### Container Component

```typescript
// Matching existing site's container: max-width 1400px, clamp(20px, 4vw, 80px) padding
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('mx-auto max-w-[1400px] px-[clamp(20px,4vw,80px)]', className)}>
      {children}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` (JS config) | `@theme` directive in CSS | Tailwind CSS v4.0 (Jan 2025) | No config files; everything in CSS |
| PostCSS plugin for Tailwind | `@tailwindcss/vite` Vite plugin | Tailwind CSS v4.0 (Jan 2025) | Zero PostCSS config needed with Vite |
| `create-react-app` | `npm create vite@latest` | CRA deprecated 2023 | Vite is the standard React scaffold tool |
| `framer-motion` package name | `motion` package name | Renamed mid-2024 | Import from `motion`, not `framer-motion` |

## Existing Code to Migrate

Critical elements from the existing HTML site that must be preserved in Phase 1:

| Element | Source Location | Target |
|---------|----------------|--------|
| Color palette (17 CSS variables) | `index.html` lines 16-35 | `index.css` `@theme` block |
| Font imports (Inter, Space Grotesk, JetBrains Mono) | `index.html` lines 7-9 | `index.html` `<head>` |
| Grain overlay | `project.html` lines 48-52 | `AppShell.tsx` component |
| Container layout (`max-width: 1400px`, `clamp()` padding) | `index.html` lines 94-98 | `Container.tsx` component |
| Project data (5 projects) | `project.html` lines 613-714 | `data/projects.ts` |
| Selection styling | `index.html` lines 53-56 | `index.css` global styles |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (bundled with Vite ecosystem) |
| Config file | None -- Wave 0 task to add `test` block to `vite.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PERF-01 | Layout responds to viewport changes (375px, 768px, 1440px) | manual + smoke | Manual: Chrome DevTools responsive mode | N/A -- visual verification |
| PERF-02 | FCP under 3s on throttled 3G | manual | Manual: Chrome Lighthouse with 3G throttle | N/A -- Lighthouse audit |
| DATA-01 | Project data array has 5 entries with correct types | unit | `npx vitest run src/data/__tests__/projects.test.ts` | No -- Wave 0 |
| THEME-01 | applyTheme updates CSS custom properties on :root | unit | `npx vitest run src/theme/__tests__/theme-utils.test.ts` | No -- Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run` + manual responsive check
- **Phase gate:** All unit tests green + manual verification of 4 success criteria

### Wave 0 Gaps

- [ ] `vitest` dev dependency installation: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Vite config test block: add `test: { globals: true, environment: 'jsdom' }` to `vite.config.ts`
- [ ] `src/data/__tests__/projects.test.ts` -- covers DATA-01 (project data integrity)
- [ ] `src/theme/__tests__/theme-utils.test.ts` -- covers THEME-01 (theme application)

## Open Questions

1. **Font hosting strategy**
   - What we know: Current site uses Google Fonts CDN with preconnect
   - What's unclear: Whether self-hosting via `@fontsource` packages would be faster for FCP on 3G
   - Recommendation: Start with Google Fonts (matching existing site), measure FCP, switch to self-hosted if needed

2. **Exact per-project color palettes**
   - What we know: All 5 existing projects use the same default palette. Phase 3 (VIS-01) will introduce unique palettes.
   - What's unclear: Whether Phase 1 should define placeholder unique palettes for each project
   - Recommendation: Define the `ProjectColors` interface now but use the default palette for all 5 projects. The alt theme (for toggle proof-of-concept) can be a simple warm variant.

3. **Existing HTML files disposition**
   - What we know: `index.html` and `project.html` are the current static site
   - What's unclear: Whether to keep them alongside the React app or move them to a separate directory
   - Recommendation: Leave them in place for reference during migration. Vite's `index.html` (root-level) will serve the React app. The old files can be moved to `legacy/` or removed after Phase 3.

## Sources

### Primary (HIGH confidence)
- Existing `index.html` and `project.html` source code -- exact palette, fonts, data model, layout patterns
- [Tailwind CSS theme docs](https://tailwindcss.com/docs/theme) -- `@theme` directive syntax and namespaces
- [Tailwind CSS adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) -- dynamic CSS variable usage
- [Vite getting started](https://vite.dev/guide/) -- `react-ts` template scaffold
- [@tailwindcss/vite on npm](https://www.npmjs.com/package/@tailwindcss/vite) -- Vite plugin setup

### Secondary (MEDIUM confidence)
- [GSAP React docs](https://gsap.com/resources/React/) -- useGSAP hook patterns (relevant for later phases, validates architecture decisions now)
- [@gsap/react on npm](https://www.npmjs.com/package/@gsap/react) -- hook API and auto-cleanup

### Tertiary (LOW confidence)
- None -- all Phase 1 findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified via npm, Vite/Tailwind patterns confirmed from official docs
- Architecture: HIGH -- data model migrated from actual existing source code, not hypothetical
- Pitfalls: HIGH -- Tailwind v4 config changes verified from official docs; font loading well-established pattern

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable ecosystem, no fast-moving dependencies in Phase 1)
