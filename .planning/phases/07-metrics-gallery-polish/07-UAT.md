---
status: testing
phase: 07-metrics-gallery-polish
source: [07-01-SUMMARY.md, git-log-07-02]
started: 2026-03-12T00:00:00Z
updated: 2026-03-12T00:00:00Z
---

## Current Test

number: 1
name: Case Study Panel Opens
expected: |
  Click on any project card (Atlas, Pulse, or Verde). A full-screen case study
  panel slides up/opens. The panel shows a hero section at the top with the
  project image and metadata (title, type, year, client, services, duration,
  technologies).
awaiting: user response

## Tests

### 1. Case Study Panel Opens
expected: Click on any project card (Atlas, Pulse, or Verde). A full-screen case study panel slides up/opens. The panel shows a hero section at the top with the project image and metadata (title, type, year, client, services, duration, technologies).
result: [pending]

### 2. Hero Matches Legacy Design
expected: The case study hero shows the project image on one side and the project details on the other — matching the legacy style: category tag + title, a short description, and a metadata row (Client, Services, Durée, Technologies). Not a full-bleed background with text overlay.
result: [pending]

### 3. Metrics Section — Animated Counters
expected: Scroll down in the case study to the "Métriques" section. The metric cards show animated count-up numbers (e.g. "+180" counting from 0, or "-60%" counting up to 60). The animation triggers when the section scrolls into view.
result: [pending]

### 4. Deliverables Gallery — Masonry Grid
expected: Scroll down to the gallery section. Project images appear in a masonry/columns layout (images of different heights stacked in columns, not a uniform grid). Images load lazily. No images overlap each other.
result: [pending]

### 5. Testimonial Block
expected: Scroll to the testimonial/avis section. A pull-quote style blockquote appears with a left accent border, large italic quote text, and an author attribution below it.
result: [pending]

### 6. Team Credits
expected: Scroll to the équipe/team section. A grid of team member cards appears — each card shows a circular avatar with the person's initials (colored in the project accent color) and their name + role below it.
result: [pending]

### 7. Reading Progress Bar
expected: As you scroll down through the case study, a thin colored bar at the very top of the panel fills from left to right, tracking your scroll position. At the top it's empty; near the bottom it's full.
result: [pending]

### 8. Next Project Card
expected: At the very bottom of the case study, a full-width card appears showing the next project (circular navigation — after Verde, it wraps back to Atlas). Clicking it navigates to that project's case study.
result: [pending]

### 9. Layout Rhythm — Content Alignment
expected: All content sections in the case study (hero metadata, Défi, Solution, Processus, Métriques, Gallery, Testimonial, Team, Next Project) are consistently left-aligned with matching horizontal padding. Nothing is awkwardly narrow and centered while other elements are full-width.
result: [pending]

### 10. Case Study Closes
expected: There is a way to close/dismiss the case study panel (close button, back navigation, or pressing Escape) and return to the main project slider.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0

## Gaps

[none yet]
