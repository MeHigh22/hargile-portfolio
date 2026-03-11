# Phase 7: Metrics, Gallery & Polish - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Users finish reading each case study having seen compelling results with animated counters, browsed deliverable screenshots in a visual gallery, read a client quote, and been offered a seamless path to the next project. Delivers: animated metric counters (CSCONT-04), deliverables gallery with scroll reveals (CSCONT-05), testimonial pull-out styling (CSCONT-06), team credits polish (CSCONT-07), reading progress bar (CSNAV-03), and next project preview (CSNAV-04). Testimonial and team sections already have basic rendering from Phase 5 — this phase upgrades them and adds the new components.

</domain>

<decisions>
## Implementation Decisions

### Metric counter animation
- Fast punch timing: ~1s duration, power2.out easing — matches the brisk animation pacing throughout the app
- Staggered cascade: each counter starts ~0.1-0.15s after the previous one — consistent with timeline node and section reveal stagger patterns
- Prefix + suffix preserved: symbols like "+", "%", "s" stay static while the number animates (e.g., "+140%" — the "+" and "%" are static, "140" counts up)
- Counters fire once on scroll into view and do not reset on re-scroll
- Minimal card style: no borders or card wrappers — just number + label with spacing and typography. More editorial, less dashboard

### Deliverables gallery
- Full-width masonry grid breaking out of the 800px prose column — spans viewport width like the hero image
- Pinterest-style mixed-height layout: 2 columns on mobile, 3 on desktop, images at natural aspect ratios
- Staggered scroll-triggered reveals: images fade+translateY into view one by one as user scrolls
- No click interaction, no lightbox (REQUIREMENTS.md explicitly ruled out lightbox — "breaks scroll narrative")
- Unsplash placeholder images: use Unsplash URL API (Phase 4 pattern) with tech/design themed images per project until real screenshots are available

### Testimonial styling
- Keep current blockquote with accent left border — already matches editorial feel
- Upgrade as needed for "prominent pull-out" requirement — larger quote text, more visual weight

### Team credits
- Keep current grid layout with bordered cards — consistent pattern
- Small profile cards with name + role as specified in requirements

### Next project preview
- Full-width hero card at bottom: shows next project's hero image, title, and category
- Spans full viewport width like gallery — creates a natural visual continuation
- Direct case study swap on click: close current case study and open next project's case study without returning to slider
- Circular loop: after last project (verde), next project is first (atlas) — no dead ends
- Subtle gradient blend: card background transitions from current project's accent toward next project's accent color — hints at the upcoming mood shift
- French label: "Projet suivant" or similar

### Reading progress bar
- Top of viewport: thin horizontal bar at very top of screen, fills left to right
- Accent color, 3px thickness — ties to project identity, visible without being chunky
- Smooth scroll-linked: bar width directly follows scroll position in real-time
- Appears after first scroll: fades in once user starts scrolling, doesn't compete with hero first impression
- Fixed position, z-index above case study content but below any modals

### Claude's Discretion
- Exact masonry layout algorithm (CSS columns vs CSS grid vs JS-based)
- Gallery image spacing and gap size
- Counter number interpolation method (GSAP snap vs Math.round)
- Progress bar fade-in timing and easing
- Next project card hover state behavior
- Transition animation between case studies (direct swap choreography)
- Testimonial visual upgrade details (font size, spacing adjustments)
- Team card polish details

</decisions>

<specifics>
## Specific Ideas

- Metric counters should feel decisive and confident — the numbers punch into place, they don't lazily drift
- Gallery is a "visual breathing moment" — full-width images break the prose rhythm and show the actual work
- Next project card should feel like a natural invitation, not a forced CTA — "here's what's next" energy
- Progress bar uses accent color to stay on-brand per project — it's a subtle identity thread at the top
- The whole phase is about the bottom half of the case study feeling as polished as the top half

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CaseStudyPanel.tsx`: Already renders all sections with placeholder content — metrics grid, deliverables list, testimonial blockquote, team cards
- `CaseStudySection`: Wrapper with `data-anim="cs-section"`, scroll reveal already attached for below-fold sections
- `CaseStudyHero`: Full-bleed hero pattern to replicate for gallery and next project card
- `useReducedMotion`: gsap.matchMedia-based — use for counter and gallery animation branching
- `useViewStore`: mode + activeProjectId — extend for direct case study swap
- Unsplash URL API pattern from Phase 4 hero images — reuse for gallery placeholders
- `projects.ts`: All data already populated — metrics, deliverables, testimonial, team fields complete

### Established Patterns
- GSAP + plain useEffect/useCallback (not useGSAP hook)
- Direct DOM refs, never string selectors
- ScrollTrigger with `scroller: panelRef.current` (never window)
- gsap.context() scoped to container; .revert() on cleanup
- `data-anim` attribute convention for GSAP targeting
- Fade + translateY (~30px) as universal reveal animation
- power3.out for reveals, power2.inOut for transitions

### Integration Points
- `CaseStudyPanel.tsx`: Replace placeholder markup for metrics, gallery, next project; upgrade testimonial/team
- New components: `MetricCounter`, `DeliverableGallery`, `NextProjectCard`, `ReadingProgressBar`
- `projects.ts`: Add gallery image URLs (Unsplash placeholders) to deliverables data
- `types.ts`: May need `CaseStudyDeliverable` type with image URL field (currently just string[])
- `useViewStore`: Add method for direct case study swap (close current + open next)
- ScrollTrigger integration: counters, gallery stagger, progress bar all use scroll events from panel

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-metrics-gallery-polish*
*Context gathered: 2026-03-11*
