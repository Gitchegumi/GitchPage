## Problem

`src/lib/getAllPosts.ts` uses `fs.readdir()` and dynamic `import()` to load blog post metadata. This breaks under `output: 'export'` (static export) because Node APIs are unavailable at build time and dynamic imports are not supported.

## Solution: Build-Time MDX Metadata Index

1. Create `scripts/generate-mdx-index.ts` that runs as a prebuild step:
   - Scans `src/app/blog/**/*.mdx`
   - Extracts frontmatter (title, date, etc.) using `gray-matter` or regex.
   - Emits `src/lib/posts-index.json` with an array of metadata objects.
2. Update `getAllPosts()` to import and return the JSON (client-side safe).
3. Regenerate `sitemap.xml` and `rss.xml` from the index.

## Benefits

- Enables static export (`next build && next export`).
- Faster builds (no runtime directory traversal).
- RSS feed generation becomes straightforward.

## Acceptance Criteria

- `npm run build` succeeds with `output: 'export'`.
- Blog listing and individual post pages continue to work.
- RSS and sitemap are generated from the same index.
