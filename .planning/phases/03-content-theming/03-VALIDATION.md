---
phase: 3
slug: content-theming
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.x + @testing-library/react 16.x |
| **Config file** | vite.config.ts (test section inline) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | CONT-01 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "hero"` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | CONT-02 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "narrative"` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | CONT-03 | unit | `npx vitest run src/components/slider/__tests__/Slide.test.tsx -t "tags"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | CONT-04 | unit | `npx vitest run src/components/layout/__tests__/ContactCTA.test.tsx` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | VIS-01 | unit | `npx vitest run src/theme/__tests__/color-utils.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 2 | VIS-02 | manual | Manual visual verification | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/slider/__tests__/Slide.test.tsx` — stubs for CONT-01, CONT-02, CONT-03
- [ ] `src/components/layout/__tests__/ContactCTA.test.tsx` — stubs for CONT-04
- [ ] `src/theme/__tests__/color-utils.test.ts` — stubs for VIS-01 (deriveTheme)

*Existing infrastructure covers test framework (Vitest already configured).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Stagger animation sequence plays correctly (category -> title -> narrative -> tags, hero scale+fade concurrent) | VIS-02 | GSAP timeline execution requires browser rendering; cannot be unit tested | 1. Load page fresh 2. Verify elements appear in stagger order with ~150-200ms gaps 3. Navigate to next slide 4. Verify stagger replays on new slide |
| Color morph transitions smoothly between projects | VIS-01 | Color interpolation smoothness requires visual verification | 1. Navigate between slides 2. Verify colors morph (not jump) 3. Check all 8 CSS properties update 4. Verify 0.8s duration feels right |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
