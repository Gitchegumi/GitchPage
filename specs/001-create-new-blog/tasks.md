# Tasks: Create New Blog Post: Devlog 2

**Input**: Design documents from `/specs/001-create-new-blog/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Ensure Next.js project is set up and dependencies are installed. (No specific file changes, just verification)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T002 Write an integration test in `tests/integration/test_blog_post_creation.test.ts` that attempts to create an MDX file at `src/app/blog/tech/devlog-2-violence-of-action.mdx` with the specified metadata and content, and asserts its existence and content structure. This test should initially fail.
- [ ] T003 Write an integration test in `tests/integration/test_blog_post_metadata.test.ts` that reads the metadata from `src/app/blog/tech/devlog-2-violence-of-action.mdx` and asserts that all required fields (title, slug, date, author, description, category, tags, featureImage) are present and correctly formatted. This test should initially fail.
- [ ] T004 Write an integration test in `tests/integration/test_blog_post_content_style.test.ts` that reads the content of `src/app/blog/tech/devlog-2-violence-of-action.mdx` and asserts that it adheres to the specified style guidelines (1200-1600 words, short paragraphs, no em dashes, tasteful subheads). This test should initially fail.

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T005 Generate the blog post content for `src/app/blog/tech/devlog-2-violence-of-action.mdx` based on the information in `extra-documentation/001-develop-unit-selection` directory, including placeholders for two GIFs (GUT unit tests passing, unit placed with info panel).
- [ ] T006 Create the MDX file `src/app/blog/tech/devlog-2-violence-of-action.mdx` using the existing MDX template style, populating `export const metadata` with: title, slug, date (YYYY-MM-DD), author "Mathew 'Gitchegumi' Lindholm", description, category "tech", tags, and featureImage "/images/blog/devlog-2-violence-of-action.png", and inserting the generated content.

## Phase 3.4: Integration
- (No specific integration tasks for this feature, as it's a static file creation)

## Phase 3.5: Polish
- [ ] T007 Run the quickstart guide steps from `E:\GitHub\GitchPage\specs\001-create-new-blog\quickstart.md` to manually verify the generated blog post.
- [ ] T008 Ensure all tests (T002, T003, T004) pass after implementation.

## Dependencies
- T001 must be completed before T002, T003, T004.
- T002, T003, T004 must be written and failing before T005, T006.
- T005 must be completed before T006.
- T006 must be completed before T007, T008.
- T007, T008 depend on T006.

## Parallel Example
```
# No parallel tasks in this feature due to sequential dependencies.
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - No API contracts for this feature.

2. **From Data Model**:
   - Blog Post entity → T006 (MDX file creation with content and metadata).

3. **From User Stories**:
   - Acceptance Scenarios → T002, T003, T004 (integration tests) and T007 (manual verification).

4. **Ordering**:
   - Setup → Tests → Core Implementation → Polish.
   - Dependencies block parallel execution.

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (N/A for this feature)
- [x] All entities have model tasks (T006 covers Blog Post entity)
- [x] All tests come before implementation (T002, T003, T004 before T005, T006)
- [x] Parallel tasks truly independent (N/A for this feature)
- [x] Each task specifies exact file path (where applicable)
- [x] No task modifies same file as another [P] task