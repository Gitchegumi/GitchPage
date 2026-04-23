# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```text
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → implementation task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Core: models, services, UI components
   → Integration: external services, middleware
   → Polish: manual verification, docs, cleanup
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Dependency order: models before services before UI
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have implementation tasks?
   → All entities have model tasks?
   → All user stories have verification steps?
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

## Phase 1: Setup

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 2: Foundational

- [ ] T004 [P] Core model/entity in src/models/[entity].py
- [ ] T005 [P] Core service in src/services/[service].py

## Phase 3: User Story 1 — [Story Name]

- [ ] T006 [P] [US1] Implement [component] in src/[path]/[file]
- [ ] T007 [US1] Integrate [service] with [component] in src/[path]/[file]
- [ ] T008 [US1] Manual verification: [specific check steps from quickstart.md]

## Phase 4: Polish & Wrap-up

- [ ] T009 [P] Update docs/[relevant-doc].md
- [ ] T010 Remove duplication and dead code
- [ ] T011 Run manual-verification steps from quickstart.md
- [ ] T012 `npm run build` — confirm zero errors

## Dependencies

```text
T001 → T002 → T004
T004 → T005 → T006 → T007 → T008
T008 → T009
```

## Parallel Example

```text
# Launch independent tasks simultaneously:
Task: "Implement [ComponentA] in src/components/[file-a]"
Task: "Implement [ComponentB] in src/components/[file-b]"
```

## Notes

- [P] tasks = different files, no dependencies
- Commit after each completed task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - Each contract file → implementation task
   - Each endpoint → one task per handler

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. **From User Stories**:
   - Each story → implementation tasks + manual verification step
   - Quickstart scenarios → verification task descriptions

4. **Ordering**:
   - Setup → Foundational → User Stories (by priority) → Polish
   - Dependencies block parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [ ] All contracts have corresponding implementation tasks
- [ ] All entities have model tasks
- [ ] All user stories have at least one manual verification step
- [ ] Parallel tasks are truly independent (different files)
- [ ] Each task specifies an exact file path
- [ ] No task modifies the same file as another [P] task
