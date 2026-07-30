# Repository Instructions

## Project

GitchPage is a TypeScript, React, and Next.js personal website published through
GitHub Pages. Preserve the existing structure and conventions unless a change
specifically requires otherwise.

The repository contains two distinct site surfaces:

- `src/` contains the main Next.js application, including App Router routes,
  React components, MDX content, and shared libraries.
- `ghost_theme/` contains the separate Ghost publication theme.

Keep changes within the relevant surface. Do not modify the Next.js application
for a Ghost-only feature, or the Ghost theme for a Next.js-only feature, unless
the requested behavior genuinely spans both.

## Project Structure and Conventions

- `src/app/`: routes, layouts, API handlers, and MDX blog content.
- `src/components/`: reusable React components.
- `src/components/ui/`: shared UI primitives.
- `src/components/utilities/`: site-wide helpers.
- `src/lib/`: shared libraries and data utilities.
- `public/`: static images, demos, and other public assets.
- `.github/workflows/`: development validation and production deployment.
- `specs/`: feature specifications, plans, tasks, contracts, and verification
  notes.

Prefer existing components and established patterns before adding new
abstractions. When adding UI primitives, use the current `shadcn` tooling and
terminology; do not use the deprecated `shadcn-ui` package or commands.

## Development Flow

Use this promotion path for all changes:

1. Create a feature or fix branch.
2. Open a pull request from that branch into `dev`.
3. Merge into `dev` so the development CI workflow can build and test the
   integrated change.
4. Confirm the `dev` CI checks pass.
5. Open a pull request from `dev` into `main`.
6. Complete code review before merging.
7. Merge into `main` to publish through the production GitHub Pages workflow.

Do not open a feature branch directly into `main`.

Feature branches may start from `main` when they are independent of unreleased
work. Start from `dev` when the change depends on work already integrated there.
Check the difference between `main` and `dev` before choosing a base. `dev` may
intentionally be ahead of `main` while multiple features are being developed.

Keep `main` and `dev` aligned when there is no unreleased work. Treat `main` as
the production branch and `dev` as the integration branch.

## Validation and Release

The CI workflow on `dev` is the authoritative integration build and test gate.
Do not duplicate CI checks locally unless they are useful for diagnosing a
problem, validating a risky change before review, or the user asks for them.

When a change has a feature directory under `specs/`, read its current
specification, plan, tasks, contracts, research, and verification guidance as
applicable before editing. Treat those documents as the source of truth for the
feature's scope and acceptance criteria. Follow any feature-specific validation
requirements that remain current.

Opening a pull request does not authorize merging it. Opening the `dev` to
`main` pull request does not authorize publishing. Leave code review, merge,
and release actions for their explicit stages.

## Hosting and Configuration

The production site is deployed to GitHub Pages. Assume pages must work in the
static production environment unless the hosting architecture is deliberately
changed.

Use repository or environment variables for deployment-specific configuration.
Do not hardcode private endpoints, credentials, tokens, or environment-specific
values in source code. Remember that values included in a browser bundle,
including `NEXT_PUBLIC_*` values, are public even when supplied through GitHub
variables.

## Change Discipline

- Keep changes scoped to the requested work.
- Preserve unrelated user changes and avoid destructive Git operations.
- Do not edit generated or local-only paths such as `.next/`, `node_modules/`,
  or `.env*` files unless the user explicitly requests it. Update
  `.env.example` when documenting required configuration.
- Treat published blog posts as authored content. Do not rewrite a published
  post unless the user explicitly asks; draft content may be edited within the
  requested scope.
- Prioritize user experience, accessibility, semantic HTML, and maintainable
  code in implementation and review.
- Update documentation or example configuration when behavior or required
  variables change.
- Use Conventional Commit messages.
- Summarize user-facing behavior, configuration requirements, validation, and
  remaining release steps in pull requests.
