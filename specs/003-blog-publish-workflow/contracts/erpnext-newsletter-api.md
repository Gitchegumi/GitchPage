# Contract: ERPNext Newsletter API (n8n → ERPNext)

**Direction**: n8n → ERPNext REST API
**Auth**: `Authorization: token {ERP_API_KEY}:{ERP_API_SECRET}`
**Base URL (external)**: `https://erp.gitchegumi.com`
**Base URL (n8n → ERPNext, same host)**: `http://10.0.0.116:35003` — use this in all n8n HTTP Request nodes

---

## Step 1: Idempotency Check

**Purpose**: Verify no Newsletter has already been sent for this post.

```text
GET /api/resource/Newsletter
  ?filters=[["subject","=","Gitchegumi just dropped: {title}"]]
  &limit=1
```

**Response (already exists)**:

```json
{ "data": [{ "name": "NEWSLETTER-0001" }] }
```

If `data.length > 0`: halt workflow, log "duplicate suppressed for: {title}".

---

## Step 2: Create Newsletter

```text
POST /api/resource/Newsletter
Content-Type: application/json
```

**Request body**:

```json
{
  "subject": "Gitchegumi just dropped: {blog_post.title}",
  "send_from": "Gitchegumi <mat@gitchegumi.com>",
  "sender_email": "mat@gitchegumi.com",
  "content_type": "Rich Text",
  "message": "<p>Hey there! 👋</p><p>A new post just dropped on Gitchegumi — come check it out!</p><h2>{blog_post.title}</h2><p>{blog_post.blog_intro}</p><p><a href='https://gitchegumi.com/{blog_post.route}'>Read it now →</a></p><p>Catch you on the next one,<br>Mat @ Gitchegumi</p>",
  "email_group": [
    { "email_group": "Blog Subscribers" },
    { "email_group": "Website" }
  ]
}
```

**Success response** (HTTP 200): returns the created Newsletter doc; store `data.name` for Step 3.

---

## Step 3: Send Newsletter

```text
POST /api/method/run_doc_method
Content-Type: application/json
```

**Request body**:

```json
{
  "dt": "Newsletter",
  "dn": "{newsletter_name}",
  "method": "send_emails"
}
```

**Success response** (HTTP 200): `{ "message": "ok" }`

---

## Step 4: Admin Failure Notification (on persistent failure only)

Sent only after one retry has also failed.

```text
POST /api/method/frappe.core.doctype.communication.email.make
Content-Type: application/json
```

**Request body**:

```json
{
  "recipients": "mat@gitchegumi.com",
  "subject": "Blog Publish Workflow Failed: {blog_post.title}",
  "content": "The blog publish workflow failed after one automatic retry.\n\nFailed action: {action_name}\nBlog post: {blog_post.title}\nError: {error_detail}\nTimestamp: {timestamp}",
  "send_email": 1
}
```

**Success response** (HTTP 200): `{ "message": "ok" }`
