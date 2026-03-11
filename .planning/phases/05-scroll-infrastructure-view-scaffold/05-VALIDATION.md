---
phase: 5
slug: scroll-infrastructure-view-scaffold
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| **Config file** | vite.config.ts (vitest config inline) |
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
| 05-01-01 | 01 | 0 | CSNAV-01, CSNAV-02, CSVIS-02 | unit | `npm run test -- useViewStore` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 0 | CSNAV-01, CSNAV-02, CSVIS-03 | unit | `npm run test -- CaseStudyPanel` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 0 | CSDATA-01 | unit | `npm run test -- projects` | ❌ W0 | ⬜ pending |
| 05-XX-XX | XX | X | CSVIS-04 | manual | N/A | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/store/__tests__/useViewStore.test.ts` — stubs for CSNAV-01, CSNAV-02, CSVIS-02
- [ ] `src/components/case-study/__tests__/CaseStudyPanel.test.tsx` — stubs for CSNAV-01, CSNAV-02, CSVIS-03
- [ ] Extend `src/data/__tests__/projects.test.ts` — stubs for CSDATA-01

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reduced motion: no spatial animation in panel | CSVIS-04 | Requires real OS accessibility preference change | 1. Enable "Reduce motion" in OS settings 2. Open case study 3. Verify no slide/scale animations, only opacity fade |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
