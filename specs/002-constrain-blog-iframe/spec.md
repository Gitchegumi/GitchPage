# Feature Specification: Constrain Blog Iframe & Surface Subscribe Form

**Feature Branch**: `002-constrain-blog-iframe`
**Created**: 2026-04-22
**Amended**: 2026-04-23 — subscription tier choice added; "Blog Subscribers" email group introduced
**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

A visitor arrives at the blog listing page (`/blog`) or opens an individual blog post (`/blog/[category]/[slug]`). In both cases, they see only the blog content — no ERPNext header or footer bleeds into view regardless of scrolling. A subscribe form is visible on the main blog listing page without requiring any scrolling. The form asks for their email and lets them choose what they want to hear about — blog posts only, or everything including future shop and product updates — with a plain-language description of each option so they can make an informed choice.

### Acceptance Scenarios

1. **Given** a visitor is on the main blog page (`/blog`), **When** they scroll up inside the iframe, **Then** the ERPNext header does not come into view.
2. **Given** a visitor is on the main blog page (`/blog`), **When** they scroll down inside the iframe, **Then** the ERPNext footer does not come into view.
3. **Given** a visitor is on an individual blog post (`/blog/[category]/[slug]`), **When** they scroll up, **Then** the ERPNext header does not come into view.
4. **Given** a visitor is on an individual blog post (`/blog/[category]/[slug]`), **When** they scroll down to the end of the post, **Then** the ERPNext footer does not come into view.
5. **Given** a visitor is on the main blog page (`/blog`), **When** the page loads, **Then** a subscribe form is visible within the initial viewport on any screen width of 375px or wider, without requiring any page-level scrolling.
6. **Given** a visitor fills in their email and selects "Blog only", **When** they submit, **Then** they are added to the ERPNext "Blog Subscribers" email group and receive confirmation feedback.
7. **Given** a visitor fills in their email and selects "Tell me everything", **When** they submit, **Then** they are added to the ERPNext "Website" email group and receive confirmation feedback.
8. **Given** a visitor views the subscribe form, **When** they read the option labels, **Then** each option includes a plain-language description that makes the difference clear without requiring any prior knowledge of the site's structure.

### Edge Cases

- What happens if a visitor submits without selecting an option — is a default applied or is selection required?
- What happens on short blog posts where the iframe height may not fill the page — does the footer creep in?
- If the ERPNext page structure changes (e.g., new header height), does the constraint remain effective?
- Can a visitor be on both lists simultaneously, or does selecting one preclude the other?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The blog listing iframe (`/blog`) MUST prevent the ERPNext header from scrolling into view.
- **FR-002**: The blog listing iframe (`/blog`) MUST prevent the ERPNext footer from scrolling into view.
- **FR-003**: Individual blog post iframes (`/blog/[category]/[slug]`) MUST prevent the ERPNext header from scrolling into view.
- **FR-004**: Individual blog post iframes (`/blog/[category]/[slug]`) MUST prevent the ERPNext footer from scrolling into view.
- **FR-005**: A subscribe form MUST be visible on the main blog listing page within the initial viewport on any screen width of 375px or wider, without requiring page-level scrolling.
- **FR-006**: The subscribe form MUST present two clearly labelled subscription options with plain-language descriptions of what each entails.
- **FR-007**: Selecting "Blog only" (or equivalent label) MUST add the subscriber to the ERPNext "Blog Subscribers" email group.
- **FR-008**: Selecting "Tell me everything" (or equivalent label) MUST add the subscriber to the ERPNext "Website" email group.
- **FR-009**: The subscribe form MUST provide clear success or error feedback after submission.
- **FR-010**: The subscribe form design MUST be consistent with existing GitchPage brand styles (brand colors, typography, and glass aesthetic).
- **FR-011**: A "Blog Subscribers" email group MUST exist in ERPNext prior to the form going live.

### Assumptions

- The existing `?embed=1` parameter already hides the ERPNext header/footer for the blog listing page; individual post pages need the same treatment or equivalent constraint.
- The subscribe form is rendered natively in Next.js outside the ERPNext iframe, ensuring full control over styling and interaction.
- "Blog Subscribers" receives blog post notifications only. "Website" receives all communications including future ecommerce and product updates.
- A visitor can subscribe to both lists simultaneously; selecting one does not preclude the other. (If this assumption is wrong, the edge case must be revisited.)
- A subscription option selection is required before submission — no silent default is applied.
- The existing n8n subscribe workflow will be updated (or a new one created) to route submissions to the correct ERPNext email group based on the selected option.

### Key Entities

- **Blog listing iframe**: The embedded ERPNext blog index at `/blog`.
- **Blog post iframe**: The embedded ERPNext individual post at `/blog/[category]/[slug]`.
- **Subscribe form**: A custom form rendered in Next.js presenting email input + two subscription tier options, routing to different ERPNext email groups based on selection.
- **"Blog Subscribers" email group**: ERPNext email group receiving blog post notifications only. Does not exist yet — must be created.
- **"Website" email group**: ERPNext email group for all site communications including future ecommerce. Already exists with 3 subscribers.

---

## Success Criteria

- Visitors on both the blog listing and individual post pages cannot scroll to reveal any ERPNext chrome (header or footer) under any circumstance.
- A subscribe form is present and functional on the main blog listing page on all screen sizes without requiring additional navigation.
- Subscribers can clearly distinguish between the two subscription options before committing, without needing to understand the site's backend structure.
- Subscribe form submission correctly routes the user to the chosen email group and returns clear feedback within 5 seconds.
