---
phase: 4
slug: depth-production-quality
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| **Config file** | `vite.config.ts` (test.globals, test.environment: jsdom, setupFiles: src/test-setup.ts) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | VIS-03 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs new assertion) | ⬜ pending |
| 04-01-02 | 01 | 1 | VIS-03 | unit | `npx vitest run src/hooks/__tests__/useParallax.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | PERF-03 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs update) | ⬜ pending |
| 04-02-02 | 02 | 1 | PERF-03 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx` | ✅ (needs update) | ⬜ pending |
| 04-03-01 | 03 | 1 | PERF-04 | unit | `npx vitest run src/hooks/__tests__/useReducedMotion.test.ts` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 1 | PERF-04 | setup | N/A — test-setup.ts addition | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/hooks/__tests__/useParallax.test.ts` — stubs for VIS-03 hook behavior
- [ ] `src/hooks/__tests__/useReducedMotion.test.ts` — stubs for PERF-04 matchMedia detection
- [ ] `src/test-setup.ts` — add `window.matchMedia` mock (required for any test importing gsap.matchMedia or useReducedMotion)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 60fps during slide transitions with 12+ projects | PERF-03 | Requires DevTools Performance panel observation | Open DevTools > Performance, record while navigating all slides, verify no frame drops |
| Parallax depth feels natural on mouse movement | VIS-03 | Subjective visual quality | Move mouse across hero image, verify layered movement at different rates |
| Reduced motion disables all animations | PERF-04 | Requires OS-level preference toggle | Enable prefers-reduced-motion in OS/DevTools, verify all animations disabled |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
