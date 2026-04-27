# Implementation Plan: Cover-Image-First Blog Header

**Branch**: `005-cover-image-header` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-cover-image-header/spec.md`

## Summary

Replace the current overlay-style publication hero (cover image used as a darkened backdrop with the site title and description rendered as overlaid text) with an image-first hero: the publication cover image renders full-bleed at the top of the blog home page, capped at roughly 50% of the viewport height on desktop, with the publication description appearing as plain text directly below it. The site title is no longer rendered as visible body text in the home-page header (the artwork already contains it); the title remains in `<title>`, social/SEO metadata, and the cover image's `alt` attribute so it stays discoverable to assistive technologies and crawlers. The change is scoped to `ghost_theme/custom-theme/index.hbs` and a small block of CSS in `assets/css/screen.css`. No JavaScript is added or modified. The Next.js site is not touched.

## Technical Context

**Language/Version**: Handlebars (Ghost theme template language) + CSS3 (custom properties already in use); no JS changes
**Primary Dependencies**: Ghost (the publication's CMS) — uses `@site.cover_image`, `@site.title`, `@site.description` template variables; theme builds on the existing `ghost_theme/custom-theme/` structure
**Storage**: N/A — pure presentation; cover image and description originate from Ghost publication settings
**Testing**: Manual visual verification across viewports (360 px, 768 px, 1280 px, 1920 px) + keyboard / screen-reader accessibility smoke check; no automated tests required (per Constitution IV)
**Target Platform**: Modern evergreen web browsers (Chrome, Firefox, Safari, Edge — current and previous major release); iOS Safari and Chrome Android on mobile
**Project Type**: Single — Ghost theme (Handlebars + CSS assets). Distinct from the Next.js site at the repo root, which is unaffected by this feature.
**Performance Goals**: LCP < 2.5 s for the blog home page (Constitution platform constraint); CLS < 0.1 across the header (no layout jump when the image loads)
**Constraints**: Cover image is the LCP element on the home page → must load eagerly with high fetch priority; theme remains a static-asset Ghost theme (no Node.js plugins, no server-side hooks beyond standard Ghost helpers); `npm run build` for the Next.js site MUST continue to pass (this feature touches no Next.js source — verified)
**Scale/Scope**: One template file (`index.hbs`), one CSS region (~70 lines around the `.gm-cover-hero*` and `.gm-page-header*` selectors). No new files, no new assets, no new dependencies.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Key gates from GitchPage Constitution v1.1.1:

- **Principle I (Content Authenticity First)**: Not applicable — this is a presentation change, not content authoring.
- **Principle II (Sustainable Static Foundation)**: ✅ The Next.js static export is not touched. The Ghost theme remains pure Handlebars + static assets; no dynamic routes, no API hooks, no server-side rendering changes.
- **Principle III (Design & Accessibility Discipline)**: ✅ Site title remains discoverable to assistive technologies via the cover image's `alt` attribute (FR-005, SC-005). WCAG AA contrast on the description text is preserved by keeping the existing soft-white-on-dark color tokens. Keyboard navigability is unaffected (the header is non-interactive). A manual a11y smoke check is required before merge.
- **Principle IV (Build Integrity & Manual Verification)**: ✅ No Next.js source changes → `npm run build` is unaffected. Manual visual + a11y smoke check on the Ghost preview at the affected viewport widths is the merge gate.
- **Principle V (Lean Evolution & Future-Proofing)**: ✅ Minimal vertical slice — modifies one template + one CSS region. Removes more code than it adds (overlay layer, hero-content wrapper, hero-title, fixed-height media query are all deleted). No new abstractions, no new state, no new dependencies.

**Initial Constitution Check**: PASS — no violations, no Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/005-cover-image-header/
├── plan.md              # This file
├── spec.md              # Feature spec (already produced)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (entities — content data only, no persistence)
├── quickstart.md        # Phase 1 output (manual verification steps)
├── contracts/           # Phase 1 output (UI contract — Ghost template variable bindings)
│   └── header-ui-contract.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks — NOT this command)
```

### Source Code (repository root)

```text
ghost_theme/custom-theme/
├── index.hbs                   # MODIFIED — replace .gm-cover-hero markup with image-first layout
├── default.hbs                 # UNCHANGED — site-wide nav/footer
├── assets/
│   └── css/
│       └── screen.css          # MODIFIED — replace .gm-cover-hero* CSS block; retain .gm-page-header* fallback styles; add new .gm-cover-banner* selectors
└── (other partials/templates)  # UNCHANGED

src/                            # Next.js site — UNCHANGED
```

**Structure Decision**: Single project (Option 1). The Ghost theme is the single deliverable for this feature; the Next.js application at the repo root is a separate codebase not modified by this change.

## Phase 0: Outline & Research

### Unknowns from Technical Context

All Technical Context fields are filled; there are no `NEEDS CLARIFICATION` markers. The two functional ambiguities (full-bleed vs. contained, max image height) were resolved in the spec's Clarifications session on 2026-04-27.

### Implementation research questions

The following implementation questions did not block the spec but need decisions before code is written. Each is resolved in `research.md`.

