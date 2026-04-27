# Contract: ERPNext Webhook Payload (Blog Post → n8n)

**Direction**: ERPNext → n8n HTTP Trigger
**Event**: Blog Post `on_update` where `doc.published == 1`

## ERPNext Webhook Configuration

| Setting | Value |
|---------|-------|
| DocType | `Blog Post` |
| Webhook Event | `on_update` |
| Condition | `doc.published == 1` |
| Request URL | `http://10.0.0.116:30109/webhook/{webhook-id}` (internal, same host) |
| Request Method | `POST` |
| Content Type | `application/json` |

## Payload Schema

```json
{
  "name": "string — unique slug, e.g. 'my-first-post'",
  "title": "string — full blog post title",
  "blog_intro": "string — short excerpt (may be empty if not set)",
  "route": "string — URL path, e.g. 'blog/personal/my-first-post'",
  "published": 1,
  "blog_category": "string — category name",
  "modified": "string — ISO datetime of last modification"
}
```

## Example Payload

```json
{
  "name": "my-first-post",
  "title": "My First Blog Post",
  "blog_intro": "A short introduction to what this post is about.",
  "route": "blog/personal/my-first-post",
  "published": 1,
  "blog_category": "Personal",
  "modified": "2026-04-23 10:30:00"
}
```

## n8n Validation

Upon receipt, n8n MUST:

1. Verify `published == 1` (defensive check)
2. Derive the public blog URL: `https://gitchegumi.com/{route}`
3. Use `title` as the idempotency key prefix: `New Post: {title}`
4. Use `blog_intro` as the newsletter excerpt (fallback: empty string)
