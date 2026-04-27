# Feature Specification: Ghost Blog Full Integration

**Feature Branch**: `004-ghost-blog-integration`
**Created**: 2026-04-26
**Status**: Draft
**Input**: "I want this to be a full integration. The main page and the theme need to match. Once I merge this spec the website should be fully integrated. Link from home page navbar goes to ghost blog main page and so forth."

---

## Overview

The Gitchegumi Media blog is currently split across three incomplete surfaces: an ERPNext iframe at `/blog`, statically-rendered MDX posts at `/blog/[category]/[slug]`, and a fully operational Ghost blog at `blog.gitchegumi.com`. This feature consolidates everything into a single, seamless experience where `blog.gitchegumi.com` is the canonical blog destination and navigating between it and the main site (`gitchegumi.com`) feels like moving within one cohesive product — not two separate platforms.

---

## Clarifications

### Session 2026-04-26

- Q: For legacy URL redirects, is the slug mapping strictly 1:1 (identical slugs), or is a custom mapping needed? → A: 1:1 slug mapping (e.g., `/blog/tech/my-post` -> `blog.gitchegumi.com/my-post`).
- Q: Should redirects be handled at the application level (Next.js) or infrastructure level? → A: Next.js level (`next.config.ts` or `middleware.ts`).
- Q: Should visual parity be achieved via custom theme modification or Ghost Code Injection? → A: Custom Ghost Theme (Handlebars/CSS repo).
- Q: Should the homepage "Latest Blog Posts" keep the ERPNext source or switch to Ghost Content API? → A: Switch to Ghost Content API (canonical source).
- Q: Should the glassmorphism effect (backdrop-filter) be replicated exactly or use a fallback? → A: Replicate exactly with CSS `backdrop-filter`.

---

## User Scenarios & Testing

### Primary User Story

As a visitor on `gitchegumi.com`, when I click "Blog" in the navigation I am taken directly to the Ghost blog. The blog looks and feels identical to the main site. Every link in the blog's navigation takes me to the correct page on the main site, and every link on the main site that references the blog takes me to the correct Ghost blog page. There is no iframe, no broken route, and no visual discontinuity at any point in my journey.

### Acceptance Scenarios

1. **Given** a visitor is on `gitchegumi.com`, **when** they click "Blog" in the Work & Content dropdown, **then** they are navigated to `https://blog.gitchegumi.com` — not to the internal `/blog` route.

2. **Given** a visitor is on `https://blog.gitchegumi.com`, **when** they click "Home" in the nav, **then** they are taken to `https://www.gitchegumi.com`.

3. **Given** a visitor navigates to `https://www.gitchegumi.com/blog`, **when** the page loads, **then** they are automatically redirected to `https://blog.gitchegumi.com` with no broken page shown.

4. **Given** a visitor navigates to a legacy MDX blog post URL (e.g., `gitchegumi.com/blog/tech/why-i-switched-to-neovim`), **when** the page loads, **then** they are redirected to the equivalent Ghost blog post URL so no links rot.

5. **Given** a visitor views the Ghost blog at any viewport size, **when** they compare the navigation bar to `gitchegumi.com`, **then** the header and footer are visually indistinguishable — same colours, spacing, glassmorphism effect, brand typography, and logo treatment.

6. **Given** a visitor views the Ghost blog navigation, **when** they look for membership or authentication controls ("Sign in", "Subscribe"), **then** none are visible — matching the main site which shows no such controls.

7. **Given** the Ghost blog's "Work & Content" dropdown is open, **when** a visitor inspects the Socials section, **then** "Instagram", "X", and "Facebook" labels appear in brand-orange — matching the main site dropdown identically.

8. **Given** a visitor is on the Ghost blog and opens any dropdown, **when** they examine item titles ("Technical CV", "Voice Over", "Blog", etc.), **then** those titles render in the same colour and weight as on the main site.

9. **Given** the main site homepage displays "Latest Blog Posts", **when** a visitor clicks a post card, **then** they are taken to the corresponding post on `blog.gitchegumi.com`.

### Edge Cases

- What happens if the Ghost blog is temporarily down — the main site's "Blog" nav link should navigate to the Ghost blog URL anyway (no silent fallback to iframe).
- What happens to bookmarked legacy URLs (e.g., `/blog/tech/why-i-switched-to-neovim`) — they must redirect rather than return a 404.
- What happens on mobile — the hamburger menu on the Ghost blog must work identically to the main site.
- What happens when Ghost membership is enabled on the instance — "Sign in"/"Subscribe" buttons must remain invisible to visitors regardless of Ghost configuration.

---

## Requirements

### Functional Requirements

#### Navigation routing (main site → Ghost blog)

