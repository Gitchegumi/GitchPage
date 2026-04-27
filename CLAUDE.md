<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/003-blog-publish-workflow/plan.md

## Active Feature: Blog Publish Workflow (003)

**Branch**: `003-blog-publish-workflow`
**Tasks**: `specs/003-blog-publish-workflow/tasks.md`

### Stack & Service URLs

- **ERPNext** (blog CMS, newsletter, email): `https://erp.gitchegumi.com` (external) / `http://10.0.0.116:35003` (internal — use for n8n → ERPNext calls and ERPNext → n8n webhook URL)
- **n8n** (automation orchestrator): `https://n8n.gitchegumi.com` (external) / `http://10.0.0.116:30109` (internal — use for ERPNext webhook Request URL)
- **GitHub Actions** (site rebuild): `.github/workflows/nextjs.yml` — `workflow_dispatch` already enabled, no code changes needed

### Credentials Required

- **ERPNext API**: existing API key/secret from Administrator user → stored as n8n Header Auth credential named `ERPNext Auth` (`Authorization: token KEY:SECRET`) ✅ done
- **GitHub PAT**: PAT with `workflow` scope → stored as n8n Header Auth credential named `GitHub PAT` (`Authorization: Bearer TOKEN`) ✅ done

### Known Completed Setup

- `Blog Subscribers` Email Group: **exists** in ERPNext (T001 complete)
- `Website` Email Group: **exists** in ERPNext with active subscribers
- GitHub Actions `workflow_dispatch`: **already configured** on `nextjs.yml` — no YAML changes needed

### Key Design Contracts

- ERPNext webhook payload schema: `specs/003-blog-publish-workflow/contracts/erpnext-webhook-payload.md`
- ERPNext Newsletter API (create + send + admin alert): `specs/003-blog-publish-workflow/contracts/erpnext-newsletter-api.md`
- GitHub dispatch API: `specs/003-blog-publish-workflow/contracts/github-dispatch-api.md`

### Important Notes

- This feature has **zero Next.js source code changes** — all work is in ERPNext config and n8n workflow
- n8n webhook Production URL (from T006) must be pasted into the ERPNext webhook Request URL field (T007)
- Use ERPNext's native Newsletter DocType (not raw SMTP) — deduplication across both email groups is handled natively
- Newsletter → both groups in one Newsletter record via child table (`email_group` field)
- Retry policy: one retry after 30s; admin alert email sent via ERPNext API on second failure
<!-- SPECKIT END -->
