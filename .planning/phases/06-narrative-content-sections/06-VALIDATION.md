---
phase: 6
slug: narrative-content-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 (embedded in vite.config.ts `test` block) |
| **Config file** | `vite.config.ts` (test key, no separate vitest.config) |
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
| 06-01-01 | 01 | 0 | CSCONT-01 | unit | `npx vitest run src/components/case-study/__tests__/ProseBody.test.tsx` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 0 | CSCONT-02 | unit | `npx vitest run src/components/case-study/__tests__/ProseBody.test.tsx` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 0 | CSCONT-03 | unit | `npx vitest run src/components/case-study/__tests__/Timeline.test.tsx` | ❌ W0 | ⬜ pending |
| 06-01-04 | 01 | 0 | CSVIS-01 | unit | `npx vitest run src/components/case-study/__tests__/CaseStudySection.test.tsx` | ❌ W0 | ⬜ pending |
| 06-XX-XX | XX | X | CSVIS-01 | manual | Visual QA with `prefers-reduced-motion: reduce` in DevTools | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/case-study/__tests__/ProseBody.test.tsx` — stubs for CSCONT-01, CSCONT-02
- [ ] `src/components/case-study/__tests__/Timeline.test.tsx` — stubs for CSCONT-03
- [ ] `src/components/case-study/__tests__/CaseStudySection.test.tsx` — stubs for CSVIS-01 (data-anim attribute)

*Existing infrastructure covers framework requirements — only test files needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reduced motion: all sections visible at opacity 1 | CSVIS-01 | Requires browser `prefers-reduced-motion` emulation | 1. Open DevTools → Rendering → prefers-reduced-motion: reduce. 2. Open a case study. 3. Verify all sections visible immediately without animation. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
