# Phase 0 Research: Cover-Image-First Blog Header

**Feature**: 005-cover-image-header
**Date**: 2026-04-27

This document resolves the small set of implementation questions identified in the plan. Each question that did not block the spec but needs a decision before code is written is recorded here with a Decision, Rationale, and Alternatives Considered.

---

## R1. Full-bleed inside the existing layout container

**Question**: How do we render the cover image edge-to-edge (100 vw) given that the theme's body content sits inside `<div class="gm-content">`? Do we need a CSS "breakout" pattern (negative margins, `width: 100vw; margin-left: calc(50% - 50vw)`) or does the existing wrapper already allow full-width children?

**Decision**: No breakout needed. Use straight `width: 100%`.

**Rationale**: Inspection of `assets/css/screen.css` shows `.gm-site` is a flex column with no `max-width`, and `.gm-content { flex: 1; }` is also unconstrained — both are full-viewport-width. The post grid below (`.gm-bento-grid`) carries its own `max-width: 90rem` and centering, so the constraint applies *to the grid*, not to siblings of the grid. A new top-level `.gm-cover-banner` element placed as a direct child of `.gm-content` will naturally span 100% of `.gm-content`'s width, which equals the viewport width. The `100vw` breakout pattern is unnecessary and introduces horizontal-scroll bugs when scrollbars are present, so it is actively avoided.

**Alternatives considered**:

- `width: 100vw; margin-left: calc(50% - 50vw);` — classic full-bleed breakout. Rejected: introduces a horizontal scroll bug on Windows browsers when a vertical scrollbar is present (because `100vw` includes the scrollbar gutter). Not needed here because the parent isn't constrained.
- Move the cover banner outside `.gm-content` (directly inside `.gm-site`) — would also work, but requires cross-template coordination since `index.hbs` only controls the `{{{body}}}` slot in `default.hbs`. Rejected as unnecessary complexity.

---

## R2. Aspect-ratio preservation without `object-fit: cover` cropping

**Question**: The current hero uses `object-fit: cover` on a fixed-pixel-height container, which crops the cover image. The new design wants the entire image visible (the artwork's branding shouldn't be cropped). What CSS preserves the natural aspect ratio while still capping the rendered height?

**Decision**: Render the image with `width: 100%; height: auto;` and apply `max-height: 50vh; object-fit: contain;` only at the desktop breakpoint (≥ 768 px). On mobile, no `max-height` and no `object-fit` are applied — the image renders at its natural aspect ratio scaled to viewport width.

**Rationale**:

- `width: 100%; height: auto;` preserves the image's natural aspect ratio at all widths.
- `max-height: 50vh` enforces SC-008 on desktop: at 1080 p (1920×1080), 50 vh is 540 px, leaving the upper half of the viewport for the hero and the lower half for navigation + the first row of post cards.
- `object-fit: contain` (combined with the max-height) ensures that if the cap is reached, the image letterboxes within its box rather than cropping. For the current 16:9 reference image, the cap is rarely reached (a 1920-wide viewport at native 16:9 produces a 1080-wide × 608-tall image, and 608 > 540, so the cap *does* clip a bit on a 1080 p viewport — exactly the intended behavior).
- On mobile (< 768 px), the desktop cap is not appropriate: 50 vh of a 667 px iPhone height is 333 px, which would be too short for the artwork to read. Letting the image scale naturally to viewport width is better.

**Alternatives considered**:

- `aspect-ratio: 16 / 9;` on the container — predictable but locks the layout to a single aspect ratio, breaking if a future cover image has a different ratio. Rejected: less flexible.
- Fixed pixel height (current approach: 280 px / 420 px) — what we are explicitly moving away from. Rejected.
- `object-fit: cover` with the new max-height — would crop the image, defeating the user's stated goal of showing the full branded artwork. Rejected.

---

## R3. CLS prevention during image load

**Question**: When the cover image loads asynchronously, the browser doesn't know its intrinsic dimensions until the headers arrive. Without a hint, the layout reflows when the image arrives and pushes the post grid down — a CLS regression. How do we reserve the right amount of space ahead of time?

