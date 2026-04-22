---
phase: 9
slug: portfolio-mobile-slider
created: 2026-04-22
nyquist_validation: true
---

# Phase 9 — Validation Strategy: Portfolio Mobile Slider

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library |
| Config file | `vitest.config.ts` |
| Quick run | `npm test -- --run` |
| Target files | `src/pages/portfolio/components/__tests__/DotNav.test.tsx` (new), `src/pages/portfolio/__tests__/PortfolioPage.test.tsx` (augment) |

---

## Requirements → Test Map

| Req ID | Behavior | Test Type | File | Status |
|--------|----------|-----------|------|--------|
| MOB-01 | Single-column layout renders on mobile | smoke (DOM structure) | PortfolioPage.test.tsx | Existing — verify `grid-template-columns: 1fr` present in mobile CSS |
| MOB-02 | DotNav renders N dots, active dot matches currentIndex, click fires onGo | unit | DotNav.test.tsx | **Wave 0 gap — must create** |
| MOB-03 | Observer.create called with tolerance ≥ 40 | unit (mock verify) | PortfolioPage.test.tsx | **Wave 0 gap — augment existing** |
| MOB-04 | Chrome elements receive correct CSS classes on mobile | smoke | PortfolioPage.test.tsx | Existing |
| MOB-05 | No regression in desktop rendering or existing test suite | smoke | full suite | Existing |

---

## Wave 0 Gaps

These test files/cases must be created or augmented **before Phase 9 execution is considered complete**:

### 1. `src/pages/portfolio/components/__tests__/DotNav.test.tsx` (new file)

Covers MOB-02. Required tests:

- Renders a dot for each entry in `totalCount` (e.g. `totalCount={5}` → 5 dot buttons)
- The dot at `currentIndex` has `aria-selected="true"` and active CSS class
- Clicking a non-active dot calls `onGo(dotIndex)`
- Each dot button has `role="tab"`
- Wrapper has `role="tablist"`
- Each dot has `aria-label` matching the slide label

### 2. Augment `src/pages/portfolio/__tests__/PortfolioPage.test.tsx`

Covers MOB-03. Required assertion (Observer mock is already in place):

```typescript
import { Observer } from 'gsap/Observer';
// ...
it('creates GSAP Observer with tolerance 40 on mount', () => {
  render(<PortfolioPage />);
  expect(vi.mocked(Observer.create)).toHaveBeenCalledWith(
    expect.objectContaining({ tolerance: 40 })
  );
});
```

---

## Quick Verification Commands

```bash
# Run DotNav unit tests
npm test -- --run DotNav

# Run PortfolioPage tests (includes Observer assertion)
npm test -- --run PortfolioPage

# Full suite — zero regressions required
npm test -- --run
```

---

## Sign-Off Criteria

- [ ] `DotNav.test.tsx` created with all 6 required test cases passing
- [ ] `PortfolioPage.test.tsx` augmented with Observer.create assertion passing
- [ ] Full suite `npm test -- --run` exits 0
