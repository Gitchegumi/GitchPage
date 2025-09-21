<!--
Sync Impact Report
Version change: (none) → 1.0.0
Modified principles: N/A (initial creation)
Added sections: Core Principles, Platform Constraints, Delivery & Quality Workflow, Governance
Removed sections: None
Templates requiring updates (no template directory found in repo, marking pending):
 - /.specify/templates/plan-template.md ⚠ pending (directory not present)
 - /.specify/templates/spec-template.md ⚠ pending
 - /.specify/templates/tasks-template.md ⚠ pending
 - /.specify/templates/commands/* ⚠ pending
Follow-up TODOs:
 - Create template scaffolding if constitution-based automation desired.
 - Add amendment history section if growth warrants.
-->

# GitchPage Constitution

## Core Principles

### I. Content Authenticity First

All published content (blog posts, portfolio entries, voice-over demos) MUST be original, attributable, and
truthfully represent skills, experience, or creative perspective. AI-assisted generation may be used for
draft acceleration but final narrative, claims, and attributions MUST be human‑reviewed. No filler, no
traffic-bait posts. Removal or correction is mandatory within 48h if inaccuracies are found.

### II. Sustainable Static Foundation (Progressive Enhancement)

Primary delivery uses static generation (Next.js App Router SSG) for reliability, performance, and low
operational overhead. Dynamic capabilities (future e‑commerce, interactive dashboards) MUST layer on via
isolated, opt-in API routes or edge functions without degrading existing static paths. Core pages must
remain deployable as pure static export unless a deliberate architectural migration is ratified.

### III. Design & Accessibility Discipline

Visual design changes MUST preserve legibility (WCAG AA contrast), keyboard navigability, and semantic
structure (headings, landmarks, aria roles where appropriate). Media (audio demos, images) MUST include
textual context (alt text, captions/description). Any theme or component refactor requires a manual a11y
smoke checklist before merge.

### IV. Measurable Quality & Testing

Every structural or rendering change affecting blog listing, MDX rendering, or portfolio components MUST
have at least one automated test (integration or snapshot + semantic assertion). Critical content parsing
(frontmatter metadata, routing) MUST maintain 100% test coverage for parsing logic. Tests MUST run green
in CI before deployment. Broken tests block publish—no "temporary skips" without a linked TODO and
scheduled follow-up.

### V. Lean Evolution & Future-Proofing

New capabilities (e‑commerce, user accounts) MUST start as a minimal vertical slice (walking skeleton) with
explicit rollback criteria. Complexity (state management libraries, ORM, background workers) MUST appear
only after a concrete scaling or maintainability trigger is documented. Prefer deleting unused code over
generalizing for hypothetical reuse. Version increments reflect meaningful governance or scope shifts.

## Platform Constraints

The site is a personal portfolio and knowledge hub built with Next.js (TypeScript, MDX) deploying as a
static-first artifact. Current functional domains:

- Blog (MDX categories)
- Portfolio / CV
- Voice-over demo reels (audio streaming)

Forward-looking (not yet implemented) domain: lightweight e‑commerce (digital products or booking). Any
commerce introduction MUST isolate payment handling, avoid storing raw PII locally, and undergo a security
review (dependency audit + threat sketch) prior to launch.

Performance budgets:

- Core static page TTI under 2s on mid-tier mobile (simulated 3G fast) for first contentful render.
- Largest Contentful Paint target < 2.5s for home and blog index.
- Images MUST be optimized (Next/Image or pre-compressed) and not exceed necessary resolution.

Content governance:

- All MDX frontmatter MUST include: title, description, category, published date (ISO), draft flag optional.
- Feature images MUST live under `public/images/blog/` and use descriptive, kebab-case filenames.
- Deleting a post requires redirect strategy or explicit acceptance of 404 with note logged in CHANGELOG (future).

Security & privacy:

- No collection of user credentials until governance updated.
- Third-party scripts MUST be enumerated in a scripts ledger (future doc) before inclusion.
- Audio/media hosting remains local unless bandwidth metrics justify CDN.

## Delivery & Quality Workflow

Workflow stages:

1. Draft (content or feature)
2. Local test pass
3. PR with checklist
4. Preview build review
5. Main merge

Quality gates (mandatory before merge):

- `npm run build` succeeds with zero type errors.
- Integration tests for blog metadata & rendering pass.
- Accessibility spot check: keyboard nav across header, blog index, single post.
- Lighthouse (or similar) sample run recorded for major layout shifts (manual for now).

Change classification:

- Content-only: markdown/MDX + images (no code logic) → skip snapshot updates unless rendering differs.
- Structural: component/layout logic or routing → requires tests & manual a11y pass.
- Platform expansion (new domain like commerce) → requires governance amendment PR.

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
- MUST include impact review: principles affected, tests/templates needing updates, migration/rollback notes.
- Approval: single maintainer (self-review) with documented rationale is acceptable for this personal project; future
  collaborators would require at least one additional reviewer.

Versioning policy:

- MAJOR: Removal or redefinition of a principle; introduction of persistent user data or authentication layer.
- MINOR: Addition of new principle or new governed domain (e.g., commerce, newsletter subsystem).
- PATCH: Clarifications, wording, formatting, non-semantic edits.

Compliance review:

- Each PR description MUST map changes to any affected principle (or state "No principle impact").
- Weekly (or pre-release) review: skim recent merges for unnoticed governance drift.

Record keeping:

- Future: Maintain amendment history table once first amendment occurs (v1.0.0 is initial baseline).

Enforcement:

- If a change violates a principle, it MUST be reverted or amended before next publish.
- Tests are the first line of enforcement; missing required tests is a failed gate.

**Version**: 1.0.0 | **Ratified**: 2025-09-21 | **Last Amended**: 2025-09-21
