# Deferred Items — Phase 05

## Pre-existing Test Failures (Out of Scope for 05-01)

### useHashSync.test.ts and useSliderStore.test.ts

**Files:** `src/hooks/__tests__/useHashSync.test.ts`, `src/store/__tests__/useSliderStore.test.ts`

**Issue:** Tests reference `projects[5]` and expect `totalSlides >= 12`, written when the portfolio had 12+ projects. The rebuild in Phase 4 trimmed the project list to 3 (atlas, pulse, verde), leaving these tests broken.

**Failures:**
- `useHashSync > handles popstate event by navigating to hash project` — `projects[5]` is undefined
- `useSliderStore > totalSlides equals projects.length (12+)` — 3 is not >= 12
- And related tests

**Action required:** Update useHashSync and useSliderStore tests to match the 3-project reality. Should be done as part of a cleanup plan (Phase 5 or Phase 6 cleanup task).

**Not fixed in 05-01** because these failures pre-date this plan and are in unrelated files.
