# Copilot Instructions for GitchPage

## Project Overview
- **GitchPage** is a personal website migrated from static HTML/CSS/JS to a [Next.js](https://nextjs.org/) application (see `README.md`).
- The codebase uses TypeScript, React, and Next.js App Router (see `src/app/`).
- Content is organized by domain: blog, portfolio, voice-over, etc. (see `src/app/`).
- Blog posts are written in MDX and organized by category (see `src/app/blog/`).

## Key Architectural Patterns
- **Component Structure:**
  - UI components are in `src/components/` (e.g., `Header.tsx`, `Footer.tsx`, `ui/`, `utilities/`).
  - Blog and content cards use custom components like `BentoBlogCard.tsx` and `BlogCard.tsx`.
  - Shared layouts and MDX rendering logic are in `src/components/ProseLayout.tsx` and `src/mdx-components.tsx`.
- **Content Loading:**
  - Blog post metadata and content are loaded via `src/lib/getAllPosts.ts`.
  - MDX files are used for blog content, with dynamic routing for categories and slugs (see `src/app/blog/[category]/[slug]/page.tsx`).
- **Styling:**
  - Uses global CSS (`src/app/globals.css`) and component-level styles.
  - Likely uses PostCSS (see `postcss.config.mjs`).

## Developer Workflows
- **Build:**
  - Standard Next.js build: `npm run build`
- **Development:**
  - Start dev server: `npm run dev`
- **Linting:**
  - Lint code: `npm run lint` (see `eslint.config.mjs`)
- **Type Checking:**
  - TypeScript config in `tsconfig.json`

## Project-Specific Conventions
- **Blog Posts:**
  - Place new posts in `src/app/blog/<category>/<slug>.mdx`.
  - Use the `blog.mdx.template` for new posts.
- **Components:**
  - Prefer using and extending components in `src/components/` and its subfolders.
  - Use `magicui/` for animated or special UI elements.
- **Assets:**
  - Images and media are in `public/images/`, `public/demos/`, etc.
  - Reference assets using the `/public` path in Next.js.

## Integration Points
- **No backend/serverless functions** are present; all content is static or loaded at build time.
- **No custom API routes** detected.
- **No database integration**; all data is file-based (MDX, images, etc.).

## Examples
- To add a new blog post:
  1. Copy `src/app/blog/blog.mdx.template` to the appropriate category folder.
  2. Update frontmatter and content.
- To add a new UI component:
  1. Create a new file in `src/components/` or a subfolder.
  2. Import and use it in the relevant page/layout.

---

For questions about project structure or conventions, see `README.md` or ask the repository owner.
