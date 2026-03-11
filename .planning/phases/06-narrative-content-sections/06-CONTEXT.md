# Phase 6: Narrative Content Sections - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can read the full challenge, solution, and process story for each project, with content that reveals section-by-section as they scroll. Delivers: challenge/problem prose (CSCONT-01), solution/approach prose (CSCONT-02), animated process timeline (CSCONT-03), and scroll-triggered section reveals (CSVIS-01). Metrics counters, gallery, testimonial polish, reading progress bar, and next-project CTA are Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Prose presentation
- Split multi-paragraph challenge/solution text on `\n\n` into separate `<p>` tags with generous spacing (~1.5rem gap)
- First paragraph slightly larger (text-lg); subsequent paragraphs at text-base — editorial magazine style
- Brighter text color (text-text primary) for prose body — long-form needs higher contrast for comfortable reading
- text-secondary reserved for metadata and labels only
- Section header only (mono uppercase accent) — no subtitle or intro line
- Challenge and Solution sections use identical formatting — content provides the narrative shift, not visual styling
- No pull quotes, drop caps, or decorative elements — clean editorial feel

### Timeline visual design
- Vertical accent-colored line on the left with circular nodes at each step
- Phase name + duration on the node line, description text to the right
- Accent color for connector line and filled nodes — ties timeline to project identity
- Unfilled/upcoming nodes use accent at ~20% opacity
- Progressive fill reveal: nodes start empty (○), fill to solid (●) as each step scrolls into view; connector line draws downward between nodes
- Timeline stays within the 800px prose column — consistent reading flow, no layout shift

### Scroll reveal behavior
- Fade + translateY (~30px) for each section — consistent with Phase 3 stagger and Phase 5 entry animation language
- Entry animation reveals hero + first 1-2 above-fold sections (existing Phase 5 behavior); ScrollTrigger handles all below-fold sections
- No double-animation: above-fold sections revealed by entry animation are not also targeted by ScrollTrigger
- Child elements within sections (timeline nodes, metric cards, team members) stagger individually after parent section reveals
- Scroll reveals apply uniformly to ALL CaseStudySection components (including Phase 7 placeholder sections) — reveal wrapper stays when Phase 7 upgrades content
- Reduced motion: instant visibility for all sections — no ScrollTrigger created, no animation at all. Content always readable.

### Section ordering & rhythm
- Whitespace only between sections (py-16 existing spacing) — no divider lines or decorative separators
- Keep current section header style: font-mono, text-sm, uppercase, tracking-widest, text-accent, mb-6
- Section order unchanged: Hero → Défi → Solution → Processus → Résultats → Livrables → Témoignage → Équipe
- Phase 7 placeholder sections (Résultats, Livrables, Témoignage, Équipe) remain visible with current basic rendering

### Claude's Discretion
- ScrollTrigger start/end thresholds (e.g., "top 80%" vs "top 85%")
- Exact fade+translate duration per section (likely 0.4-0.6s range)
- Child stagger delay between items (likely 0.05-0.1s)
- Timeline connector line width and node size
- Timeline progressive fill animation easing and timing
- How to detect which sections are above-fold vs below-fold on entry
- Whether to use gsap.context() per-section or one scoped to the entire panel

</decisions>

<specifics>
## Specific Ideas

- Magazine editorial feel — case study should read like a premium agency write-up, not a dashboard
- Consistent animation language: fade+translateY is the vocabulary throughout the entire app (Phases 3, 5, 6)
- Timeline progressive fill creates a sense of "journey completion" as the user scrolls through the process
- Content itself is the star — no decorative chrome competing with the prose

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CaseStudySection`: Wrapper with `data-anim="cs-section"`, max-w-[800px], py-16, mono accent header — extend with ScrollTrigger
- `CaseStudyPanel`: Entry animation already staggers sections via `data-anim="cs-section"` selector — coordinate with ScrollTrigger
- `CaseStudyHero`: Full-bleed hero with forwardRef — already handled by entry animation
- `useReducedMotion`: gsap.matchMedia-based — use for scroll reveal branching
- `BackButton`: Fixed top-left with backdrop blur — no changes needed

### Established Patterns
- GSAP + plain useEffect/useCallback (not useGSAP hook)
- Direct DOM refs, never string selectors
- gsap.context() scoped to container element; .revert() on cleanup
- ScrollTrigger with `scroller: panelRef.current` (never window) — decided in Phase 5
- `data-anim` attribute convention for GSAP targeting
- power3.inOut / power3.out easing on transitions

### Integration Points
- `CaseStudyPanel.tsx`: Add ScrollTrigger setup after entry animation completes (onComplete callback)
- `CaseStudySection.tsx`: Split prose into paragraphs, accept children for custom layouts (timeline)
- New `Timeline` component: Vertical line + nodes, replaces placeholder card markup in Processus section
- `projects.ts`: Data already complete — challenge/solution text has `\n\n` for paragraph splitting
- `types.ts`: CaseStudyTimelineStep type already has phase, duration, description fields

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-narrative-content-sections*
*Context gathered: 2026-03-11*
