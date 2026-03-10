# Deferred Items - Phase 04

## Pre-existing Test Failures (Out of scope)

Discovered during 04-01 execution. These failures exist before any Phase 4 changes.

### 1. projects.test.ts - expects 12+ projects
- **Tests:** "has 12+ entries", "project IDs include original set plus new entries"
- **Root cause:** Projects dataset was trimmed from 12 to 3 during rebuild (see memory notes)
- **Fix needed:** Either update test expectations or restore full project set

### 2. useHashSync.test.ts - projects[5] undefined
- **Tests:** "reads hash on mount...", "handles popstate event..."
- **Root cause:** Tests reference `projects[5]` which doesn't exist with only 3 projects
- **Fix needed:** Update tests to use `projects[1]` or `projects[2]`

### 3. useSliderStore.test.ts - expects totalSlides >= 12
- **Tests:** "totalSlides equals projects.length (12+)", "goToSlide forward"
- **Root cause:** Store test expects 12+ slides, only 3 in current dataset
- **Fix needed:** Update test expectations to match current 3-project dataset
