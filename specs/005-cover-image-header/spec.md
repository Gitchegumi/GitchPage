# Feature Specification: Cover-Image-First Blog Header

**Feature Branch**: `005-cover-image-header`
**Created**: 2026-04-27
**Status**: Draft
**Input**: User description: "I would like to adjust the Ghost theme so that the publication cover image appears above the site description, and the site title is hidden. The image shows the site title on it. I have attached the image for your reference only, no need to try to upload or embed this specific image. It's already stored in Ghost."

---

## Clarifications

### Session 2026-04-27

- Q: Should the cover image render full-bleed (edge-to-edge across the viewport), contained within the content max-width, or contained inside an additional styled frame? → A: Full-bleed (edge-to-edge across the viewport).
- Q: Should the cover image's rendered height be capped to prevent it from dominating the viewport (especially for tall/portrait source images)? → A: Yes — cap at approximately 50% of viewport height on desktop, preserving aspect ratio.

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT visitors see and WHY
- ❌ Avoid HOW to implement (no template/CSS specifics)
- 👥 Written for the site owner and stakeholders, not theme developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

A first-time visitor lands on the blog home page. The first thing they see in the masthead area is the publication cover image — a branded graphic that already contains the site name as part of its artwork. Directly beneath that image, the visitor reads the publication's short tagline (the site description). The site name does not appear a second time as separate plain text, because the image already conveys it. The visitor immediately understands which site they are on and what it is about, without seeing duplicate or competing branding elements.

### Acceptance Scenarios

1. **Given** a publication that has a cover image and a description configured, **When** a visitor opens the blog home page, **Then** the cover image renders at the top of the page header area and the description text renders directly below the image, with no separate site-title text shown.
2. **Given** the cover image is set and the description is set, **When** a visitor views the page, **Then** the cover image is presented as the dominant visual element of the header (not as a faint background) and the description reads as a clearly legible standalone line of text below it.
3. **Given** a publication that has a cover image but no description, **When** a visitor opens the blog home page, **Then** the cover image still renders at the top of the header area and no empty space, placeholder, or stray site-title text appears in its place.
4. **Given** a publication that has no cover image configured, **When** a visitor opens the blog home page, **Then** a sensible textual fallback appears so the page still has a recognizable header (the site description if present, or, if neither cover image nor description is set, the site name as a last-resort fallback so the page is never headerless).
5. **Given** the home page is loading on a narrow mobile viewport, **When** the header renders, **Then** the cover image scales to fit the viewport width without horizontal scrolling and the description remains readable beneath it.
6. **Given** an assistive-technology user navigates the home page, **When** they reach the header, **Then** the publication's identity is still announced (via the cover image's accessible name) so removing the visible site-title text does not hide the site's identity from screen readers.

### Edge Cases

- **Cover image only, no description**: image displays alone, no orphan title text, no empty caption row.
- **Description only, no cover image**: description displays in a clean text-only header; site name appears as the fallback title only when both image and description are absent.
- **Very tall or very wide cover image**: image is constrained so it does not push the first post card below the fold on a typical desktop viewport.
- **Slow image load**: page layout does not jump significantly once the cover image loads (header reserves space).
- **Image fails to load**: a textual fallback (description, or site name as last resort) is shown so the header is never blank.
- **Existing pages other than the home page** (post pages, tag pages, author pages, error pages) are not affected by this change.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The blog home page header MUST display the publication cover image as a visible, foreground image element (not as a decorative background) when a cover image is configured for the publication.
- **FR-001a**: The cover image MUST render full-bleed — spanning the full viewport width edge-to-edge — sitting flush with the left and right edges of the screen, while the description below it sits within the normal content max-width used by the rest of the page.
- **FR-001b**: On desktop viewports, the cover image's rendered height MUST be capped at approximately 50% of the viewport height (≈ 50 vh) while preserving its natural aspect ratio. The cap MUST ensure that at least one row of post cards remains visible above the fold on a typical 1080p desktop viewport. On mobile and tablet viewports, the image may render at its natural aspect ratio scaled to viewport width without enforcing the desktop cap.
- **FR-002**: The blog home page header MUST display the publication description directly beneath the cover image when a description is configured.
- **FR-003**: The blog home page header MUST NOT render the publication's site title as separate visible text when a cover image is present, because the image already contains the site name.
- **FR-004**: When the publication has no cover image configured, the header MUST fall back to a text-only presentation showing the description (and showing the site title as a last-resort fallback only when neither cover image nor description is configured) so the page is never headerless.
- **FR-005**: The cover image MUST include an accessible text alternative that conveys the publication's identity, so the site name remains discoverable to assistive technologies even though it is no longer rendered as visible body text.
- **FR-006**: The header layout MUST remain responsive: the cover image MUST scale to fit any supported viewport width without causing horizontal page scroll, and the description MUST remain legible on mobile, tablet, and desktop viewports.
- **FR-007**: The change MUST be limited to the publication header on the blog home page (and any listing pages that share the same publication-level header, such as the index and pagination pages). Individual post pages, tag pages, author pages, and error pages MUST NOT have their existing headers altered by this change.
- **FR-008**: The cover image source MUST be the publication-level cover image already configured in the blog CMS — visitors MUST always see the current cover image after the site owner updates it in the CMS, without any further code change.

