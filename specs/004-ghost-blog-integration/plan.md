# Implementation Plan: Ghost Blog Full Integration

**Branch**: `004-ghost-blog-integration` | **Date**: 2026-04-26 | **Spec**: [specs/004-ghost-theme-visual-parity/spec.md](specs/004-ghost-theme-visual-parity/spec.md)
**Input**: Feature specification from `/specs/004-ghost-theme-visual-parity/spec.md`

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (GEMINI.md).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary
Full integration of the Ghost blog (`blog.gitchegumi.com`) with the main site (`gitchegumi.com`). This involves a client-side redirect for the main `/blog` route, a visual theme update for Ghost to match the main site's design, and switching the homepage "Latest Blog Posts" data source to the Ghost Content API. Site rebuilds are triggered via n8n webhook upon Ghost post publication to ensure homepage freshness.

## Technical Context
**Language/Version**: Next.js 15+ (TypeScript), Handlebars (Ghost Theme)
**Primary Dependencies**: `@tryghost/content-api`, n8n (Automation), Tailwind CSS (for reference)
**Storage**: Ghost CMS (external Content API)
**Testing**: Manual visual smoke check + a11y smoke check (Principle IV)
**Target Platform**: Web (GitHub Pages for main site, Ghost Pro/Self-hosted for blog)
**Project Type**: Web
**Performance Goals**: LCP < 2.5s for home and blog index
**Constraints**: Visual parity (glassmorphism), Client-side redirect for `/blog`
**Scale/Scope**: Single site integration

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle II (Sustainable Static Foundation)**: Uses standard Next.js redirects and external API fetching. Does not break static export. **PASS**
- **Principle III (Design & Accessibility)**: Requires manual a11y smoke check on new Ghost theme components. **PASS**
- **Principle IV (Build Integrity)**: `npm run build` must pass. **PASS**
- **Principle V (Lean Evolution)**: Minimal integration using existing Ghost capabilities. Rollback is straightforward (revert theme/config). **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/004-ghost-theme-visual-parity/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be created by /tasks)
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router (Redirects, Homepage)
├── components/          # Shared components for reference
└── lib/                 # Ghost API client

ghost_theme/
└── custom-theme/        # Ghost Handlebars theme files
```

**Structure Decision**: Option 2: Web application (Next.js frontend + Ghost theme backend/CMS)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - NEEDS CLARIFICATION: Ghost Content API authentication and client setup in Next.js 15.
   - NEEDS CLARIFICATION: Replicating `backdrop-filter` in Ghost theme's CSS structure.
   - NEEDS CLARIFICATION: Next.js 15 redirect patterns for wildcard blog routes.

2. **Generate and dispatch research agents**:
   ```text
   Task: "Research Ghost Content API setup for Next.js 15 App Router"
   Task: "Research Ghost theme CSS best practices for custom glassmorphism"
   Task: "Find Next.js 15 best practices for permanent redirects with slug mapping"
   ```

3. **Consolidate findings** in `research.md`.

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Post (Ghost): title, slug, feature_image, published_at, url.
   - Navigation Link: title, target_url, icon (if applicable).

2. **Generate API contracts** (if applicable):
   - Ghost Content API client interface.
   - Redirect map structure.

3. **Define manual verification steps** → `quickstart.md`:
   - Verify redirect from `/blog` to `blog.gitchegumi.com`.
   - Verify 1:1 redirect for a known legacy slug.
   - Visual comparison check of header/footer between main site and blog.
   - A11y smoke check: keyboard nav on Ghost header.

4. **Update agent file incrementally**:
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType gemini`

**Output**: data-model.md, quickstart.md, updated GEMINI.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Generate tasks for Next.js redirect configuration.
- Generate tasks for Ghost theme modification (Header, Footer, CSS).
- Generate tasks for Homepage data source migration (ERPNext -> Ghost).
- Each user story from spec -> validation task.

**Ordering Strategy**:
- Redirects (High impact/Low risk)
- Homepage integration (Next.js logic)
- Ghost theme (High visual effort)

**Estimated Output**: 15-20 tasks in tasks.md

## Complexity Tracking
*No constitution violations requiring justification.*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete
- [ ] Phase 1: Design complete
- [ ] Phase 2: Task planning complete
- [ ] Phase 3: Tasks generated
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PENDING
- [ ] All NEEDS CLARIFICATION resolved: PENDING
- [ ] Complexity deviations documented: N/A

---
*Based on Constitution v1.1.1 - See `/memory/constitution.md`*
