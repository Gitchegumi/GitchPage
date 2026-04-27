# UI Contract: Blog Home Page Header

**Feature**: 005-cover-image-header
**Date**: 2026-04-27
**Surface**: Blog home / index / paginated listing pages rendered by `ghost_theme/custom-theme/index.hbs`.
**Out of scope**: Individual post pages, tag pages, author pages, error pages.

This document is the contract between the Ghost publication's settings and the rendered home-page header DOM. It defines what the theme expects as input, what it must produce as output, and the invariants that must hold for every combination.

---

## Inputs (consumed by the contract)

| Variable | Source | Required? |
|---|---|---|
| `@site.cover_image` | Ghost Settings → Publication cover | Optional |
| `@site.description` | Ghost Settings → Site description | Optional |
| `@site.title` | Ghost Settings → Site title | Always present |

See [data-model.md](../data-model.md) for full descriptions.

---

## Outputs (rendered DOM)

The header MUST render exactly one of the four output shapes below, selected by the `(cover_image present?, description present?)` matrix.

### Shape A — Cover image + description (the primary case)

```html
<section class="gm-cover-banner" aria-label="{{@site.title}}">
  <img
    class="gm-cover-banner-image"
    src="{{@site.cover_image}}"
    alt="{{@site.title}}"
    width="1620"
    height="900"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</section>
<header class="gm-page-header gm-page-header--below-cover">
  <p class="gm-page-header-desc">{{@site.description}}</p>
</header>
```

Invariants:

- The `.gm-cover-banner` element MUST be a direct child of `.gm-content` (or whichever element wraps the body slot in `default.hbs`) and MUST render full-bleed at 100 % of `.gm-content`'s width (FR-001a, SC-009).
- The `.gm-cover-banner-image` MUST render with its natural aspect ratio preserved (no cropping). On viewports ≥ 768 px, the image's `max-height` MUST be 50 vh (FR-001b, SC-008). On viewports < 768 px, no `max-height` is enforced.
- No element representing the site title (`<h1>`, `<h2>`, etc., containing `@site.title`) is rendered (FR-003).
- The `<p class="gm-page-header-desc">` is the only text element in the header.
- The `width` and `height` HTML attributes on `<img>` MUST match the source image's intrinsic aspect ratio so the browser can reserve layout space and avoid CLS.

### Shape B — Cover image only (no description configured)

```html
<section class="gm-cover-banner" aria-label="{{@site.title}}">
  <img
    class="gm-cover-banner-image"
    src="{{@site.cover_image}}"
    alt="{{@site.title}}"
    width="1620"
    height="900"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</section>
```

Invariants:

- No `<header class="gm-page-header">` follows the banner (no empty caption row).
- No site-title text is rendered (the cover image's `alt` carries the publication identity).

### Shape C — No cover image, description present (text-only fallback)

```html
<header class="gm-page-header">
  <p class="gm-page-header-desc">{{@site.description}}</p>
</header>
```

Invariants:

- No `<img>` is rendered.
- The site title is NOT rendered as visible text in this shape either (FR-004 cascade: description preferred over title when both choices are available, since the description is more informative than the title alone).
- This shape is the existing `.gm-page-header` styling, reused unchanged.

### Shape D — Last-resort fallback (no cover image AND no description)

```html
<header class="gm-page-header">
  <h1 class="gm-page-header-title">{{@site.title}}</h1>
</header>
```

Invariants:

- This is the only output shape in which the site title appears as visible body text in the home-page header. It exists so the page is never headerless when a publication is freshly created with no cover or description configured.
- This shape is the existing `.gm-page-header` styling, reused unchanged.

---

## Selection logic (the `{{#if}}` cascade in `index.hbs`)

```handlebars
{{#if @site.cover_image}}
  {{!-- Shape A or B --}}
  <section class="gm-cover-banner" aria-label="{{@site.title}}">
    <img class="gm-cover-banner-image" src="{{@site.cover_image}}" alt="{{@site.title}}"
         width="1620" height="900" loading="eager" fetchpriority="high" decoding="async">
  </section>
  {{#if @site.description}}
    <header class="gm-page-header gm-page-header--below-cover">
      <p class="gm-page-header-desc">{{@site.description}}</p>
    </header>
  {{/if}}
{{else}}
  <header class="gm-page-header">
    {{#if @site.description}}
      {{!-- Shape C --}}
      <p class="gm-page-header-desc">{{@site.description}}</p>
    {{else}}
      {{!-- Shape D --}}
      <h1 class="gm-page-header-title">{{@site.title}}</h1>
    {{/if}}
  </header>
{{/if}}
```

The cascade above is the canonical implementation; the `tasks.md` will reference it.

---

## Accessibility contract

- The `<section>` element wrapping the cover image carries `aria-label="{{@site.title}}"` so assistive tech announces the publication identity when entering the banner region. This is in addition to the `<img alt>` and is the single source of truth for "this is the publication header" semantics.
- The cover image's `alt` attribute carries the publication's site title verbatim. Removing the visible `<h1>` does NOT remove the title from the accessibility tree.
- No interactive elements are introduced. Focus order and keyboard navigation are unchanged.

---

## Performance contract

- LCP candidate: the cover image (Shape A or B). Marked `fetchpriority="high"` to ensure the browser deprioritizes none of the critical-path resources for it.
- CLS budget: zero layout shift attributable to the cover image's late arrival. Enforced via the `width`/`height` HTML attributes giving the browser an aspect-ratio hint.
- No JavaScript is introduced. Existing theme JS (`assets/js/main.js`) is not modified.

---

## Backwards compatibility

- The legacy `.gm-cover-hero`, `.gm-cover-hero-image`, `.gm-cover-hero-overlay`, `.gm-cover-hero-content`, `.gm-cover-hero-title`, `.gm-cover-hero-desc` selectors are removed from `screen.css` and the corresponding markup is removed from `index.hbs`. Nothing else in the theme references those selectors (verified via grep before implementation).
- The `.gm-page-header*` selectors are retained unchanged for Shapes C and D.

---

## Verification

The four output shapes are exercised in `quickstart.md` step-by-step.