### Key Entities

- **Publication Cover Image**: The branded header graphic configured at the publication level in the CMS. Already contains the site name as part of the artwork. This is the asset that should now appear as the primary header visual.
- **Site Description**: The short tagline configured at the publication level in the CMS. Appears as plain text directly under the cover image.
- **Site Title**: The publication's textual name configured in the CMS. Continues to be used for browser tab titles, metadata, and the cover image's accessible alternative text, but is no longer rendered as separate visible text inside the home-page header when a cover image is present.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of home-page loads with a cover image configured display the cover image in the header area and do not display the site title as separate visible text.
- **SC-002**: 100% of home-page loads with a cover image configured display the description (when one is configured) immediately below the cover image, with no other header text element between them.
- **SC-003**: A visitor identifies the publication's name and tagline within the first 3 seconds of landing on the home page, without seeing any duplicated or conflicting branding text.
- **SC-004**: On viewports as narrow as 360 px wide, the header renders without horizontal scrolling and the description text remains fully readable (no clipping, no overlap with the cover image).
- **SC-005**: An assistive-technology user, navigating with a screen reader, hears the publication's identity announced when the header is reached, even though the site title is no longer rendered as visible body text.
- **SC-006**: Pages other than the home page (individual posts, tag/author archives, error pages) show the same header they showed before this change — verified by zero visual differences on those routes.
- **SC-007**: When the site owner replaces the cover image in the CMS and republishes, the new image appears in the home-page header on the next site rebuild with no additional manual steps in the theme code.
- **SC-008**: On a typical 1080p desktop viewport (1920×1080), the cover image occupies no more than ~50% of the visible viewport height, and at least one row of post cards is visible above the fold without scrolling.
- **SC-009**: On any viewport at any supported width, the cover image renders flush to the left and right edges of the screen with no visible page-background gutter on either side of the image.

---

## Assumptions

- The publication cover image already encodes the site name visibly within the artwork (as confirmed by the user's reference image), so suppressing the separate site-title text element will not make the site name disappear visually.
- Hiding the site title text refers specifically to the visible text element inside the home-page header; the site title continues to be used elsewhere (browser tab title, social/SEO metadata, image alt text, RSS feeds, etc.) and those uses are out of scope and unchanged.
- "Above the description" means stacked vertically with the cover image on top and the description directly below — not side-by-side, and not overlaid on top of the image.
- The change applies to the publication-level header (home/index/pagination). Per-post hero images on individual post pages are unrelated and out of scope.
- The cover image is sized appropriately for header use by the site owner in the CMS; this feature does not introduce server-side image processing or cropping.

---

## Out of Scope

- Changes to navigation, footer, post cards, individual post pages, tag/author pages, or error pages.
- Image upload, image storage, image cropping, or any CMS-side image management.
- Changes to SEO/metadata, social-sharing previews, or RSS output.
- Changes to the publication header on any surface other than the blog home page and its paginated listing pages.
- Visual redesign of the description typography beyond what is needed to read cleanly directly beneath the new cover image.

---

## Dependencies

- A publication cover image must be configured in the blog CMS for the new layout to appear; otherwise the textual fallback applies.
- A site description configured in the CMS is required for the description line to appear under the image; without one, only the image is shown (no empty caption).
