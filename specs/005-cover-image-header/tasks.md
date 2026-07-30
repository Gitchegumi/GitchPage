# Tasks: Cover-Image-First Blog Header

**Feature**: 005-cover-image-header
**Branch**: `005-cover-image-header`
**Input**: Design documents in `specs/005-cover-image-header/`
**Prerequisites**: [plan.md](./plan.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/header-ui-contract.md](./contracts/header-ui-contract.md), [quickstart.md](./quickstart.md)

## Format

- `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **[P]** = parallelizable (different file, no dependency on an incomplete task)
- **[US1]** = part of User Story 1 (the only user story for this feature)

## Story map

This feature has a single user story (the primary user story in [spec.md](./spec.md)): a visitor lands on the blog home page and sees the publication cover image as the dominant header visual, with the description below it and no separate visible site-title text. The six acceptance scenarios in the spec are different conditions of the same story, not independent stories — they all share the same template + CSS surface and are verified together.

There is no Setup phase (the Ghost theme already exists) and no Foundational phase (no shared blocking prerequisites).

---

## Phase 3: User Story 1 — Cover-Image-First Header

**Story goal**: Replace the overlay-style hero with an image-first header that satisfies all eight functional requirements (FR-001 through FR-008) and all nine success criteria (SC-001 through SC-009) in the spec.

**Independent test criteria**: After T001 + T002 are merged and the theme is loaded into Ghost, every checkbox in [quickstart.md](./quickstart.md) passes. The story is complete when (a) all four UI contract shapes (A/B/C/D in [header-ui-contract.md](./contracts/header-ui-contract.md)) render correctly, (b) desktop and mobile layouts both pass the visual checks, (c) the screen-reader announcement still includes the publication identity, and (d) `npm run build` for the Next.js site continues to succeed.

### Implementation

- [X] T001 [P] [US1] Update [ghost_theme/custom-theme/index.hbs](ghost_theme/custom-theme/index.hbs): replace the existing `{{#if @site.cover_image}} … {{else}} … {{/if}}` block (currently containing `.gm-cover-hero`, `.gm-cover-hero-image`, `.gm-cover-hero-overlay`, `.gm-cover-hero-content`, `.gm-cover-hero-title`, `.gm-cover-hero-desc`) with the Shape A/B/C/D cascade specified verbatim in [contracts/header-ui-contract.md § "Selection logic"](./contracts/header-ui-contract.md). Use the new `.gm-cover-banner` and `.gm-cover-banner-image` class names. Set the `<img>` `width` and `height` attributes to the intrinsic dimensions of the current cover image source (probe the file or use 1620 × 900 as the documented default if unknown). Do not modify any other part of `index.hbs`.

- [X] T002 [P] [US1] Update [ghost_theme/custom-theme/assets/css/screen.css](ghost_theme/custom-theme/assets/css/screen.css): (a) remove the legacy `.gm-cover-hero`, `.gm-cover-hero-image`, `.gm-cover-hero-overlay`, `.gm-cover-hero-content`, `.gm-cover-hero-title`, `.gm-cover-hero-desc` rule blocks (currently lines ~578–651); (b) add new `.gm-cover-banner` and `.gm-cover-banner-image` rules per research decisions R1, R2, R3, R5 — `.gm-cover-banner` is a block element with `width: 100%` and `display: block`; `.gm-cover-banner-image` has `width: 100%; height: auto; display: block;` at all viewports, plus `max-height: 50vh; object-fit: contain;` inside an `@media (min-width: 768px)` query. Add a `.gm-page-header--below-cover` modifier rule that supplies a small top padding (~1.5rem) so the description doesn't sit flush against the image. Leave the existing `.gm-page-header*` rules unchanged. Do not modify any other CSS region.

### Verification (sequential — all run on the same Ghost preview instance)

- [ ] T003 [US1] Build and load the modified theme into Ghost: zip `ghost_theme/custom-theme/` and upload it via Ghost Admin → Settings → Design (or restart the local Ghost preview pointed at this directory) so the modified theme is the active theme of the publication. Confirm the publication's Publication cover and Site description are populated as documented in [quickstart.md § Setup](./quickstart.md).

- [ ] T004 [US1] Manual verification — desktop primary case: execute [quickstart.md](./quickstart.md) steps 5, 6, 7, 8 in a Chromium-based browser at ≥ 1280 px viewport. Confirms FR-001/001a/001b/002/003, SC-001, SC-002, SC-008, SC-009, plus CLS and LCP behavior.

- [ ] T005 [US1] Manual verification — mobile and tablet responsive: execute [quickstart.md](./quickstart.md) steps 9 and 10 at viewports of 360 × 640, 414 × 896, and 768 × 1024. Confirms FR-006 and SC-004.

- [ ] T006 [US1] Manual verification — fallback shapes B, C, D: execute [quickstart.md](./quickstart.md) steps 11, 12, 13. Temporarily blank Site description, then temporarily clear Publication cover, then clear both, restoring after each. Confirms FR-004 and AS-3 / AS-4 / the edge cases in [spec.md § Edge Cases](./spec.md).

- [ ] T007 [US1] Manual verification — accessibility: execute [quickstart.md](./quickstart.md) steps 14 and 15 with a screen reader (VoiceOver / NVDA / TalkBack) and keyboard-only navigation. Confirms FR-005 and SC-005.

- [ ] T008 [US1] Manual verification — image-failure handling and non-regression on other pages: execute [quickstart.md](./quickstart.md) steps 16 and 17. Block the cover image URL in DevTools to simulate failure; visit a post page, a tag page, an author page, and the 404 page to confirm zero visual change on those routes. Confirms FR-007 and SC-006.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T009 Run `npm run build` from the repository root and confirm zero type errors. This is the Constitution IV gate. The Next.js site is not modified by this feature; the build is a sanity check that nothing in the Next.js source was incidentally touched. Execute [quickstart.md](./quickstart.md) step 18. **Result**: PASS — all routes prerendered as static content, sitemap regenerated, zero type errors.

---

## Dependencies

```text
T001 ──┐
       ├──→ T003 ──→ T004 ──→ T005 ──→ T006 ──→ T007 ──→ T008 ──→ T009
T002 ──┘
```

T001 and T002 are independent (different files) and can be implemented in parallel. T003 depends on both being merged into the working tree. Verification steps T004–T008 are sequential because they share the same running Ghost preview and toggle publication settings between steps. T009 is the final gate.

## Parallel execution example

```text
# T001 and T002 can be edited concurrently (different files):
Task: "Edit ghost_theme/custom-theme/index.hbs per T001 description"
Task: "Edit ghost_theme/custom-theme/assets/css/screen.css per T002 description"
```

## Implementation strategy — MVP scope

The MVP is the entire feature: T001 + T002 + T003 + T004 (Shape A desktop verification). That alone delivers the user's stated goal. T005–T008 raise the confidence level (mobile, fallbacks, a11y, non-regression). T009 is the constitutional merge gate.

If time-pressed, ship the MVP slice (T001 → T004 → T009) first, then complete T005–T008 as a follow-up before merge. T009 is non-negotiable per Constitution IV.

## Notes

- No automated tests are generated. Per Constitution IV ("Build Integrity & Manual Verification"), the merge gate is `npm run build` plus the manual smoke check.
- No tasks are created for the `data-model.md`, `research.md`, `quickstart.md`, or `contracts/` files themselves — those are design artifacts and are referenced *by* the implementation tasks, not produced by them.
- After this tasks file is generated, no further `/speckit.*` artifacts are needed before implementation.

## Validation Checklist

- [x] All contract shapes (A/B/C/D in `contracts/header-ui-contract.md`) covered by an implementation task (T001 produces all four shapes via the cascade).
- [x] All entities (`@site.cover_image`, `@site.description`, `@site.title` in `data-model.md`) covered by an implementation task (T001 binds all three).
- [x] User Story 1 has at least one manual verification step (T004–T008 cover all six acceptance scenarios and all nine success criteria).
- [x] Parallel tasks ([P]) are truly independent (T001 edits `index.hbs`, T002 edits `screen.css` — no overlap).
- [x] Each task specifies an exact file path or executable action.
- [x] No two `[P]` tasks modify the same file.
