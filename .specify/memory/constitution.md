<!--
Sync Impact Report
Version change: 2.0.0 -> 2.0.1
Modified principles: None
Added sections: None
Removed sections: None
Updated sections:
  - Platform Constraints: identifies Ghost as the blog CMS and publishing platform.
  - Platform Constraints: limits ERPNext to its prospective commerce responsibilities.
  - Delivery & Quality Workflow: classifies Ghost post edits as content-only changes.
Templates requiring updates: None; Spec Kit templates read this constitution at runtime.
Follow-up TODOs: None outstanding.
-->

# GitchPage Constitution

## Core Principles

### I. Content Authenticity First

All published content (blog posts, portfolio entries, voice-over demos) MUST be original, attributable, and
truthfully represent skills, experience, or creative perspective. AI-assisted generation may be used for
draft acceleration but final narrative, claims, and attributions MUST be human-reviewed. No filler, no
traffic-bait posts. Removal or correction is mandatory within 48h if inaccuracies are found.

### II. Sustainable Static Foundation (Progressive Enhancement)

Primary delivery uses static generation (Next.js App Router SSG) for reliability, performance, and low
operational overhead. Dynamic capabilities (future e-commerce, interactive dashboards) MUST layer on via
isolated, opt-in API routes or edge functions without degrading existing static paths. Core pages must
remain deployable as pure static export unless a deliberate architectural migration is ratified.

### III. Design & Accessibility Discipline

Visual design changes MUST preserve legibility (WCAG AA contrast), keyboard navigability, and semantic
structure (headings, landmarks, aria roles where appropriate). Media (audio demos, images) MUST include
textual context (alt text, captions/description). Any theme or component refactor requires a manual a11y
smoke checklist before merge.

### IV. CI-Backed Build Integrity & Verification

The GitHub Actions build on `dev` MUST succeed for the integrated commit before `dev` is promoted to
`main`. This CI run is the authoritative build and integration gate because it uses the repository's
deployment configuration and actual GitHub environment variables. A local `npm run build` is optional,
MUST NOT be required for routine promotion, and MUST NOT substitute for a successful `dev` CI run.
Local builds MAY be used to diagnose failures or validate unusually risky work before review. Structural
changes (layout, routing, component logic) MUST also pass an appropriate manual visual and accessibility
smoke check across the affected pages. Failed CI blocks promotion and publish - no exceptions.

### V. Lean Evolution & Future-Proofing

New capabilities (e-commerce, user accounts) MUST start as a minimal vertical slice (walking skeleton) with
explicit rollback criteria. Complexity (state management libraries, ORM, background workers) MUST appear
only after a concrete scaling or maintainability trigger is documented. Prefer deleting unused code over
generalizing for hypothetical reuse. Version increments reflect meaningful governance or scope shifts.

## Platform Constraints

The site is a personal portfolio and knowledge hub. The delivery stack is:

- **Next.js** (TypeScript) — static export deployed to GitHub Pages (`gitchegumi.com`)
- **Ghost** - blog CMS and publishing platform, with its theme maintained under `ghost_theme/`
- **ERPNext** (`erp.gitchegumi.com`) - prospective eCommerce support for digital products,
  invoicing, and inventory if that phase begins
- **n8n** (`n8n.gitchegumi.com`) — automation middleware (subscribe flows, publish triggers, CRM leads)
- **Homelab** (TrueNAS + Docker Compose + Nginx Proxy Manager) — self-hosted infrastructure for all
  services above

Current functional domains:

- Blog (Ghost CMS and publication theme)
- Portfolio / CV
- Voice-over demo reels (audio streaming)

Forward-looking domain: eCommerce via ERPNext (digital products or booking). Any commerce introduction
MUST isolate payment handling, avoid storing raw PII locally, and undergo a security review
(dependency audit + threat sketch) prior to launch.

Performance budgets:

- Core static page TTI under 2s on mid-tier mobile (simulated 3G fast) for first contentful render.
- Largest Contentful Paint target < 2.5s for home and blog index.
- Images MUST be optimized (Next/Image or pre-compressed) and not exceed necessary resolution.

Content governance:

- Ghost blog posts MUST include: title, description, category, and published date before going live.
- Feature images MUST use descriptive, kebab-case filenames.
- Deleting a post requires a redirect strategy or explicit acceptance of 404 with a note logged.

