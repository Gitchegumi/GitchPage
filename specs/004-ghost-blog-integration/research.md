# Research: Ghost Blog Full Integration

## 1. Next.js Static Export Redirects (GitHub Pages)

### Decision: Client-side Redirects
Since the project uses `output: "export"` for GitHub Pages, server-side redirects via `next.config.ts` or Middleware are not possible.

### Rationale
To preserve legacy SEO and handle the `/blog` transition, we must use client-side redirects within the page components.

### Implementation Pattern
```tsx
// src/app/blog/page.tsx
'use client';
import { useEffect } from 'react';

export default function BlogRedirect() {
  useEffect(() => {
    window.location.replace('https://blog.gitchegumi.com');
  }, []);
  return <p>Redirecting to blog...</p>;
}
```
For legacy slugs, the catch-all or dynamic route will extract the `slug` and redirect to `https://blog.gitchegumi.com/${slug}`.

---

## 2. Ghost Content API Integration

### Decision: `@tryghost/content-api` with Server-side Fetching (Build Time)
We will use the official Ghost Content API client.

### Rationale
Since the site is static, we fetch the "Latest Posts" at build time. Next.js 15 App Router supports this naturally in Server Components.

### Implementation Pattern
```typescript
// src/lib/ghost.ts
import GhostContentAPI from '@tryghost/content-api';

export const ghostClient = new GhostContentAPI({
  url: process.env.GHOST_URL || '',
  key: process.env.GHOST_CONTENT_API_KEY || '',
  version: 'v5.0'
});
```

---

## 3. Visual Parity (Ghost Theme)

### Decision: Custom Handlebars Theme Modification
We will modify the existing `ghost_theme/custom-theme`.

### Rationale
Directly editing the theme allows for exact HTML/CSS replication of the main site's header/footer, including glassmorphism.

### Key CSS Pattern
```css
.nav-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 4. Homepage "Latest Posts" Migration

### Decision: Direct API Swap
Replace the `getERPNextPosts` call in the homepage logic with a `ghostClient.posts.browse` call.

### Rationale
Minimal structural change while switching to the new canonical data source.

### Alternatives Considered
- **ERPNext Redirects**: Rejected because it adds an unnecessary hop and depends on the legacy system being up.
- **Client-side Fetching**: Rejected to maintain SEO and performance benefits of static generation.
