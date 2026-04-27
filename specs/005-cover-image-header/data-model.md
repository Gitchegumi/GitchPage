# Phase 1 Data Model: Cover-Image-First Blog Header

**Feature**: 005-cover-image-header
**Date**: 2026-04-27

This feature introduces no persistent data model changes. The "data" rendered by the new header consists of three values exposed by the Ghost CMS through standard theme template variables. This document enumerates those variables, their source, the validation rules the theme imposes on them, and the rendered output for each combination.

---

## Source

All three values originate in **Ghost publication settings** (Settings → General → Publication info / Publication cover) and are exposed to the Handlebars theme via the `@site` global context object provided by the Ghost theme runtime. The theme does not read them from any other source; there is no theme-level cache, override, or parameter for them.

---

## Entities (template variables)

### Publication Cover Image

- **Template variable**: `@site.cover_image`
- **Type**: URL string, or `null` / `undefined` when no cover image is configured.
- **Source**: Ghost Settings → General → Publication cover (uploaded image asset stored in Ghost's content directory).
- **Lifecycle**: Set/replaced via the Ghost admin UI. The theme reads the current value at request time (or build time, depending on Ghost's caching layer); no theme code change is required when the site owner replaces the image (FR-008, SC-007).
- **Validation rules imposed by the theme**:
  - The theme MUST treat any non-empty truthy value as "image present" and any falsy value (null/undefined/empty string) as "image absent."
  - The theme MUST NOT attempt to fetch, validate, resize, or transform the URL — the image asset is whatever Ghost provides.
- **Used by**: FR-001, FR-001a, FR-001b, FR-002 (presence triggers description-below-image layout), FR-008 (the URL is bound directly into the `<img src>`).

### Site Description

- **Template variable**: `@site.description`
- **Type**: Plain-text string (no HTML), or `null` / `undefined` when no description is configured.
- **Source**: Ghost Settings → General → Site description (short tagline; Ghost's UI typically caps at ~200 characters).
- **Lifecycle**: Set/edited via the Ghost admin UI.
- **Validation rules imposed by the theme**:
  - The theme MUST render the description as plain text only (Ghost already provides it as plain text — no HTML escaping concerns beyond Handlebars' default `{{description}}` escaping).
  - The theme MUST treat empty string as "absent" for the purposes of FR-002 (do not render an empty `<p>`).
- **Used by**: FR-002 (renders directly below the cover image when both are present), FR-004 (renders alone when no cover image is set).

### Site Title

- **Template variable**: `@site.title`
- **Type**: Plain-text string. Always non-empty in practice (Ghost requires a title).
- **Source**: Ghost Settings → General → Site title.
- **Lifecycle**: Set/edited via the Ghost admin UI.
- **Validation rules imposed by the theme**:
  - The theme MUST use the title as the cover image's `alt` text (FR-005).
  - The theme MUST NOT render the title as visible body text inside the home-page header when a cover image is present (FR-003).
  - The theme MAY render the title as the last-resort fallback when neither cover image nor description is configured (FR-004).
  - The title continues to flow through other Ghost helpers (`{{meta_title}}`, `<title>`, social/SEO metadata) outside of this feature's scope.
- **Used by**: FR-003 (excluded from rendering when cover image present), FR-004 (last-resort fallback), FR-005 (image `alt` attribute).

---

## Rendering matrix

The cascade of `{{#if @site.cover_image}}` / `{{else}}` / `{{else if @site.description}}` etc. in `index.hbs` MUST produce these outputs:

| `cover_image` | `description` | Rendered output | Spec ref |
|---|---|---|---|
| present | present | `<img>` (cover, full-bleed, capped on desktop) followed by `<p>` (description). No site-title text. | FR-001/001a/001b/002/003, AS-1/AS-2 |
| present | absent | `<img>` (cover) only. No empty `<p>`, no site-title text. | AS-3, Edge case "Cover image only, no description" |
| absent | present | `<p>` description in the existing `.gm-page-header` text-only fallback. | FR-004, Edge case "Description only, no cover image" |
| absent | absent | Site title rendered as the last-resort visible header text in `.gm-page-header`. | FR-004, Edge case "no cover image and no description" |

Notes:

- The "absent" rows reuse the existing `.gm-page-header` / `.gm-page-header-title` / `.gm-page-header-desc` markup that already exists in `index.hbs` for the no-cover-image case. They are unchanged by this feature.
- The "present" rows are new markup (`.gm-cover-banner` + standalone `.gm-page-header-desc`-styled paragraph) replacing the current `.gm-cover-hero` overlay markup.

---

## Lifecycle / state transitions

This feature has no state — the cascade is a pure function of the three template variables at render time. There is no client-side state, no cookies, no local storage, no event handlers introduced.

---

## Out of scope (data-model perspective)

- Per-post hero images (`{{post.feature_image}}` on individual post pages) — unchanged by this feature.
- Tag/author archive page headers (which use their own variables, e.g., `{{tag.name}}`) — unchanged.
- SEO/social metadata (`{{ghost_head}}` injection) — unchanged.
- Image processing, resizing, or CDN concerns — Ghost handles these upstream of the theme.