Security & privacy:

- No collection of user credentials until governance updated.
- Third-party scripts MUST be enumerated in a scripts ledger (future doc) before inclusion.
- Audio/media hosting remains local unless bandwidth metrics justify CDN.

## Delivery & Quality Workflow

Workflow stages:

1. Create a feature or fix branch from `main` when independent, or from `dev` when it depends on
   unreleased integrated work.
2. Open a pull request from the feature or fix branch into `dev`.
3. Merge into `dev` for integration validation.
4. Require the GitHub Actions build on `dev` to pass using the configured deployment environment.
5. Complete applicable manual smoke checks for the affected pages.
6. Open a pull request from `dev` into `main`.
7. Complete code review.
8. Merge into `main` to trigger the production GitHub Pages publish workflow.

Feature and fix branches MUST NOT target `main` directly. `dev` is the integration branch and MAY be
ahead of `main` while multiple features are in progress. When no unreleased work remains, `dev` and
`main` SHOULD be aligned.

Quality gates (mandatory before merge):

- The GitHub Actions build on `dev` succeeds for the exact integrated commit with zero type errors.
- Local build results are diagnostic only and are not required acceptance evidence.
- Manual visual check: affected pages render correctly on desktop and mobile.
- Accessibility spot check: keyboard navigation and semantics work across affected surfaces.
- Lighthouse (or similar) sample run recorded for major layout shifts (manual, as needed).

Change classification:

- Content-only: Ghost post edits (no code logic) -> no build step required; publish directly.
- Structural: component/layout logic or routing -> requires successful `dev` CI + manual a11y smoke check.
- Platform expansion (new domain like eCommerce) -> requires governance amendment PR.

Rollbacks:

- Failed deployment with content regression → revert commit within 2h.
- Security concern (dependency vuln with exploit path) → hotfix branch prioritized over feature branches.

Documentation expectations:

- Any new script or npm command MUST be documented in `README.md`.
- Non-trivial architectural decisions SHOULD append an ADR entry (ADR log TBD; placeholder for future adoption).
- All `.specify` markdown files MUST follow Prettier markdown standards: blank line after every heading,
  language designation on all fenced code blocks (use `text` for plain prose/pseudo-code blocks).

## Governance

Authority & scope:

This constitution governs technical quality, content integrity, and evolutionary constraints for GitchPage. It
supersedes ad hoc preferences. Deviations require an amendment.

Amendments:

- Proposed via PR labeled `governance` with summary, rationale, version bump type (MAJOR/MINOR/PATCH).
- MUST include impact review: principles affected, templates needing updates, migration/rollback notes.
- Approval: single maintainer (self-review) with documented rationale is acceptable for this personal project;
  future collaborators would require at least one additional reviewer.

Versioning policy:

- MAJOR: Removal or redefinition of a principle; introduction of persistent user data or authentication layer.
- MINOR: Addition of new principle or new governed domain (e.g., commerce, newsletter subsystem).
- PATCH: Clarifications, wording, formatting, non-semantic edits.

Compliance review:

- Each PR description MUST map changes to any affected principle (or state "No principle impact").
- Weekly (or pre-release) review: skim recent merges for unnoticed governance drift.

Record keeping:

| Version | Date       | Change Summary                                                                              |
| ------- | ---------- | ------------------------------------------------------------------------------------------- |
| 1.0.0   | 2025-09-21 | Initial constitution                                                                        |
| 1.1.0   | 2026-04-22 | Replace TDD mandate with build + manual verification gate; add ERPNext to platform stack    |
| 1.1.1   | 2026-04-22 | Apply Prettier markdown standards; add code style mandate to Documentation expectations     |
| 2.0.0   | 2026-07-30 | Replace the local build gate with dev CI and adopt the branch promotion workflow            |
| 2.0.1   | 2026-07-30 | Correct blog platform governance from ERPNext to Ghost                                      |

Enforcement:

- If a change violates a principle, it MUST be reverted or amended before next publish.
- The `dev` GitHub Actions build is the first line of enforcement; a failing build blocks promotion.

**Version**: 2.0.1 | **Ratified**: 2025-09-21 | **Last Amended**: 2026-07-30
