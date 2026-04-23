# Tasks: Constrain Blog Iframe & Surface Subscribe Form

**Feature**: `002-constrain-blog-iframe`
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Branch**: `002-constrain-blog-iframe`

---

## User Stories

| ID  | Story                                                               | Priority |
| --- | ------------------------------------------------------------------- | -------- |
| US1 | Blog listing page — iframe constrained + subscribe form visible     | P1       |
| US2 | Individual post page — iframe fully constrained (no ERPNext chrome) | P1       |

---

## Phase 1: Foundational — ERPNext Embed Fix

_Blocks both user stories. T001 and T002 can be done in parallel._

- [ ] T001 [P] Add embed detection script to ERPNext Website Settings → Website Script tab at `erp.gitchegumi.com/app/website-settings` (JS snippet from plan.md Phase 1)
- [ ] T002 [P] Add embed suppression CSS to ERPNext Website Settings → Website Theme/Style at `erp.gitchegumi.com/app/website-settings` (CSS rules from plan.md Phase 1)
- [ ] T003 Verify ERPNext embed fix — open `erp.gitchegumi.com/blog?embed=1` directly in browser, scroll up and down, confirm no navbar or footer visible

---

## Phase 2: User Story 1 — Blog Listing Page

_Goal: Visitor sees a constrained blog listing iframe with a subscribe form visible below it._

**Independent test criteria**: `/blog` loads with subscribe form visible without page scrolling; iframe does not show ERPNext chrome on scroll in either direction.

- [ ] T004 [US1] Update `src/app/blog/page.tsx` — replace single full-height iframe with a flex column layout: iframe at `calc(100vh - 90px - 220px)` on top, `SubscribeForm` component below (import from `@/components/SubscribeForm`)
- [ ] T005 [US1] Run `npm run build` from repo root — confirm zero TypeScript errors
- [ ] T006 [US1] Manual visual check on `localhost` — open `/blog`, confirm subscribe form is visible below the iframe without scrolling the page (test desktop width)
- [ ] T007 [US1] Manual visual check on `localhost` — resize browser to mobile width (375px), confirm subscribe form is accessible and readable below the iframe
- [ ] T008 [US1] A11y smoke check on `/blog` — tab through the page, confirm iframe title is announced, subscribe form email field has a label, subscribe button is reachable and activated by keyboard

---

## Phase 3: User Story 2 — Individual Post Pages

_Goal: Visitor reads a full post without ERPNext header or footer ever appearing on scroll._

**Independent test criteria**: On any `/blog/[category]/[slug]` page, scrolling to the very bottom does not reveal the ERPNext footer; scrolling to the top does not reveal the ERPNext navbar.

- [ ] T009 [US2] Verify ERPNext embed fix on individual post — open `erp.gitchegumi.com/blog/[any-category]/[any-slug]?embed=1` directly, scroll to bottom, confirm ERPNext footer is not visible
- [ ] T010 [US2] Manual visual check on `localhost` — open any `/blog/[category]/[slug]` page, scroll to top and bottom, confirm no ERPNext header or footer appears at any scroll position

---

## Phase 4: Polish & Wrap-up

- [ ] T011 Run `npm run build` final clean pass — confirm zero errors and no regressions
- [ ] T012 Commit all changes with message: `feat: constrain blog iframes and surface subscribe form`
- [ ] T013 Push branch `002-constrain-blog-iframe` to remote and open PR

---

## Dependencies

```text
T001 ──┐
       ├──→ T003 ──→ T009 ──→ T010
T002 ──┘

T004 ──→ T005 ──→ T006 ──→ T007 ──→ T008

T008 + T010 ──→ T011 ──→ T012 ──→ T013
```

T001/T002 (ERPNext config) are prerequisites for T003, T009, T010 (verification).
T004–T008 (Next.js layout) are independent of the ERPNext tasks and can proceed in parallel.

---

## Parallel Execution

```text
# T001 and T002 simultaneously:
Task: "Add embed detection JS to ERPNext Website Script tab"
Task: "Add embed suppression CSS to ERPNext Website Style tab"

# T004 simultaneously with T001/T002 (different system):
Task: "Update src/app/blog/page.tsx with two-row layout and SubscribeForm"
```

---

## Implementation Strategy

**MVP (minimum to unblock merge)**: Complete T001–T008. This delivers a fully working blog listing page with constrained iframe and visible subscribe form. Individual post constraint (T009–T010) requires only ERPNext verification — no code change — so it completes quickly once T001/T002 are done.

**Total tasks**: 13
**Parallelizable**: T001 ‖ T002 ‖ T004 (3 tasks can start simultaneously)
**ERPNext config tasks**: T001, T002, T003, T009 (done in ERPNext admin UI, not in code)
**Code tasks**: T004 only (single file change in Next.js)
**Verification tasks**: T003, T005–T010 (manual checks)
