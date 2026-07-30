# Tasks: Blog Publish Workflow

**Input**: Design documents from `specs/003-blog-publish-workflow/`
**Prerequisites**: plan.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅
**Branch**: `003-blog-publish-workflow`

## User Stories Summary

| ID | Story | Priority | FR Refs |
|----|-------|----------|---------|
| US1 | Publish → Newsletter sent to both email groups | P1 | FR-001, FR-002, FR-003, FR-004 |
| US2 | Publish → Website rebuild triggered | P2 | FR-005 |
| US3 | Retry once on failure, then alert admin by email | P3 | FR-007, FR-008 |
| US4 | Draft saves and unpublish events do NOT trigger workflow | P4 | FR-006, FR-009 |

---

## Phase 1: Setup — Prerequisites & Credentials

- [x] T001 Create "Blog Subscribers" Email Group in ERPNext: Setup → Email → Email Group → New; name it exactly `Blog Subscribers`
- [x] T002 [P] Generate GitHub Personal Access Token: GitHub → Settings → Developer settings → Personal access tokens → Classic; grant `workflow` scope; scope to `Gitchegumi/GitchPage` if using Fine-grained PAT
- [x] T003 [P] Create ERPNext API credential in n8n: Credentials → New → Header Auth; Name: `ERPNext Auth` (actual); Header: `Authorization`; Value: `token {ERP_API_KEY}:{ERP_API_SECRET}` (use existing key from ERPNext Administrator user)
- [x] T004 Create GitHub PAT credential in n8n: Credentials → New → Header Auth; Name: `GitHub PAT`; Header: `Authorization`; Value: `Bearer {PAT_from_T002}`

---

## Phase 2: Foundational — ERPNext Webhook

- [x] T005 Configure ERPNext Blog Post webhook: Setup → Integrations → Webhooks → New; DocType: `Blog Post`; Webhook Event: `on_update`; Condition: `doc.published == 1`; add fields: `name`, `title`, `blog_intro`, `route`, `published`, `blog_category`; leave Request URL blank for now (filled in T007); enable and save — confirm no errors on save

---

## Phase 3: US1 — Publish Triggers Newsletter

**Story goal**: A published blog post automatically generates and sends an ERPNext Newsletter to all subscribers in "Blog Subscribers" and "Website" email groups.

**Independent test criterion**: After completing T006–T012, publishing a test post must result in a Newsletter record appearing in ERPNext with `email_sent = 1` within 2 minutes.

- [x] T006 [US1] Create n8n workflow named "Blog Publish Workflow": n8n → Workflows → New; add Webhook node as trigger; set HTTP Method: `POST`; set Path to a memorable value (e.g., `blog-publish`); save and copy the Production webhook URL
- [x] T007 [US1] Update ERPNext webhook Request URL: open the webhook created in T005; paste the n8n Production webhook URL from T006; save
- [x] T008 [US1] Add defensive published guard to n8n workflow: add IF node after Webhook trigger; condition: `{{ $json.body.published }} equals 1`; true branch continues; false branch ends (no output)
- [x] T009 [US1] Add idempotency check node: add HTTP Request node after IF (true branch); Method: `GET`; URL: `http://10.0.0.116:35003/api/resource/Newsletter`; Query params: `filters=[["subject","=","New Post: {{ $json.body.title }}"]]&limit=1`; use `ERPNext API` credential; label node "Check Duplicate Newsletter"
- [x] T010 [US1] Add duplicate guard IF node: add IF node after T009; condition: `{{ $json.data.length }} greater than 0`; true branch ends with a Set node logging "duplicate suppressed"; false branch continues to newsletter creation
- [x] T011 [US1] Add Create Newsletter node: add HTTP Request node on false branch of T010; Method: `POST`; URL: `http://10.0.0.116:35003/api/resource/Newsletter`; use `ERPNext API` credential; Body: JSON per `contracts/erpnext-newsletter-api.md` Step 2 with `{{ $json.body.title }}`, `{{ $json.body.blog_intro }}`, and `{{ $json.body.route }}` from webhook payload; label "Create Newsletter"
- [x] T012 [US1] Add Send Newsletter node (run_doc_method/send_emails via POST /api/method/run_doc_method): add HTTP Request node after T011; Method: `POST`; URL: `http://10.0.0.116:35003/api/method/frappe.email.doctype.newsletter.newsletter.Newsletter.send_newsletter`; use `ERPNext API` credential; Body: `{ "name": "{{ $json.data.name }}" }` (using name from T011 response); label "Send Newsletter"

---

## Phase 4: US2 — Publish Triggers Website Rebuild

**Story goal**: A published blog post triggers a GitHub Actions `workflow_dispatch` so the static site rebuilds and the homepage reflects the new post.

**Independent test criterion**: After completing T013, publishing a test post must trigger a new "Deploy Next.js site to Pages" run visible in GitHub Actions within 1 minute.

- [x] T013 [P] [US2] Add GitHub dispatch node in parallel branch: add HTTP Request node branching from the false output of T010 (parallel to T011, not chained after it); Method: `POST`; URL: `https://api.github.com/repos/Gitchegumi/GitchPage/actions/workflows/nextjs.yml/dispatches`; use `GitHub PAT` credential; add header `Accept: application/vnd.github+json`; Body: `{ "ref": "main" }`; label "Trigger Site Rebuild"

