# Manual Verification: Cover-Image-First Blog Header

**Feature**: 005-cover-image-header
**Date**: 2026-04-27

This is the human-executable validation checklist for the feature. A reviewer (or the site owner) without code knowledge should be able to walk through these steps and confirm the feature works. Each numbered step maps back to one or more Acceptance Scenarios (AS-N) or Success Criteria (SC-N) in [spec.md](./spec.md).

---

## Setup

1. Start the local Ghost preview (or upload the modified theme zip to the staging Ghost instance) so the modified theme is the active theme of the publication.
2. Confirm that the publication's **Publication cover** is set to the intended branded artwork in Ghost Settings → General. (For full verification, you'll temporarily clear it later — see step 9.)
3. Confirm that the publication's **Site description** is non-empty (e.g., "Gaming. Thoughts. Adventure.").
4. Open the blog home page (`/`) in a Chromium-based browser at desktop width (≥ 1280 px) — this is the baseline view.

---

## Desktop verification (Shape A: cover + description)

5. **AS-1, AS-2, FR-001, FR-001a, FR-002, SC-001, SC-002, SC-009**: With the page loaded, visually confirm:
   - [ ] The cover image appears at the top of the page, beneath the navigation bar.
   - [ ] The image renders flush to the **left and right edges of the screen** (no page-background gutter on either side).
   - [ ] The image is shown as a visible foreground graphic — not faded behind text, not darkened by an overlay.
   - [ ] **No separate text element repeats the site title** beneath the image (the title appears only as part of the image artwork).
   - [ ] The site description text appears as a single line of plain text **directly beneath the image**, with no other text element between.

6. **FR-001b, SC-008**: Confirm the height cap behaves on a typical desktop:
   - [ ] On a 1080 p (1920 × 1080) viewport, the cover image occupies no more than roughly half the visible viewport vertically.
   - [ ] **At least one row of post cards is visible above the fold** without scrolling.

7. **R3 / CLS**: Hard-reload the page (`Ctrl+Shift+R`) and watch the area where the cover image will appear:
   - [ ] The post-card grid below does **not jump downward** when the cover image finishes loading. (If it jumps, the `width`/`height` attributes on the `<img>` are wrong or missing.)

8. **R4 / LCP**: Open DevTools → Network → reload with cache disabled. Confirm:
   - [ ] The cover image request shows priority **High** (in the Priority column). If it shows Low or Medium, the `fetchpriority="high"` attribute was not applied.

---

## Mobile verification (Shape A on narrow viewports)

9. **AS-5, FR-006, SC-004**: Open DevTools → Toggle Device Toolbar → set the viewport to 360 × 640 (narrow mobile). Reload.
   - [ ] No horizontal scrollbar appears.
   - [ ] The cover image fills the screen width edge-to-edge.
   - [ ] The description text below remains fully readable — no clipping, no overlap with the image.

10. Switch the viewport to 768 × 1024 (tablet) and 414 × 896 (large mobile).
    - [ ] The cover image scales naturally without the desktop max-height cap making it disproportionately small.

---

## Fallback verification (Shapes B, C, D)

11. **AS-3, Shape B — cover image, no description**: In Ghost Settings → General, temporarily blank the **Site description**. Reload the home page.
    - [ ] The cover image still renders at the top.
    - [ ] No empty paragraph or stray site-title text appears below it.
    - [ ] The post grid begins immediately after the cover image (no extra vertical gap from an empty caption row).
    - Restore the site description before continuing.

12. **AS-4 first half, Shape C — no cover image, description present**: In Ghost Settings → General, temporarily clear the **Publication cover** (delete the uploaded image). Reload the home page.
    - [ ] No `<img>` renders. No empty image placeholder appears.
    - [ ] The description text appears in a clean text-only header at the top of the page.
    - [ ] No site-title text appears in this header either (because the description is present).
    - Restore the publication cover before continuing.

13. **AS-4 second half, Shape D — no cover image AND no description**: In Ghost Settings → General, temporarily clear **both** the Publication cover and the Site description. Reload the home page.
    - [ ] The site title appears as visible body text in the header (last-resort fallback). The page is never headerless.
    - Restore both settings before continuing.

---

## Accessibility verification

14. **AS-6, FR-005, SC-005**: With the cover image restored, navigate the home page using a screen reader (VoiceOver on macOS, NVDA on Windows, or TalkBack on Android):
    - [ ] When focus enters the cover-banner region, the screen reader announces the publication's site title (via the `<section aria-label>` or the image `alt`, depending on the reader's announcement order).
    - [ ] The site title is therefore still discoverable to assistive-tech users even though the visible site-title text element is gone.

15. **Keyboard-only**: Tab from the URL bar into the page.
    - [ ] No new focus stops are introduced inside the cover-banner region (the banner is non-interactive).
    - [ ] The first interactive focus stop after the banner is the same one that existed before this change (the navigation, search, or first post link).

---

## Image-failure verification

16. **Edge case — image fails to load**: In DevTools → Network, block the cover image's URL pattern. Reload.
    - [ ] The page still renders without errors.
    - [ ] The space reserved for the cover image collapses gracefully (the `alt` text may render in its place; this is acceptable).
    - [ ] The post grid below renders correctly.

---

## Other-page non-regression

17. **AS / Out-of-Scope, SC-006**: Visit each of the following routes and confirm the header looks **exactly the same as it did before this change**:
    - [ ] An individual post page (e.g., `/welcome/`).
    - [ ] A tag archive page (e.g., `/tag/news/`).
    - [ ] An author page (e.g., `/author/{author}/`).
    - [ ] The 404 / error page.

---

## Build sanity (Next.js, unrelated)

18. **Constitution IV**: Although this feature does not touch the Next.js site, run `npm run build` from the repo root.
    - [ ] The build succeeds with zero type errors. (If it fails, an unrelated regression has occurred and must be addressed before merge.)

---

## Sign-off

When every checkbox above is checked, the feature meets its spec and is ready for merge to `main`. Capture any unchecked items as follow-up work in the PR description.
