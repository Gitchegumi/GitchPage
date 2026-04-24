# Implementation Plan: Blog Publish Workflow

**Branch**: `003-blog-publish-workflow` | **Date**: 2026-04-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-blog-publish-workflow/spec.md`

## Summary

When a blog post is published in ERPNext, an automated workflow (orchestrated by n8n) must: (1) create and send an ERPNext Newsletter to both the "Blog Subscribers" and "Website" email groups, and (2) trigger a GitHub Actions `workflow_dispatch` to rebuild the GitchPage static site so the homepage reflects the new post. Failed actions retry once before sending an admin failure alert email via ERPNext. No Next.js source code changes are required — this feature is entirely an automation and configuration task across existing infrastructure.

## Technical Context

**Language/Version**: No new language runtime — ERPNext (Frappe Python), n8n (Node.js), GitHub Actions (YAML, already exists)
**Primary Dependencies**: ERPNext REST API (Frappe), n8n HTTP Request nodes, GitHub REST API (`workflow_dispatch`)
**Storage**: No new storage — ERPNext Newsletter DocType records serve as the send history; n8n execution history serves as the automation log
**Testing**: Manual smoke check per constitution — publish a test post and verify newsletter delivery and rebuild trigger
**Target Platform**: Self-hosted homelab (TrueNAS + Docker Compose + Nginx Proxy Manager); ERPNext at `erp.gitchegumi.com`, n8n at `n8n.gitchegumi.com`
**Project Type**: Integration/automation — no frontend or backend source code in the Next.js repository is added or modified
**Performance Goals**: Newsletter delivered within 5 min of publish; homepage updated within 15 min (GitHub Actions build time)
**Constraints**: Must not touch Next.js static export; GitHub Actions `workflow_dispatch` already configured on `nextjs.yml`; ERPNext API key auth already available
**Scale/Scope**: Small subscriber list (~3–20 subscribers), personal blog cadence (a few posts per month); no throughput concerns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|------------|--------|
| I — Content Authenticity | Blog posts authored by human in ERPNext; workflow only reacts to publish, never modifies content | PASS |
| II — Sustainable Static Foundation | No new dynamic routes or API routes added to Next.js. Rebuild uses existing `workflow_dispatch` on `nextjs.yml`. Static export unchanged. | PASS |
| III — Design & Accessibility Discipline | No UI or component changes. No a11y smoke check required. | PASS |
| IV — Build Integrity | No Next.js source files modified. `npm run build` unaffected. | PASS |
| V — Lean Evolution | New automation capability layered on existing infrastructure. Rollback: disable ERPNext webhook or deactivate n8n workflow — no code to revert. | PASS |

**No violations. Complexity Tracking table not required.**

## Project Structure

### Documentation (this feature)

```text
specs/003-blog-publish-workflow/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   ├── erpnext-webhook-payload.md   ← ERPNext → n8n webhook schema
│   ├── erpnext-newsletter-api.md    ← n8n → ERPNext Newsletter API
│   └── github-dispatch-api.md      ← n8n → GitHub workflow_dispatch API
└── tasks.md             ← Phase 2 output (/tasks command — NOT created by /plan)
```

### Source Code Impact

```text
.github/workflows/nextjs.yml   ← NO CHANGES (workflow_dispatch already present)
CLAUDE.md                      ← Updated to point to this plan
```

No new source files in `src/`. No new npm packages. No new API routes.

**Structure Decision**: No code structure changes. This is a pure configuration/integration feature.

## Phase 0: Research

*See [research.md](research.md) for full findings.*

Research tasks completed:

1. ERPNext Webhook configuration for Blog Post publish events
2. ERPNext Newsletter DocType API (create + send)
3. ERPNext API authentication pattern for n8n → ERPNext calls
4. GitHub Actions workflow_dispatch REST API
5. n8n retry and idempotency patterns
6. Admin failure email via ERPNext API

## Phase 1: Design & Contracts

*See [data-model.md](data-model.md), [quickstart.md](quickstart.md), and [contracts/](contracts/).*

### n8n Workflow Architecture

The n8n workflow is the central orchestrator. It consists of the following logical stages:

**Stage 1 — Trigger & Guard**
- HTTP Webhook trigger node receives the ERPNext Blog Post publish event
- IF node validates `published == 1` (defensive check; ERPNext webhook condition also filters)
- Idempotency check: query ERPNext for an existing Newsletter whose subject matches the pattern `New Post: {post_title}`. If found, halt execution.

**Stage 2 — Parallel Dispatch**
Both actions run in parallel (n8n parallel branches):
- **Branch A — Newsletter**: Create ERPNext Newsletter doc referencing both email groups → call send method
- **Branch B — Rebuild**: POST to GitHub Actions `workflow_dispatch` API

**Stage 3 — Retry on Failure**
Each branch has an error handler:
- On first failure: wait 30 seconds, retry the failed action once
- On second failure: call ERPNext API to send an admin failure notification email

**Stage 4 — Completion**
n8n execution log records the full outcome. No additional logging action required.

### ERPNext Configuration

- **Webhook**: Setup → Integrations → Webhooks → New
  - DocType: `Blog Post`
  - Event: `on_update`
  - Condition: `doc.published == 1`
  - Fields to send: `name`, `title`, `blog_intro`, `route`, `published`, `blog_category`
  - Request URL: n8n webhook trigger URL
  - Request method: POST
- **"Blog Subscribers" Email Group**: Create if not exists (Setup → Email → Email Group)
- **Newsletter DocType**: Created programmatically by n8n per publish event

### GitHub Configuration

- **PAT**: Create a GitHub Personal Access Token with `workflow` scope (or `Actions: write`), scoped to the `GitchPage` repository
- Store the PAT as a credential in n8n (HTTP Header credential: `Authorization: Bearer {PAT}`)

## Phase 2: Task Planning Approach

*This section describes what the `/tasks` command will do — DO NOT execute during `/plan`.*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs

**Ordering Strategy**:

1. Prerequisites/config tasks first (ERPNext Email Group, GitHub PAT, n8n credentials)
2. ERPNext webhook configuration
3. n8n workflow construction (trigger → guard → parallel branches → retry → alert)
4. Integration testing (end-to-end smoke test per quickstart.md)
5. Cleanup/documentation

**Estimated Output**: 12–18 ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the `/tasks` command, NOT by `/plan`

## Phase 3+: Future Implementation

**Phase 3**: Task execution (`/tasks` creates tasks.md)
**Phase 4**: Implementation (configure ERPNext, create n8n workflow, provision GitHub PAT)
**Phase 5**: Validation (execute quickstart.md manual checks)

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning described (/plan command)
- [x] Phase 3: Tasks generated (/tasks command)
- [x] Phase 4: Implementation complete
- [x] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)