**Decision**: Set explicit `width` and `height` HTML attributes on the `<img>` (matching the source image's intrinsic dimensions, e.g., `width="1620" height="900"` for a typical 16:9 hero). Do not set them in CSS — the HTML attributes are the modern aspect-ratio hint that all evergreen browsers honor.

**Rationale**: Modern browsers (Chrome 79+, Firefox 71+, Safari 14+) compute an `aspect-ratio` from the `width` and `height` HTML attributes on `<img>` even when the rendered size is `width: 100%; height: auto;`. This reserves layout space at the correct aspect ratio before the image bytes arrive, eliminating CLS. The values do not need to match the rendered pixel size — they only need to match the source image's aspect ratio. In Handlebars, hard-coding the values is acceptable since the user has already set a specific cover image; if the image is later swapped for one with a different aspect ratio, the attributes can be updated in the same commit.

**Alternatives considered**:

- `aspect-ratio: 1620 / 900;` in CSS on the `<img>` — works in modern browsers but redundant when the HTML attributes are set, and CSS alone leaves older Safari versions without a hint during the initial paint. Rejected as redundant; HTML attributes are sufficient.
- Server-side image-dimension probing in Handlebars — Ghost provides `{{img_url}}` helpers but does not natively expose intrinsic dimensions in the theme context. Adding a build-time probe would violate Constitution Principle V (avoid premature complexity). Rejected.

---

## R4. LCP optimization for the hero image

**Question**: The cover image will be the LCP element on the home page. The Constitution targets LCP < 2.5 s. How do we ensure the browser fetches it as early and aggressively as possible?

**Decision**: Add three attributes to the `<img>` tag:

- `loading="eager"` — opt out of any default lazy-loading behavior (the image is above the fold, so eager is correct).
- `fetchpriority="high"` — signal the browser's resource prioritizer that this image is critical-path and should be fetched ahead of other lower-priority resources.
- `decoding="async"` — allow the browser to decode the image off the main thread once bytes arrive, so decoding doesn't block the first paint of the surrounding text.

**Rationale**: This is the canonical LCP-hero-image pattern. `loading="eager"` is the default for non-lazy images but is set explicitly for clarity. `fetchpriority="high"` (Chrome 101+, Safari 17.2+, Firefox 119+) is the single biggest LCP win on cold loads — it raises the image from "Low" (browser's default for `<img>`) to "High", letting it compete with CSS and HTML for early bandwidth. `decoding="async"` is harmless on modern browsers and prevents a small main-thread stall on slower CPUs. No `<link rel="preload">` is added; `fetchpriority="high"` on the image itself is sufficient and avoids the double-fetch trap.

**Alternatives considered**:

- `<link rel="preload" as="image" href="...">` in `<head>` — also effective but adds complexity (the cover image URL has to be templated into the head, which is in `default.hbs`, not `index.hbs`). `fetchpriority="high"` on the `<img>` itself produces the same outcome with no cross-template coupling. Rejected as more complex.
- No optimization (rely on browser defaults) — would push the hero image to default `Low` priority, regressing LCP versus the current implementation, which is unacceptable. Rejected.

---

## R5. Mobile vs desktop height treatment

**Question**: The clarification specifies "cap at ~50 % viewport height on desktop." Should the same cap apply on mobile?

**Decision**: No cap on mobile. Apply `max-height: 50vh` only inside an `@media (min-width: 768px)` query.

**Rationale**:

- 50 vh of a typical mobile viewport (e.g., 667 px on an older iPhone) is 333 px; that's smaller than the natural rendered height of a 16:9 image at 360 px wide (which would be 360 × 9/16 = 202 px). So at most mobile widths the cap doesn't bind anyway.
- For taller mobile viewports (e.g., 932 px on iPhone 14 Pro Max), 50 vh = 466 px, which would force `object-fit: contain` letterboxing on the natural image — visually worse than just letting the image render at its natural aspect ratio.
- On desktop, the cap matters because viewport widths are large and 16:9 images become tall in absolute terms (1920 × 9/16 = 1080 px, which would consume 100 vh of a 1080 p screen).
- Mobile users already expect to scroll, and the artwork is the brand statement of the page — letting it render at full natural size on mobile is the correct UX.

**Alternatives considered**:

- Apply the same 50 vh cap on mobile — would letterbox the image on tall mobile viewports for no UX gain. Rejected.
- Use a different cap on mobile (e.g., 30 vh) — adds tuning complexity with no clear benefit; the natural aspect ratio scales reasonably on mobile. Rejected.

---

## Summary table

| ID | Question | Decision |
|----|----------|----------|
| R1 | Full-bleed pattern | No breakout needed; the existing `.gm-content` is full-width. Use plain `width: 100%`. |
| R2 | Aspect-ratio preservation | `width: 100%; height: auto;` always; `max-height: 50vh; object-fit: contain;` only ≥ 768 px. |
| R3 | CLS prevention | Set HTML `width`/`height` attributes on `<img>` matching the source image's aspect ratio. |
| R4 | LCP optimization | `loading="eager"` + `fetchpriority="high"` + `decoding="async"` on the `<img>`. |
| R5 | Mobile height cap | None. Cap applies only at desktop breakpoint. |

All `NEEDS CLARIFICATION` items resolved. Ready for Phase 1.
