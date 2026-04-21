# Deferred Items — Phase 08

## Pre-existing Test Failures (out of scope for 08-01)

These failures existed before 08-01 execution and are caused by prior commits
that expanded projects.ts from 3 to 22 entries and modified Slide.tsx.

1. `projects.test.ts` — "has 3 entries (atlas, pulse, verde)" — test assumes only 3 projects
2. `NextProjectCard.test.tsx` — 3 failures (circular wrap, min height assertions)
3. `Slide.test.tsx` — 6 failures (picture element, data-parallax, srcset, lazy loading)

These need to be updated to reflect the current data structure in a dedicated cleanup plan.
