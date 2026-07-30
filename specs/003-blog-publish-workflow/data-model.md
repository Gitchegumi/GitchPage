# Data Model: Blog Publish Workflow

**Date**: 2026-04-23 | **Feature**: `003-blog-publish-workflow`

No new data models are introduced in the Next.js codebase. All entities are existing ERPNext DocTypes or configuration artifacts. This document describes the relevant fields and relationships used by the workflow.

---

## ERPNext Entities

### Blog Post *(existing DocType — read-only by workflow)*

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Unique slug, e.g., `my-first-post` |
| `title` | String | Human-readable title |
| `blog_intro` | Text | Short excerpt shown in listings |
| `route` | String | URL path, e.g., `blog/category/my-first-post` |
| `published` | Boolean | `1` = published, `0` = draft |
| `blog_category` | Link → Blog Category | Category name |
| `modified` | Datetime | Last modified timestamp |

**Lifecycle relevant to workflow**:

```text
draft (published=0) → published (published=1)   ← TRIGGERS workflow
published (published=1) → draft (published=0)   ← no trigger
```

**Workflow link**: `https://gitchegumi.com/{route}` (note: prepend site domain to `route`)

---

### Newsletter *(existing DocType — created by workflow per publish event)*

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Auto-generated, e.g., `NEWSLETTER-0001` |
| `subject` | String | Email subject; pattern: `New Post: {blog_post.title}` |
| `send_from` | Email | Sender address |
| `content_type` | Select | `Rich Text` |
| `message` | HTML | Email body with title, intro, and link |
| `email_group` | Child Table | One row per Email Group (see below) |
| `email_sent` | Boolean | Set to `1` by ERPNext after successful send |
| `scheduled_to_send` | Int | Total recipient count after send |

**Idempotency key**: `subject` field (`New Post: {title}`) — uniqueness checked before creation.

---

### Newsletter Email Group *(child table of Newsletter)*

| Field | Type | Notes |
|-------|------|-------|
| `email_group` | Link → Email Group | References "Blog Subscribers" or "Website" |

Two rows are created per Newsletter: one for each email group.

---

### Email Group *(existing DocType — referenced, not modified)*

| Group Name | Status | Notes |
|------------|--------|-------|
| `Website` | Exists | 3+ subscribers imported; templates configured |
| `Blog Subscribers` | Create if absent | Must be created in ERPNext before first publish |

---

### Automation Log *(n8n execution history — no new ERPNext entity needed)*

n8n's built-in execution history records each workflow run including:
- Trigger timestamp
- Input data (blog post name, title)
- Node-level success/failure status
- Error messages on failure

No additional logging entity is required. ERPNext Newsletter records also serve as a send audit trail (`email_sent`, `scheduled_to_send`).

---

## n8n Workflow Configuration Entities

These are not database entities but configuration artifacts that must be provisioned.

### n8n Credentials

| Credential Name | Type | Value Pattern |
|-----------------|------|---------------|
| `ERPNext API` | Header Auth | `Authorization: token {ERP_API_KEY}:{ERP_API_SECRET}` |
| `GitHub PAT` | Header Auth | `Authorization: Bearer {GITHUB_PAT}` |

### n8n Workflow Nodes (logical)

| Node | Purpose |
|------|---------|
| Webhook Trigger | Receives ERPNext publish event |
| IF — Published Guard | Validates `published == 1` |
| HTTP GET — Idempotency Check | Queries ERPNext for existing Newsletter |
| IF — Already Sent | Halts if duplicate |
| HTTP POST — Create Newsletter | Creates Newsletter doc in ERPNext |
| HTTP POST — Send Newsletter | Triggers ERPNext newsletter send |
| HTTP POST — GitHub Dispatch | Triggers site rebuild |
| Wait (30s) | Pause before retry |
| HTTP POST — Retry Newsletter | Retry newsletter send on first failure |
| HTTP POST — Retry GitHub | Retry GitHub dispatch on first failure |
| HTTP POST — Admin Alert | Sends failure email via ERPNext on second failure |
