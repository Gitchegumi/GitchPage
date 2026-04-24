# Research: Blog Publish Workflow

**Date**: 2026-04-23 | **Feature**: `003-blog-publish-workflow`

---

## 1. ERPNext Webhook — Blog Post Publish Event

**Decision**: Configure an ERPNext webhook on the `Blog Post` DocType using the `on_update` event with the condition `doc.published == 1`.

**Rationale**: ERPNext Webhooks (Setup → Integrations → Webhooks) support per-field conditions. Using `on_update` with `doc.published == 1` fires only when the post transitions to or is saved in published state. The `on_submit` event is not appropriate because Blog Post is not a submittable DocType in standard ERPNext — it uses the `published` boolean field instead.

**Fields to include in payload**:

```json
{
  "name": "blog-post-slug",
  "title": "Blog Post Title",
  "blog_intro": "Short introductory text shown in listings",
  "route": "blog/category/blog-post-slug",
  "published": 1,
  "blog_category": "Category Name",
  "modified": "2026-04-23 10:00:00"
}
```

**Duplicate event risk**: ERPNext may fire `on_update` multiple times for the same save if multiple fields change. The n8n idempotency guard (see §5) addresses this.

**Alternatives considered**:
- `on_submit` — not applicable; Blog Post is not a submittable DocType
- Custom Server Script in ERPNext — more complex, harder to audit; webhook is simpler and sufficient

---

## 2. ERPNext Newsletter API — Create and Send

**Decision**: Create a Newsletter record via `POST /api/resource/Newsletter`, then trigger send via `POST /api/method/frappe.email.doctype.newsletter.newsletter.Newsletter.send_newsletter`.

**Rationale**: ERPNext's Newsletter DocType natively supports multiple Email Groups (child table `email_group`). Creating the record via API and then calling the send method keeps all email history, unsubscribe handling, and deduplication inside ERPNext — exactly as decided in the clarification session.

**Create Newsletter payload**:

```json
{
  "subject": "New Post: {blog_post_title}",
  "send_from": "Gitchegumi <mat@gitchegumi.com>",
  "content_type": "Rich Text",
  "message": "<h2>{title}</h2><p>{blog_intro}</p><p><a href='https://gitchegumi.com/{route}'>Read the full post →</a></p>",
  "email_group": [
    { "email_group": "Blog Subscribers" },
    { "email_group": "Website" }
  ]
}
```

**Send trigger**:

```text
POST /api/method/frappe.email.doctype.newsletter.newsletter.Newsletter.send_newsletter
Body: { "name": "NEWSLETTER-0001" }
```

**Alternative send approach**: Set `send_now = 1` in the create payload. This triggers send immediately on creation without a separate API call. However, it reduces the ability to inspect/verify the created Newsletter record before sending. Two-step approach preferred for auditability.

**Deduplication by ERPNext**: ERPNext's Newsletter send checks for existing subscribers across referenced groups and sends each address only once, satisfying FR-004 natively.

---

## 3. ERPNext API Authentication

**Decision**: Use ERPNext API Key + API Secret via `Authorization: token {api_key}:{api_secret}` header.

**Rationale**: This is the existing pattern used by GitchPage homepage cards (see project memory). The API key is already provisioned in ERPNext for the `Administrator` user. n8n will store this as a Header Auth credential.

**n8n credential setup**:

- Credential type: `Header Auth`
- Name: `ERPNext API`
- Header name: `Authorization`
- Header value: `token {ERP_API_KEY}:{ERP_API_SECRET}`

**Scope required**: The ERPNext user associated with the API key must have access to create Newsletter records and call the send method. Administrator role is sufficient.

---

## 4. GitHub Actions workflow_dispatch API

**Decision**: Use the GitHub REST API endpoint `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`.

**Rationale**: The `nextjs.yml` workflow already declares `workflow_dispatch:` with no required inputs, so no input payload is needed. The PAT requires the `workflow` scope.

**API call**:

```text
POST https://api.github.com/repos/Gitchegumi/GitchPage/actions/workflows/nextjs.yml/dispatches
Authorization: Bearer {GITHUB_PAT}
Content-Type: application/json

{ "ref": "main" }
```

**Response**: HTTP 204 No Content on success. Any 4xx/5xx response should trigger the retry logic.

**PAT scope required**: `workflow` (grants Actions write access). Classic PAT is acceptable for a personal repository.

**Storage**: PAT stored as an n8n credential (Header Auth or a dedicated credential type). Never stored in git or environment variables exposed in the Next.js build.

---

## 5. n8n Idempotency and Retry Patterns

**Decision — Idempotency**: Before creating a Newsletter, query ERPNext for an existing Newsletter with subject `New Post: {blog_post_title}`. If a record is found, halt execution without error.

**Rationale**: This is a lightweight check that requires no external state store. The Newsletter subject acts as the natural idempotency key scoped to each unique blog post title. If titles could repeat, the `name` (slug) field from the Blog Post should be appended.

**Idempotency check API call**:

```text
GET /api/resource/Newsletter?filters=[["subject","=","New Post: {title}"]]&limit=1
```

If `data.length > 0`, skip and log "duplicate suppressed".

**Decision — Retry**: Use n8n's built-in error workflow capability or an explicit retry pattern in the workflow.

**Rationale**: n8n supports error workflows at the workflow level. However, for per-action retry with a single attempt, the cleanest approach is to use an n8n `Wait` node (30s) followed by a retry of the HTTP Request node, controlled by a counter stored in workflow static data or a Set node tracking attempt number.

**Simpler approach**: Use n8n's `On Error` output on HTTP Request nodes (available in n8n ≥ 1.x). On error: wait 30s (Wait node), retry once. If second attempt fails: proceed to admin notification branch.

---

## 6. Admin Failure Notification

**Decision**: Send failure notification via ERPNext's outbound email using `POST /api/method/frappe.core.doctype.communication.email.make`.

**Rationale**: Keeps notification within existing ERPNext email infrastructure. No new integrations required. The notification goes to `mat@gitchegumi.com`.

**API call**:

```text
POST /api/method/frappe.core.doctype.communication.email.make
Body:
{
  "recipients": "mat@gitchegumi.com",
  "subject": "Blog Publish Workflow Failed: {blog_post_title}",
  "content": "The automated blog publish workflow failed after one retry.\n\nAction: {failed_action}\nPost: {post_title}\nError: {error_detail}\nTimestamp: {timestamp}",
  "send_email": 1
}
```

**Alternative**: Use ERPNext's `sendmail` method or configure an n8n email node using SMTP directly. Rejected — ERPNext API approach is consistent with the rest of the workflow and avoids additional SMTP credentials in n8n.
