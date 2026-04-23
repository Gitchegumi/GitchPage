<!--
Sync Impact Report
Version change: 1.0.0 → 1.1.0
Modified principles:
  - IV. Measurable Quality & Testing → IV. Build Integrity & Manual Verification
    (Removed automated test / TDD mandate; replaced with build gate + manual a11y check)
Added sections: None
Removed sections: None
Platform Constraints: Added ERPNext suite (blog CMS, newsletter, future eCommerce)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated (Constitution Check gate wording)
  - .specify/templates/spec-template.md ✅ no change required
  - .specify/templates/tasks-template.md ⚠ pending (remove test-first task ordering mandate)
Follow-up TODOs:
  - Update tasks-template.md to remove TDD ordering assumption.
  - Update amendment history table when next amendment occurs.
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

### IV. Build Integrity & Manual Verification

`npm run build` MUST succeed with zero type errors before any merge. Structural changes (layout, routing,
component logic) MUST pass a manual visual and accessibility smoke check across the affected pages.
Automated test suites are not required; human verification of the rendered result is the quality gate.
Broken builds block publish — no exceptions.

### V. Lean Evolution & Future-Proofing

New capabilities (e-commerce, user accounts) MUST start as a minimal vertical slice (walking skeleton) with
explicit rollback criteria. Complexity (state management libraries, ORM, background workers) MUST appear
only after a concrete scaling or maintainability trigger is documented. Prefer deleting unused code over
generalizing for hypothetical reuse. Version increments reflect meaningful governance or scope shifts.

## Platform Constraints

The site is a personal portfolio and knowledge hub. The delivery stack is:

- **Next.js** (TypeScript) — static export deployed to GitHub Pages (`gitchegumi.com`)
- **ERPNext** (`erp.gitchegumi.com`) — blog CMS (posts served as iframes), newsletter via Email Groups,
  and future eCommerce (digital products, invoicing, inventory) once that phase begins
- **n8n** (`n8n.gitchegumi.com`) — automation middleware (subscribe flows, publish triggers, CRM leads)
- **Homelab** (TrueNAS + Docker Compose + Nginx Proxy Manager) — self-hosted infrastructure for all
  services above

Current functional domains:

- Blog (ERPNext CMS, embedded via iframe at `/blog`)
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

- ERPNext blog posts MUST include: title, description, category, and published date before going live.
- Feature images MUST use descriptive, kebab-case filenames.
- Deleting a post requires a redirect strategy or explicit acceptance of 404 with a note logged.

Security & privacy:

- No collection of user credentials until governance updated.
- Third-party scripts MUST be enumerated in a scripts ledger (future doc) before inclusion.
- Audio/media hosting remains local unless bandwidth metrics justify CDN.

## Delivery & Quality Workflow

Workflow stages:

1. Draft (content or feature)
2. Local build pass (`npm run build`)
3. Manual smoke check (visual + a11y on affected pages)
4. PR with checklist
5. Preview build review
6. Main merge

Quality gates (mandatory before merge):

- `npm run build` succeeds with zero type errors.
- Manual visual check: affected pages render correctly on desktop and mobile.
- Accessibility spot check: keyboard nav across header, blog index, single post.
- Lighthouse (or similar) sample run recorded for major layout shifts (manual, as needed).

Change classification:

- Content-only: ERPNext post edits (no code logic) → no build step required; publish directly.
- Structural: component/layout logic or routing → requires build pass + manual a11y smoke check.
- Platform expansion (new domain like eCommerce) → requires governance amendment PR.

Rollbacks:

- Failed deployment with content regression → revert commit within 2h.
- Security concern (dependency vuln with exploit path) → hotfix branch prioritized over feature branches.

Documentation expectations:

- Any new script or npm command MUST be documented in `README.md`.
- Non-trivial architectural decisions SHOULD append an ADR entry (ADR log TBD; placeholder for future adoption).

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

| Version | Date       | Change Summary                                              |
|---------|------------|-------------------------------------------------------------|
| 1.0.0   | 2025-09-21 | Initial constitution                                        |
| 1.1.0   | 2026-04-22 | Replace TDD mandate with build + manual verification gate; add ERPNext to platform stack |

Enforcement:

- If a change violates a principle, it MUST be reverted or amended before next publish.
- The build gate (`npm run build`) is the first line of enforcement; a failing build blocks merge.

**Version**: 1.1.0 | **Ratified**: 2025-09-21 | **Last Amended**: 2026-04-22