1. **CSS pattern for full-bleed inside the existing layout container** — what's the simplest way to make the cover image span 100 vw given the existing `.gm-content` wrapper? (Decision: `.gm-content` is already full-width — no breakout needed.)
2. **Aspect-ratio preservation without `object-fit: cover` cropping** — how to render the full image (no crop) while still capping height? (Decision: `width: 100%; height: auto; max-height: 50vh; object-fit: contain` on desktop.)
3. **CLS prevention during image load** — how to reserve space so the post grid doesn't jump? (Decision: explicit `width`/`height` HTML attributes on the `<img>` to give the browser an aspect-ratio hint.)
4. **LCP optimization** — how to ensure the cover image is treated as the LCP element with high priority? (Decision: `loading="eager"` + `fetchpriority="high"` + `decoding="async"`.)
5. **Mobile vs desktop height treatment** — does the 50 vh cap apply on mobile too? (Decision: No cap on viewports below the 768 px desktop breakpoint, since at narrow widths the image's natural aspect ratio already produces a reasonable height; the cap kicks in only at desktop to enforce SC-008.)

**Output**: [research.md](./research.md) with all five decisions documented.

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

### 1. Entities → `data-model.md`

This feature has no persistent data model changes. The "data" involved is purely content sourced from the Ghost publication settings, exposed to the theme via the standard `@site` template variable. The data model document enumerates the three template variables consumed and their fallback behavior, since that drives FR-004 (cascading textual fallback when the image is absent).

### 2. Interface contracts → `contracts/`

This feature has no public API. The closest analogue to a contract is the **UI contract** between the Ghost publication settings and the rendered home-page header — i.e., what the theme expects from `@site.cover_image`, `@site.title`, `@site.description`, and how it renders each combination. This is documented in `contracts/header-ui-contract.md`.

### 3. Manual verification → `quickstart.md`

A short, ordered checklist of human-verifiable steps mapped to each Acceptance Scenario in the spec. A site owner (or reviewer) without code knowledge should be able to follow the steps to confirm the feature works end-to-end. Includes desktop, mobile, screen-reader, and image-failure scenarios.

### 4. Agent context update

The repo's `CLAUDE.md` currently points at the active feature plan via free-form text (referencing `specs/003-blog-publish-workflow/plan.md`). After this plan is written, the active-feature reference will be updated to point at `specs/005-cover-image-header/plan.md`, and `<!-- SPECKIT START -->` / `<!-- SPECKIT END -->` markers will be introduced (if not already present) so future `/speckit.plan` runs can update the reference idempotently.

**Output**: [research.md](./research.md), [data-model.md](./data-model.md), [contracts/header-ui-contract.md](./contracts/header-ui-contract.md), [quickstart.md](./quickstart.md), updated `CLAUDE.md`.

### Post-Design Constitution Check

Re-evaluating after Phase 1 design:

- **Principle II**: ✅ Still pure static assets in the Ghost theme. The Next.js static export is untouched.
- **Principle III**: ✅ The contract document explicitly preserves the cover image's accessible name (`alt={{@site.title}}`) and the textual fallback cascade (description → site title) when the image is absent — so the publication identity is always announced to assistive tech, satisfying SC-005.
- **Principle IV**: ✅ No Next.js source changes. The manual smoke check in `quickstart.md` is the merge gate.
- **Principle V**: ✅ Design is strictly subtractive (removes overlay + content wrapper + title text element + fixed-height media query) plus a small additive CSS block. No new dependencies, no new abstractions.

**Post-Design Constitution Check**: PASS.

## Phase 2: Task Planning Approach

*This section describes what the /speckit.tasks command will do — DO NOT execute during /plan.*

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as the base.
- Generate tasks from the Phase 1 design docs, but recognize that this feature is small — expect ~6-10 tasks total, not the template's typical 25-30.
- The four UI contract rows (image-only, image+desc, desc-only, none-of-the-above) collapse into a single template-rewrite task since they all live in the same `{{#if}}` cascade in `index.hbs`.
- One task per CSS region (add new `.gm-cover-banner*` block; remove legacy `.gm-cover-hero*` block).
- One task per manual verification step from `quickstart.md`.

**Ordering Strategy**:

1. Markup change (`index.hbs`) — restructure the cascade and remove the title element.
2. CSS change (`screen.css`) — remove old hero rules; add new banner rules.
3. Local theme preview (run Ghost locally with the modified theme, or upload the theme zip to the staging Ghost instance).
4. Manual verification per `quickstart.md` (desktop, mobile, screen reader, image-failure).
5. Sanity check: `npm run build` (Next.js) to confirm nothing in the Next.js site was incidentally touched.

**Estimated Output**: 6-10 numbered, ordered tasks in `tasks.md`. No tasks marked `[P]` (parallelism is not useful at this scale; the markup and CSS edits are sequential).

**IMPORTANT**: This phase is executed by `/speckit.tasks`, NOT by `/speckit.plan`.

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command.*

- **Phase 3**: `/speckit.tasks` creates `tasks.md`.
- **Phase 4**: `/speckit.implement` (or manual edits) executes the tasks per the constitutional principles.
- **Phase 5**: Manual validation per `quickstart.md`; visual + a11y smoke check; theme upload to Ghost; `npm run build` sanity check on the unrelated Next.js site.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified.*

No violations. Section intentionally empty.

## Progress Tracking

*This checklist is updated during execution flow.*

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach described (/plan command)
- [ ] Phase 3: Tasks generated (/speckit.tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A — none)

---

*Based on Constitution v1.1.1 — see [.specify/memory/constitution.md](../../.specify/memory/constitution.md)*
