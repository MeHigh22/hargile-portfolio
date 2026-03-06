---
phase: 2
slug: slider-navigation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| **Config file** | vite.config.ts (inline vitest config) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | NAV-01, NAV-02 | unit | `npx vitest run src/store/__tests__/useSliderStore.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | NAV-03 | unit | `npx vitest run src/hooks/__tests__/useHashSync.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | NAV-04 | unit | `npx vitest run src/components/slider/__tests__/ProgressIndicator.test.tsx -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/store/__tests__/useSliderStore.test.ts` — stubs for NAV-01, NAV-02 (store logic: nextSlide, prevSlide, goToSlide, isAnimating guard, boundary clamping)
- [ ] `src/hooks/__tests__/useHashSync.test.ts` — stubs for NAV-03 (hash parsing, popstate handling)
- [ ] `src/components/slider/__tests__/ProgressIndicator.test.tsx` — stubs for NAV-04 (renders current index and total)
- [ ] Vitest config verification — ensure jsdom environment configured for component tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smooth animated transitions (no jumps/flashes) | NAV-01 | Visual quality requires human eye | Navigate through 5+ slides rapidly; confirm no layout jumps or flash of unstyled content |
| Touch swipe gestures | NAV-02 | Requires physical touch device or emulation | Use Chrome DevTools touch emulation; swipe left/right; confirm slide changes |
| Browser back/forward navigation | NAV-03 | Browser navigation integration | Navigate 3 slides, press back twice, confirm correct project loads |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
