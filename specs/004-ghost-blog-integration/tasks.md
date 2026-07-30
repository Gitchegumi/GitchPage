# Tasks: Ghost Blog Full Integration

**Input**: Design documents from `specs/004-ghost-blog-integration/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Summary
- **Total Tasks**: 16
- **Tasks per Story**:
  - US1 (Main Redirect): 2
  - US2 (Legacy Redirects): 2
  - US3 (Visual Parity): 4
  - US4 (Nav Links): 2
  - US5 (Homepage API): 2
- **MVP Scope**: User Story 1 & 2 (Redirects) + User Story 5 (Latest Posts)

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US#]**: Maps to user stories in spec.md

## Phase 1: Setup

- [X] T001 Install `@tryghost/content-api` and `@types/tryghost__content-api`
- [X] T002 [P] Configure `GHOST_URL` and `GHOST_CONTENT_API_KEY` in `.env.example`
- [X] T003 [P] Create Ghost API client configuration in `src/lib/ghost.ts`

## Phase 2: Foundational (Redirect Infrastructure)

- [X] T004 [P] Remove existing `BlogEmbed` component usage in `src/app/blog/page.tsx`
- [X] T005 [P] Implement client-side redirect to Ghost blog in `src/app/blog/page.tsx`

## Phase 3: User Story 1 — Main Blog Redirect

- [X] T006 [US1] Update "Blog" links in main site header to point to `https://blog.gitchegumi.com` in `src/components/Header.tsx`
- [ ] T007 [US1] Manual verification: Navigate to `/blog` and confirm redirect to Ghost blog

## Phase 4: User Story 2 — Legacy URL Redirects

- [X] T008 Archive legacy MDX blog posts by removing `src/app/blog/[category]` and its children
- [ ] T009 [US2] Manual verification: Navigate to legacy MDX URLs and confirm 1:1 redirect to Ghost

## Phase 5: User Story 3 — Visual Parity (Ghost Theme)

- [X] T010 [P] [US3] Implement glassmorphism and brand colors in `ghost_theme/custom-theme/assets/css/screen.css`
- [X] T011 [P] [US3] Replicate main site header structure and logo in `ghost_theme/custom-theme/partials/navigation.hbs`
- [X] T012 [P] [US3] Replicate main site footer structure and legal text in `ghost_theme/custom-theme/partials/footer.hbs`
- [X] T013 [US3] Hide membership/subscribe controls in `ghost_theme/custom-theme/default.hbs`

## Phase 6: User Story 4 — Navigation Links

- [X] T014 [US4] Update Ghost theme navigation items to point to `gitchegumi.com` absolute URLs in Ghost Admin or `navigation.hbs`
- [X] T015 [US4] Manual verification: Confirm all links on Ghost blog take user back to correct main site pages

## Phase 7: User Story 5 — Homepage Latest Posts

- [X] T016 [US5] Switch data source from ERPNext to Ghost Content API in `src/app/page.tsx`
- [X] T017 [US5] Update post card links to point to `blog.gitchegumi.com/${slug}` in `src/components/BentoBlogCard.tsx` or `BlogCard.tsx`

## Phase 8: Polish & Wrap-up

- [X] T018 Remove unused `src/app/blog/BlogEmbed.tsx` and `src/lib/getERPNextPosts.ts`
- [ ] T019 Final manual-verification run from `quickstart.md`
- [ ] T020 `npm run build` — confirm zero type errors and successful static export

## Dependencies

```text
T001 → T003
T003 → T017
T004 → T005 → T007
T010 → T011 → T012 → T013 → T014 → T016
T017 → T018
T007, T009, T016, T018 → T021 → T022
```

## Parallel Example

```text
# Launch independent tasks simultaneously:
Task T002: "Configure .env.example"
Task T010: "Implement glassmorphism CSS"
Task T012: "Replicate footer HTML"
```

## Implementation Strategy
- **MVP**: Complete Phase 1-4 first to ensure all existing traffic is correctly routed to the new blog without dead links.
- **Incremental**: Follow with Phase 7 to update the main site content, then Phase 5-6 to achieve visual parity.
- **Verification**: Each user story phase ends with a manual verification task derived from `quickstart.md`.
**: Follow with Phase 7 to update the main site content, then Phase 5-6 to achieve visual parity.
- **Verification**: Each user story phase ends with a manual verification task derived from `quickstart.md`.
