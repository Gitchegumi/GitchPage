# Tasks: Constrain Blog Iframe & Surface Tiered Subscribe Form

**Feature**: `002-constrain-blog-iframe`
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Branch**: `002-constrain-blog-iframe`
**Supersedes**: tasks.md dated 2026-04-22

---

## User Stories

| ID  | Story                                                                          | Priority |
| --- | ------------------------------------------------------------------------------ | -------- |
| US1 | Blog listing page — iframe constrained + tiered subscribe form visible         | P1       |
| US2 | Individual post page — iframe fully constrained (no ERPNext chrome)            | P1       |

---

## Phase 1: Foundational — ERPNext, n8n & Component Setup

_All four config tasks (T001–T004) and the new component (T005) can proceed in parallel — they touch different systems and files._

- [x] T001 [P] Create "Blog Subscribers" email group in ERPNext admin at `erp.gitchegumi.com/app/email-group` — Name: "Blog Subscribers", Group Type: Newsletter
- [x] T002 [P] Add embed detection script to ERPNext Website Settings → Website Script tab at `erp.gitchegumi.com/app/website-settings` (JS snippet from plan.md Phase 1)
- [x] T003 [P] Add embed suppression CSS to ERPNext Website Settings → Website Style tab at `erp.gitchegumi.com/app/website-settings` (CSS rules from plan.md Phase 1)
- [x] T004 [P] Update n8n subscribe workflow at `n8n.gitchegumi.com` — add IF/Switch node after webhook trigger: `tier === "blog"` → add to "Blog Subscribers" email group; else → add to "Website" email group
- [x] T005 [P] Create `src/components/TieredSubscribeForm.tsx` — `"use client"` component with: two selectable option cards ("Blog only" / "Tell me everything" with plain-language descriptions), email input, hidden honeypot field, submit disabled until both tier and valid email are provided; POST `{ email, tier, honeypot }` to `process.env.NEXT_PUBLIC_N8N_SUBSCRIBE_URL`; success/error feedback; wrap in `MagicCard` with same gradient settings as `SubscribeForm`

---

## Phase 2: Foundational Verification

_Verify ERPNext embed fix before proceeding to user story phases. Depends on T002 + T003._

- [x] T006 Verify ERPNext embed fix on blog listing — open `erp.gitchegumi.com/blog?embed=1` directly in browser, scroll up and down, confirm no navbar or footer visible at any scroll position

---

## Phase 3: User Story 1 — Blog Listing Page

_Goal: Visitor sees a fully constrained blog listing iframe with a tiered subscribe form visible in the initial viewport._

**Independent test criteria**: `/blog` loads with `TieredSubscribeForm` visible without page-level scrolling on 375px+ viewports; both subscription tiers route to the correct ERPNext email group; ERPNext chrome does not appear on scroll.

- [x] T007 [US1] Update `src/app/blog/page.tsx` — replace single full-height iframe with a `flex flex-col h-[calc(100vh-90px)]` layout: iframe with `flex-1 min-h-0 w-full border-0` and `?embed=1`; `TieredSubscribeForm` wrapped in a `shrink-0 px-4 py-3` container below (import from `@/components/TieredSubscribeForm`)
- [x] T008 [US1] Run `npx tsc --noEmit` from repo root — confirm zero TypeScript errors after adding `TieredSubscribeForm` to `src/app/blog/page.tsx`
- [x] T009 [US1] Manual visual check on `localhost` — open `/blog` at full desktop width, confirm `TieredSubscribeForm` is fully visible in the initial viewport without any page-level scrolling
- [x] T010 [US1] Manual visual check on `localhost` — resize browser to 375px width, confirm `TieredSubscribeForm` is visible in the initial viewport without page-level scrolling
- [x] T011 [US1] A11y smoke check on `/blog` — tab through the page: confirm iframe title is announced, both option cards are reachable and selectable by keyboard, email input is labelled, submit button is disabled before tier selection and activatable after
- [x] T012 [US1] End-to-end "Blog only" — submit a test email with "Blog only" selected, confirm success message, then verify the email appears in ERPNext "Blog Subscribers" group at `erp.gitchegumi.com/app/email-group/Blog%20Subscribers`
- [x] T013 [US1] End-to-end "Tell me everything" — submit a different test email with "Tell me everything" selected, confirm success message, then verify the email appears in ERPNext "Website" group at `erp.gitchegumi.com/app/email-group/Website`

---

## Phase 4: User Story 2 — Individual Post Pages

_Goal: Visitor reads a full post without ERPNext header or footer ever appearing on scroll._

**Independent test criteria**: On any `/blog/[category]/[slug]` page, scrolling to the very top and bottom does not reveal the ERPNext navbar or footer under any circumstance.

- [x] T014 [US2] Verify ERPNext embed on individual post — open `erp.gitchegumi.com/blog/[any-category]/[any-slug]?embed=1` directly, scroll to bottom, confirm ERPNext footer is not visible
- [x] T015 [US2] Manual visual check on `localhost` — open any `/blog/[category]/[slug]` page, scroll to top and bottom, confirm no ERPNext header or footer appears at any scroll position

---

## Phase 5: Polish & Wrap-up

- [x] T016 Run `npm run build` final clean pass — confirm zero errors and no regressions
- [x] T017 Commit all changes with message: `feat: constrain blog iframes and surface tiered subscribe form`
- [x] T018 Push branch `002-constrain-blog-iframe` to remote and open PR

---

## Dependencies

```text
T001 ──┐
T002 ──┤──→ T006 ──→ T014 ──→ T015
T003 ──┘
T004 ──┐
       ├──→ T012, T013
T001 ──┘

T005 ──→ T007 ──→ T008 ──→ T009 ──→ T010 ──→ T011 ──→ T012 ──→ T013

T013 + T015 ──→ T016 ──→ T017 ──→ T018
```

T001–T005 are all independent and can start simultaneously.
T006 (embed verification) depends on T002+T003.
T007 (page layout) depends on T005 (component must exist first).
T012–T013 (e2e) depend on T001+T004 (ERPNext group + n8n routing) AND T007 (form on page).
T016–T018 (wrap-up) depend on all user story phases completing.

---

## Parallel Execution

```text
# Start all five simultaneously:
Task T001: "Create Blog Subscribers email group in ERPNext admin"
Task T002: "Add embed detection JS to ERPNext Website Script tab"
Task T003: "Add embed suppression CSS to ERPNext Website Style tab"
Task T004: "Update n8n subscribe workflow with tier IF node"
Task T005: "Create src/components/TieredSubscribeForm.tsx"
```

---

## Implementation Strategy

**MVP (minimum to unblock merge)**: Complete T001–T013. This delivers a fully working blog listing page with constrained iframe and tiered subscribe form, both verified end-to-end. Individual post constraint (T014–T015) requires only ERPNext verification — no code change.

**Total tasks**: 18
**Parallelizable at start**: T001 ‖ T002 ‖ T003 ‖ T004 ‖ T005 (5 tasks simultaneously)
**ERPNext admin tasks**: T001, T002, T003, T006, T014 (done in ERPNext/browser, not in code)
**n8n task**: T004 (workflow update in n8n UI)
**Code tasks**: T005, T007 (two files)
**Verification tasks**: T006, T008–T015
