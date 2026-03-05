---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | PERF-01 | manual | Chrome DevTools responsive mode | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | PERF-02 | manual | Chrome Lighthouse with 3G throttle | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | DATA-01 | unit | `npx vitest run src/data/__tests__/projects.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | THEME-01 | unit | `npx vitest run src/theme/__tests__/theme-utils.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` dev dependency: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Vite config test block: `test: { globals: true, environment: 'jsdom' }`
- [ ] `src/data/__tests__/projects.test.ts` — stubs for project data integrity
- [ ] `src/theme/__tests__/theme-utils.test.ts` — stubs for theme application

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Layout responds to viewports | PERF-01 | Visual layout verification | Open Chrome DevTools, toggle 375px / 768px / 1440px viewports, verify layout adapts |
| FCP under 3s on 3G | PERF-02 | Lighthouse performance audit | Run Chrome Lighthouse with simulated 3G, verify FCP < 3000ms |
| Theme toggle works visually | THEME-01 | Visual color change verification | Toggle theme, verify colors change on the page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