---

## Phase 5: US3 — Retry on Failure, Alert Admin

**Story goal**: If either the newsletter send or the GitHub dispatch fails, the system retries once after 30 seconds. If the retry also fails, an alert email is sent to the site administrator.

**Independent test criterion**: Temporarily corrupting the GitHub PAT credential and publishing a post should result in an admin alert email arriving at `mat@gitchegumi.com` within 3 minutes.

- [x] T014 [US3] Enable "Retry on fail" on Send Newsletter node (T012): open node settings → enable "Retry on fail"; set retries to 1; set wait interval to 30 seconds; this exposes an error output on the node
- [x] T015 [P] [US3] Enable "Retry on fail" on GitHub Dispatch node (T013): open node settings → enable "Retry on fail"; set retries to 1; set wait interval to 30 seconds; this exposes an error output on the node
- [x] T016 [US3] Add admin alert node on Send Newsletter error output: connect an HTTP Request node to the error output of T012; Method: `POST`; URL: `http://10.0.0.116:35003/api/method/frappe.core.doctype.communication.email.make`; use `ERPNext Auth` credential; Body per `contracts/erpnext-newsletter-api.md` Step 4 with failed action "Newsletter send"; label "Alert Admin — Newsletter Failure"
- [x] T017 [P] [US3] Add admin alert node on GitHub Dispatch error output: connect an HTTP Request node to the error output of T013; identical structure to T016 but with failed action "GitHub dispatch"; label "Alert Admin — Rebuild Failure"

---

## Phase 6: US4 — Guard Condition Verification

**Story goal**: Draft saves and unpublish events must not trigger the newsletter or rebuild workflow.

**Independent test criterion**: Saving a blog post with `published = 0` produces no new n8n execution (or an execution that halts immediately at T008).

- [x] T018 [US4] Activate n8n workflow: in n8n, toggle the workflow to Active; confirm activation is saved without error

---

## Phase 7: Polish & Verification

- [x] T019 Run happy-path smoke test per `specs/003-blog-publish-workflow/quickstart.md` Steps 1–6: publish a test blog post and verify newsletter delivery and GitHub Actions rebuild trigger
- [ ] T020 Run idempotency test per `quickstart.md` Idempotency Test section: save the published post again; confirm no second newsletter and no second Actions run
- [ ] T021 Run guard condition test per `quickstart.md` Step 1: create and save a draft post; confirm no n8n execution fires (or fires and halts at guard)
- [ ] T022 Update `specs/003-blog-publish-workflow/plan.md` Progress Tracking: mark Phase 4 (Implementation) and Phase 5 (Validation) checkboxes as complete

---

## Dependencies

```text
T001 → T005
T002 → T004
T003 → (used by T009, T011, T012, T014, T016, T017)
T004 → (used by T013, T015)
T005 → T007 (webhook URL not known until T006)
T006 → T007 → T008 → T009 → T010 → T011 → T012
                                    → T013  (parallel with T011)
T012 → T014 → T016
T013 → T015 → T017
T018 (activate) → T019, T020, T021
T019, T020, T021 → T022
```

T002 and T003 are independent and can start immediately. T001 can start immediately. T004 depends on T002.

---

## Parallel Execution Examples

```text
# Phase 1 — run simultaneously:
Task: "T001 — Create Blog Subscribers email group in ERPNext"
Task: "T002 — Generate GitHub PAT"
Task: "T003 — Configure ERPNext API credential in n8n"

# After T002:
Task: "T004 — Configure GitHub PAT credential in n8n"

# After T010 false branch established — run simultaneously:
Task: "T011 — Add Create Newsletter node (Branch A)"
Task: "T013 — Add GitHub Dispatch node (Branch B)"

# After T012 and T013 — run simultaneously:
Task: "T014 — Add newsletter retry branch"
Task: "T015 — Add GitHub dispatch retry branch"

# After T014 and T015 — run simultaneously:
Task: "T016 — Add admin alert for newsletter failure"
Task: "T017 — Add admin alert for GitHub dispatch failure"
```

---

## Implementation Strategy

**MVP scope (minimum to validate end-to-end)**: T001–T013, T018, T019

This delivers: publish event → newsletter sent → site rebuilds. Retry/alert logic (US3) and guard condition tests (US4) are valuable but non-blocking for initial validation.

**Recommended order for solo implementation**:
1. T001, T002, T003 in parallel → T004
2. T005, T006 → T007
3. T008 → T009 → T010 → T011, T013 in parallel → T012
4. T014, T015 in parallel → T016, T017 in parallel
5. T018 → T019, T020, T021 in parallel → T022

---

## Notes

- All n8n nodes should be saved after each addition; test each node individually using n8n's built-in "Execute Node" before chaining
- ERPNext API responses use `data` as the root key for resource endpoints and `message` for method endpoints
- The n8n workflow webhook URL changes between Test and Production mode — always use the Production URL in the ERPNext webhook configuration
- `[P]` tasks can run in parallel only after their shared predecessors complete
