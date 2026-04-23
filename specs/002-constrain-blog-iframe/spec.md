# Feature Specification: Constrain Blog Iframe & Surface Subscribe Form

**Feature Branch**: `002-constrain-blog-iframe`
**Created**: 2026-04-22
**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

A visitor arrives at the blog listing page (`/blog`) or opens an individual blog post (`/blog/[category]/[slug]`). In both cases, they see only the blog content — no ERPNext header or footer bleeds into view regardless of scrolling. A subscribe form is visible on the main blog listing page without requiring any scrolling.

### Acceptance Scenarios

1. **Given** a visitor is on the main blog page (`/blog`), **When** they scroll up inside the iframe, **Then** the ERPNext header does not come into view.
2. **Given** a visitor is on the main blog page (`/blog`), **When** they scroll down inside the iframe, **Then** the ERPNext footer does not come into view.
3. **Given** a visitor is on an individual blog post (`/blog/[category]/[slug]`), **When** they scroll up, **Then** the ERPNext header does not come into view.
4. **Given** a visitor is on an individual blog post (`/blog/[category]/[slug]`), **When** they scroll down to the end of the post, **Then** the ERPNext footer does not come into view.
5. **Given** a visitor is on the main blog page (`/blog`), **When** the page loads, **Then** a subscribe form is visible within the initial viewport on any screen width of 375px or wider, without requiring any page-level scrolling.
6. **Given** a visitor submits their email in the subscribe form, **When** the form is submitted, **Then** they are added to the ERPNext "Website" email group and receive confirmation feedback.

### Edge Cases

- What happens on short blog posts where the iframe height may not fill the page — does the footer creep in?
- How does the subscribe form behave on narrow/mobile viewports inside the constrained iframe?
- If the ERPNext page structure changes (e.g., new header height), does the constraint remain effective?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The blog listing iframe (`/blog`) MUST prevent the ERPNext header from scrolling into view.
- **FR-002**: The blog listing iframe (`/blog`) MUST prevent the ERPNext footer from scrolling into view.
- **FR-003**: Individual blog post iframes (`/blog/[category]/[slug]`) MUST prevent the ERPNext header from scrolling into view.
- **FR-004**: Individual blog post iframes (`/blog/[category]/[slug]`) MUST prevent the ERPNext footer from scrolling into view.
- **FR-005**: A subscribe form MUST be visible on the main blog listing page without requiring users to scroll past the blog content.
- **FR-006**: The subscribe form MUST add the submitted email to the ERPNext "Website" email group.
- **FR-007**: The subscribe form MUST provide clear success or error feedback after submission.
- **FR-008**: The subscribe form design MUST be consistent with existing GitchPage brand styles (brand colors, typography, and glass aesthetic).

### Assumptions

- The existing `?embed=1` parameter already hides the ERPNext header/footer for the blog listing page; individual post pages need the same treatment or equivalent constraint.
- A new ERPNext Web Form or the existing GitchPage `SubscribeForm` component can be used for the subscribe field on the main blog page — whichever is simpler to surface inside a constrained view.
- The subscribe form on the main blog page can be rendered outside the iframe (natively in Next.js) rather than inside the ERPNext iframe, as long as it visually integrates with the blog layout.

### Key Entities

- **Blog listing iframe**: The embedded ERPNext blog index at `/blog`, currently constrained to hide header/footer on scroll-up.
- **Blog post iframe**: The embedded ERPNext individual post at `/blog/[category]/[slug]`, currently unconstrained — allows scrolling to reveal header/footer.
- **Subscribe form**: A form accepting an email address, submitting to ERPNext "Website" email group. May be the existing `SubscribeForm` component (posts to n8n) or a new ERPNext-native form.

---

## Success Criteria

- Visitors on both the blog listing and individual post pages cannot scroll to reveal any ERPNext chrome (header or footer) under any circumstance.
- A subscribe form is present and functional on the main blog listing page on all screen sizes without requiring additional navigation.
- Subscribe form submission correctly registers the user and returns clear feedback within a reasonable response time.
