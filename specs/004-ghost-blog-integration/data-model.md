# Data Model: Ghost Blog Integration

## Entities

### Post (Ghost CMS)
The canonical data structure retrieved from the Ghost Content API.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Post title |
| `slug` | string | URL slug (used for 1:1 mapping) |
| `feature_image` | string (URL) | Primary post image |
| `excerpt` | string | Short summary for cards |
| `published_at` | string (ISO) | Publication date |
| `url` | string (URL) | Full URL on `blog.gitchegumi.com` |
| `primary_tag` | object | Category/Tag information |

### Redirect Rule (Next.js)
The logic applied to legacy routes to route traffic to Ghost.

| Property | Value | Description |
|----------|-------|-------------|
| `source_path` | `/blog/*` | Legacy internal route |
| `target_base` | `https://blog.gitchegumi.com` | Ghost blog destination |
| `mapping_type` | 1:1 Slug | `/blog/[category]/[slug]` -> `target_base/[slug]` |

### Navigation Item (Theme)
Shared attributes across both Next.js and Handlebars templates.

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display text (e.g., "Home", "Portfolio") |
| `href` | string (URL) | Target destination (absolute for cross-domain) |
| `is_external` | boolean | True if linking between sites |

## State Transitions

### Legacy Content Lifecycle
1. **Legacy MDX**: Accessible at `www.gitchegumi.com/blog/...` (Old State)
2. **Transition**: User visits legacy URL -> Client-side script executes.
3. **Redirected**: Browser navigates to `blog.gitchegumi.com/...` (New State)
