---
phase: 8
slug: portfolio-page-react-tsx
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-20
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| **Config file** | `vite.config.ts` (test block: globals, jsdom, setupFiles) |
| **Quick run command** | `npm test -- portfolioDataAdapter` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- portfolioDataAdapter`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 08-01 | 1 | PORT-01, PORT-03 | smoke + compile | `npm test -- vite.config && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 8-01-02 | 08-01 | 1 | PORT-04 | unit | `npm test -- portfolioDataAdapter` | ❌ W0 | ⬜ pending |
| 8-02-01 | 08-02 | 2 | PORT-02 | smoke | `npm test -- PortfolioPage` | ❌ W0 | ⬜ pending |
| 8-02-02 | 08-02 | 2 | PORT-02 | unit | `npm test -- PortfolioPage` | ❌ W0 | ⬜ pending |
| 8-03-01 | 08-03 | 3 | PORT-02 | compile | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 8-03-02 | 08-03 | 3 | PORT-01, PORT-02 | smoke | `npm test -- PortfolioPage && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 8-03-03 | 08-03 | 3 | PORT-01, PORT-03 | smoke | `npm test` | ❌ W0 | ⬜ pending |
| 8-03-04 | 08-03 | 3 | PORT-02 | manual | human-verify checkpoint | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/pages/portfolio/__tests__/portfolioDataAdapter.test.ts` — covers PORT-04: adapter mapping, year sort desc, scene assignment, slug uniqueness, all 24+ projects present
- [ ] `src/pages/portfolio/__tests__/PortfolioPage.test.tsx` — covers PORT-01, PORT-02, PORT-03: render smoke (data-portfolio present, no-throw), iframe[src*="globe.html"], .year-nav present, .marquee present, App still renders at /

*GSAP mocking note: `vi.mock('gsap', ...)` — pattern already used in existing test suite at `src/__tests__/`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Arrow keys navigate slides with GSAP fade transition | PORT-02 | GSAP DOM animation not testable in jsdom | Open /portfolio, press ArrowRight repeatedly, verify fade transitions between slides |
| Year tabs filter project dots correctly | PORT-02 | Complex UI interaction with DOM state | Click 2024 tab, verify only 2024 projects show as dots; click 2026, verify 2026 dots |
| Globe iframe renders the animated globe | PORT-02 | iframe cross-origin, no jsdom support | Verify globe.html loads in iframe on cover slide |
| Marquee scrolls smoothly without jerk | PORT-02 | CSS animation visual quality | Watch cover slide for 10s, verify smooth continuous scroll |
| `/portfolio` direct URL loads correctly (no 404) | PORT-01 | Requires running dev server with historyApiFallback | Navigate directly to http://localhost:5174/portfolio |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
