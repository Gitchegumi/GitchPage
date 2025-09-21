# GitchPage (Personal Website)

This file expands the global GEMINI.md to provide guidance for GitchPage â€“ a personal website and blog project.

## ðŸŒ Site Overview

- **Framework**: Next.js
- **Style**: TailwindCSS
- **Content**: MDX blog, personal projects, faith/tech writings
- **Deployment**: GitHub Pages (OCI or local preview)

## âœ… Gemini Can Help

- Refactor React components
- Suggest Tailwind improvements or layout fixes
- Review markdown/MDX structure and metadata
- Generate new blog stubs with frontmatter
- Assist with accessibility and semantic HTML
- Use GitHub CLI to inspect issues and help with organizing and planning next steps

## âš ï¸ Gemini Should Avoid

- Rewriting published posts unless labeled `draft`
- Modifying `.next/`, `node_modules/`, or `.env`
- Suggesting SEO or affiliate strategies unless prompted
- Using GitHub CLI to create branches, close issues, or initiate PRs. This will all be handled by the developer.

## ðŸ“ Structure

- `.github/workflows/`: GitHub Actions for CI/CD
- `public/`: Static files and assets

  - `demos/`: Voiceover demo files
  - `images/blog/`: Blog-specific images

- `src/`: Main source directory

  - `app/`: Route definitions and API handlers

    - `api/send-inquiry/`: Contact form handling
    - `blog/`: MDX content organized by category

      - `faith/`, `life/`, `opinion/`, `tech/`
      - `[category]/[slug]/`: Dynamic routing

    - `portfolio/`: Project showcases
    - `voice-over/`: Voiceover landing page

  - `components/`: Reusable React components

    - `ui/`: ShadCN-based UI elements
    - `utilities/`: Sitewide helpers

  - `lib/`: Shared libraries and utilities

## Things to Remember

- shadcn-ui is deprecated; use shadcn instead for UI components.
- Changes are made on the `dev`, tested locally, then merged to `main` for deployment.
- Use `gh` CLI commands to inspect issues and assist with planning, but do not create branches or PRs.
- Focus on improving user experience, accessibility, and code quality.

