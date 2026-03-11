---
phase: 7
slug: metrics-gallery-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16 |
| **Config file** | `vite.config.ts` — `test.environment: 'jsdom'`, `setupFiles: ['./src/test-setup.ts']` |
| **Quick run command** | `npx vitest run src/components/case-study/__tests__/{Component}.test.tsx` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/case-study/__tests__/{Component}.test.tsx`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 0 | CSCONT-04 | unit | `npx vitest run src/components/case-study/__tests__/MetricCounter.test.tsx` | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 0 | CSCONT-05 | unit | `npx vitest run src/components/case-study/__tests__/DeliverableGallery.test.tsx` | ❌ W0 | ⬜ pending |
| 07-01-03 | 01 | 0 | CSNAV-03 | unit | `npx vitest run src/components/case-study/__tests__/ReadingProgressBar.test.tsx` | ❌ W0 | ⬜ pending |
| 07-01-04 | 01 | 0 | CSNAV-04 | unit | `npx vitest run src/components/case-study/__tests__/NextProjectCard.test.tsx` | ❌ W0 | ⬜ pending |
| 07-01-05 | 01 | 1 | CSCONT-04 | unit | `npx vitest run src/components/case-study/__tests__/MetricCounter.test.tsx` | ❌ W0 | ⬜ pending |
| 07-01-06 | 01 | 1 | CSCONT-05 | unit | `npx vitest run src/components/case-study/__tests__/DeliverableGallery.test.tsx` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 2 | CSCONT-06 | unit | `npx vitest run src/components/case-study/__tests__/TestimonialBlock.test.tsx` | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 2 | CSCONT-07 | unit | `npx vitest run src/components/case-study/__tests__/TeamCredits.test.tsx` | ❌ W0 | ⬜ pending |
| 07-02-03 | 02 | 2 | CSNAV-03 | unit | `npx vitest run src/components/case-study/__tests__/ReadingProgressBar.test.tsx` | ❌ W0 | ⬜ pending |
| 07-02-04 | 02 | 2 | CSNAV-04 | unit | `npx vitest run src/components/case-study/__tests__/NextProjectCard.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/case-study/__tests__/MetricCounter.test.tsx` — stubs for CSCONT-04
- [ ] `src/components/case-study/__tests__/DeliverableGallery.test.tsx` — stubs for CSCONT-05
- [ ] `src/components/case-study/__tests__/ReadingProgressBar.test.tsx` — stubs for CSNAV-03
- [ ] `src/components/case-study/__tests__/NextProjectCard.test.tsx` — stubs for CSNAV-04
- [ ] `src/components/case-study/__tests__/TestimonialBlock.test.tsx` — stubs for CSCONT-06
- [ ] `src/components/case-study/__tests__/TeamCredits.test.tsx` — stubs for CSCONT-07
- [ ] `src/data/types.ts` — add `galleryImages?: string[]` to `CaseStudyContent`
- [ ] `src/data/projects.ts` — add `galleryImages` arrays with Unsplash URLs

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Counter animates smoothly at 60fps | CSCONT-04 | Visual performance, not testable in jsdom | Open case study, scroll to metrics section, observe counter animation |
| Gallery masonry layout renders correctly | CSCONT-05 | CSS columns layout, not testable in jsdom | Open case study, scroll to gallery, verify 2-col mobile / 3-col desktop |
| Progress bar fills smoothly on scroll | CSNAV-03 | Scroll behavior in fixed panel | Open case study, scroll through content, verify bar tracks position |
| Next project swap has no flash | CSNAV-04 | Visual transition quality | Click next project card, verify smooth transition |
| Gallery stagger reveal timing | CSCONT-05 | Visual animation timing | Scroll gallery into view, verify staggered fade-in |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