- **FR-001**: The "Blog" navigation link in the main site's Work & Content dropdown MUST point to `https://blog.gitchegumi.com`.
- **FR-002**: The "Blog" link on the main site MUST open the Ghost blog in the same browser tab (not a new tab and not an iframe).
- **FR-003**: Navigating to `https://www.gitchegumi.com/blog` MUST redirect the visitor to `https://blog.gitchegumi.com` via a permanent redirect configured at the Next.js level.
- **FR-004**: Navigating to any legacy MDX blog post URL under `gitchegumi.com/blog/` MUST redirect to the corresponding post on `blog.gitchegumi.com` using a 1:1 slug mapping (ignoring category), configured at the Next.js level.

#### Navigation routing (Ghost blog → main site)

- **FR-005**: Every navigation item in the Ghost blog header that references a main site page (Home, Portfolio, Voice Over, Tools, Shops) MUST link to the correct `gitchegumi.com` URL.
- **FR-006**: The Ghost blog "Blog" nav link MUST point to `https://blog.gitchegumi.com/` (the Ghost blog's own homepage, not back to the main site).

#### Visual integration

- **FR-007**: The Ghost blog navigation bar MUST be visually indistinguishable from the main site navigation bar (modified at the theme level), including exact replication of the glassmorphism effect using CSS `backdrop-filter`, brand colours, border radius, shadows, logo size, brand name typography, and nav item spacing.
- **FR-008**: The Socials section item titles (Instagram, X, Facebook) in the Ghost blog dropdown MUST appear in brand-orange, matching the main site.
- **FR-009**: Dropdown item titles throughout the Ghost blog header MUST match the main site's colour and weight.
- **FR-010**: The Ghost blog MUST NOT display membership or authentication controls ("Sign in", "Subscribe", "Account") visible to visitors.
- **FR-011**: The Ghost blog footer MUST be visually identical to the main site footer in layout, colour, and typography.
- **FR-012**: The Ghost blog body background colour MUST match the main site's dark background.

#### Homepage latest posts

- **FR-013**: Post cards in the main site's "Latest Blog Posts" section MUST link to the corresponding post on `blog.gitchegumi.com`, and the data source MUST be switched from ERPNext to the Ghost Content API.

### Key Entities

- **Ghost Blog**: The canonical blog platform at `blog.gitchegumi.com` — becomes the single source of truth for all published blog content.
- **Main Site `/blog` Route**: The existing internal blog page (currently an ERPNext iframe) — becomes a redirect to the Ghost blog.
- **Legacy MDX Posts**: Static blog posts currently served at `/blog/[category]/[slug]` on the main site — remain accessible via redirects but are no longer the primary content surface.
- **Navigation Bar (both sites)**: The shared design element that must be visually identical across both domains.
- **Ghost Membership Controls**: Platform UI elements ("Sign in", "Subscribe") that must be suppressed from visitor-facing views.

---

## Success Criteria

- Clicking "Blog" from any page on `gitchegumi.com` lands the visitor on `https://blog.gitchegumi.com` within a normal page load — no intermediate pages or iframes.
- The navigation bar of both sites is visually indistinguishable at 1440 px viewport.
- Zero membership or authentication controls are visible in the Ghost blog navigation.
- All "Latest Blog Posts" cards on the main site homepage link to `blog.gitchegumi.com` posts.
- The Ghost blog nav correctly links to all main site destinations with zero broken hrefs.

---

## Assumptions

- The Ghost blog (`blog.gitchegumi.com`) is the accepted canonical blog platform going forward; the ERPNext blog iframe is a legacy artifact to be retired.
- Legacy MDX posts are being archived; it is acceptable for old social links to these posts to return a 404 once the files are removed.
- The existing MDX posts in `src/app/blog/` have already been published to the Ghost blog; content migration is not in scope.
- Ghost membership features are not actively used and should be hidden at the theme level.
- "Indistinguishable" means visual parity — functional platform differences (Ghost CMS vs Next.js) are acceptable as long as visitors cannot perceive them.
- The main site homepage's "Latest Blog Posts" section currently sources data from ERPNext; updating it to link to Ghost post URLs is in scope, but replacing the data source entirely is not (unless straightforward).

---

## Out of Scope

- Content migration of blog posts (assumed already complete in Ghost).
- Ghost admin panel or editor configuration.
- SEO ranking impact (redirects are correct practice; long-term ranking is outside scope).
- Replacing the homepage latest-posts data fetching pipeline (the links must point to Ghost, but the data source change is a separate feature).
- Cross-browser rendering parity beyond standard modern browsers.
- Performance benchmarking between platforms.
  e benchmarking between platforms.
arking between platforms.
  e benchmarking between platforms.
