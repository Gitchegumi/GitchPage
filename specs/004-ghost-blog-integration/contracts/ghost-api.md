# Contract: Ghost Content API Client

This contract defines the internal interface for interacting with the Ghost Content API.

## Client Configuration

```typescript
interface GhostConfig {
  url: string;        // GHOST_URL env var
  key: string;        // GHOST_CONTENT_API_KEY env var
  version: 'v5.0';
}
```

## Methods

### `getLatestPosts(limit: number)`
Fetches the most recent posts for the homepage.

**Parameters:**
- `limit`: Number of posts to retrieve (default: 3).

**Returns:**
- `Promise<GhostPost[]>`

### `getPostBySlug(slug: string)`
Used for validating slugs or retrieving metadata (if needed for redirects).

**Parameters:**
- `slug`: The post slug.

**Returns:**
- `Promise<GhostPost | null>`

## Data Structures

### `GhostPost`
```typescript
interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  url: string;
}
```
