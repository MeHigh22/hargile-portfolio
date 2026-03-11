---
phase: 7
slug: metrics-gallery-polish
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-11
---

# Phase 7 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16 |
| **Config file** | `vite.config.ts` -- `test.environment: 'jsdom'`, `setupFiles: ['./src/test-setup.ts']` |
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

| Task ID | Plan | Requirement | Test Type | Automated Command | Status |
|---------|------|-------------|-----------|-------------------|--------|
| 07-01-T1 | 01 | CSCONT-04, CSCONT-05 | unit (TDD) | `npx vitest run src/components/case-study/__tests__/MetricCounter.test.tsx src/components/case-study/__tests__/DeliverableGallery.test.tsx` | pending |
| 07-01-T2 | 01 | CSNAV-03, CSNAV-04 | unit (TDD) | `npx vitest run src/components/case-study/__tests__/ReadingProgressBar.test.tsx src/components/case-study/__tests__/NextProjectCard.test.tsx` | pending |
| 07-01-T3 | 01 | CSCONT-06, CSCONT-07 | unit (TDD) | `npx vitest run src/components/case-study/__tests__/TestimonialBlock.test.tsx src/components/case-study/__tests__/TeamCredits.test.tsx` | pending |
| 07-02-T1 | 02 | CSCONT-04, CSCONT-05, CSCONT-06, CSCONT-07, CSNAV-03, CSNAV-04 | integration | `npx tsc --noEmit && npx vitest run src/components/case-study/__tests__/` | pending |
| 07-02-T2 | 02 | All | checkpoint:human-verify | `npx tsc --noEmit && npx vitest run` + visual inspection | pending |

*Status: pending / green / red / flaky*

**Note:** All TDD tasks in Plan 01 create tests within the same task execution (RED then GREEN). There is no separate Wave 0 -- test files are created as the first step of each TDD task.

---

## Test File Coverage

| Component | Test File | Created By | Requirement |
|-----------|-----------|------------|-------------|
| MetricCounter | `__tests__/MetricCounter.test.tsx` | 07-01-T1 | CSCONT-04 |
| DeliverableGallery | `__tests__/DeliverableGallery.test.tsx` | 07-01-T1 | CSCONT-05 |
| ReadingProgressBar | `__tests__/ReadingProgressBar.test.tsx` | 07-01-T2 | CSNAV-03 |
| NextProjectCard | `__tests__/NextProjectCard.test.tsx` | 07-01-T2 | CSNAV-04 |
| TestimonialBlock | `__tests__/TestimonialBlock.test.tsx` | 07-01-T3 | CSCONT-06 |
| TeamCredits | `__tests__/TeamCredits.test.tsx` | 07-01-T3 | CSCONT-07 |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Counter animates smoothly at 60fps | CSCONT-04 | Visual performance, not testable in jsdom | Open case study, scroll to metrics section, observe counter animation |
| Gallery masonry layout renders correctly | CSCONT-05 | CSS columns layout, not testable in jsdom | Open case study, scroll to gallery, verify 2-col mobile / 3-col desktop |
| Progress bar fills smoothly on scroll | CSNAV-03 | Scroll behavior in fixed panel | Open case study, scroll through content, verify bar tracks position |
| Next project swap has no flash | CSNAV-04 | Visual transition quality | Click next project card, verify smooth transition |
| Gallery stagger reveal timing | CSCONT-05 | Visual animation timing | Scroll gallery into view, verify staggered fade-in |
| Testimonial visual weight | CSCONT-06 | Visual styling judgment | Verify blockquote looks prominent with thick accent border |
| Team card avatar styling | CSCONT-07 | Visual styling judgment | Verify initial circles render with correct accent color |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] All 6 requirements (CSCONT-04/05/06/07, CSNAV-03/04) have dedicated test files
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
