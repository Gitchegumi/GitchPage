# Implementation Plan: Constrain Blog Iframe & Surface Subscribe Form

**Branch**: `002-constrain-blog-iframe` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Both the main blog listing page (`/blog`) and individual post pages (`/blog/[category]/[slug]`) embed ERPNext content via iframe with `?embed=1`. The listing page already constrains scrolling correctly. Individual post pages allow users to scroll past the blog content and into the ERPNext header/footer because the post content is taller than the fixed iframe height. Additionally, the subscribe form is only accessible in the ERPNext footer (reachable on individual posts by scrolling) and invisible on the main listing page.

The fix has two parts: (1) ensure ERPNext fully suppresses its header and footer on all embedded page types, and (2) surface the existing `SubscribeForm` component natively in the Next.js `/blog` page layout outside the iframe.

---

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router, static export)
**Primary Dependencies**: React, Tailwind CSS, ERPNext (external, CSS-only touch)
**Storage**: N/A
**Testing**: Manual a11y smoke check; build type-check (`npm run build`)
**Target Platform**: Static site on GitHub Pages; ERPNext on `erp.gitchegumi.com`
**Project Type**: Web (Next.js frontend, ERPNext as headless CMS via iframe)
**Performance Goals**: No regression on LCP; iframe layout shift should not increase CLS
**Constraints**: Cross-origin iframe — no JS messaging into ERPNext; changes to ERPNext must be CSS/config only
**Scale/Scope**: Two Next.js page files + one ERPNext CSS/config change

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content Authenticity | ✅ Pass | No content changes |
| II. Sustainable Static Foundation | ✅ Pass | Layering onto existing iframe pattern; no new API routes |
| III. Design & Accessibility | ✅ Pass | Subscribe form already accessible; iframe titles retained; a11y smoke check required pre-merge |
| IV. Measurable Quality & Testing | ⚠️ Requires action | Structural layout change → manual a11y smoke check + `npm run build` must pass |
| V. Lean Evolution | ✅ Pass | Reuses existing `SubscribeForm` component; no new dependencies |

**Gate**: PASS — with the requirement that an a11y smoke check and clean build are completed before merge.

---

## Project Structure

### Documentation (this feature)
```
specs/002-constrain-blog-iframe/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← N/A (no new data entities)
└── tasks.md             ← Phase 2 output (/tasks command)
```

### Source Changes (repository root)
```
src/app/blog/
├── page.tsx                        ← modify: add SubscribeForm, adjust layout
└── [category]/[slug]/page.tsx      ← no change needed (ERPNext CSS fix handles it)

src/components/
└── SubscribeForm.tsx               ← no change needed (reused as-is)
```

### ERPNext Changes (out-of-repo, config only)
```
erp.gitchegumi.com
└── Website Settings → Custom CSS   ← add embed suppression rules for all page types
```

---

## Phase 0: Research

### Finding 1 — Why individual post iframes are not constrained

**Decision**: ERPNext's `?embed=1` works for the blog listing page because the listing content fits within `calc(100vh - 90px)`. On individual posts the content is taller, so the iframe becomes internally scrollable. As the user scrolls down, they reach the ERPNext footer — which `?embed=1` may hide visually but likely does not `display: none`, leaving it as scrollable dead space (or worse, partially visible).

**Rationale**: The fix must live in ERPNext's CSS, not in the iframe element itself. Adding `scrolling="no"` or `overflow: hidden` to the Next.js iframe would prevent all content scrolling — unusable for long posts.

**Alternatives considered**:
- `scrolling="no"` on iframe → rejected (breaks post readability)
- Dynamic iframe height resize via `postMessage` → rejected (cross-origin; adds complexity; against Principle V)
- ERPNext Jinja template override per page type → rejected (fragile; over-engineered)

**Resolution**: Add custom CSS in ERPNext Website Settings that applies `display: none !important` to navbar and footer whenever the `embed` query param is present. ERPNext sets a `data-path` attribute and processes query params at render time; the cleanest hook is a JS snippet in ERPNext's Website Script that adds a CSS class to `<body>` when `?embed=1` is detected, combined with CSS rules targeting that class.

---

### Finding 2 — Subscribe form placement

**Decision**: Render the existing `SubscribeForm` component natively in the Next.js `/blog` page, **below** the iframe. The iframe height is reduced from `calc(100vh - 90px)` to `calc(100vh - 90px - 220px)` (desktop) with a responsive cap, leaving room for the subscribe form beneath without page-level scroll.

**Rationale**: The `SubscribeForm` already posts to n8n → ERPNext "Website" email group. No new integration needed. Placing it outside the iframe avoids all cross-origin concerns and keeps it in the statically-rendered Next.js layer.

**Alternatives considered**:
- New ERPNext Web Form inside the iframe → rejected (requires cross-origin form submission handling, harder to brand-match)
- Sticky/fixed overlay subscribe bar → rejected (adds complexity; hides content)
- Sidebar layout with subscribe form alongside iframe → viable on desktop but complex responsive breakpoint handling; deferred unless simple two-row layout proves inadequate

---

## Phase 1: Design & Contracts

### No API contracts

This feature makes no changes to external-facing APIs. There are no new endpoints, webhooks, or data schemas. Contracts section is omitted per template guidance.

### Data Model

No new data entities. The `SubscribeForm` continues to use the existing pattern (email + honeypot → n8n webhook → ERPNext "Website" email group).

### ERPNext CSS Change (Website Settings → Custom CSS / Website Script)

Add to **Website Settings → Script** (JavaScript, runs on all ERPNext web pages):

```javascript
// Hide navbar and footer when rendered in embedded mode
(function() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('embed') === '1') {
    document.documentElement.classList.add('erpnext-embedded');
  }
})();
```

Add to **Website Settings → Style** (CSS):

```css
/* Fully suppress ERPNext chrome when embedded in an iframe */
html.erpnext-embedded .navbar,
html.erpnext-embedded nav,
html.erpnext-embedded footer,
html.erpnext-embedded .web-footer,
html.erpnext-embedded .footer {
  display: none !important;
}

html.erpnext-embedded body {
  padding-top: 0 !important;
  margin-top: 0 !important;
}
```

### Next.js `/blog` Page Layout Change

Restructure `src/app/blog/page.tsx` from a single full-height iframe to a two-row flex layout:

```
┌─────────────────────────────────┐
│  iframe (ERPNext blog listing)  │  height: calc(100vh - 90px - 220px)
│  ?embed=1                       │
├─────────────────────────────────┤
│  SubscribeForm (Next.js)        │  ~220px
└─────────────────────────────────┘
```

On mobile (< 640px), allow the form to stack naturally below the iframe with appropriate padding.

### Individual Post Pages

No Next.js code change required. The ERPNext CSS fix (above) removes the footer from the scrollable document height on all embedded pages, including individual posts. The iframe at `calc(100vh - 90px)` remains correct.

### Quickstart (manual verification steps)

1. Deploy ERPNext Website Settings changes (Script + Style)
2. Open `https://erp.gitchegumi.com/blog?embed=1` directly — confirm no navbar or footer visible
3. Open `https://erp.gitchegumi.com/blog/[category]/[slug]?embed=1` directly — scroll to bottom — confirm no footer visible
4. Open `https://gitchegumi.com/blog` — confirm iframe shows listing, subscribe form is visible below without page scrolling
5. Open `https://gitchegumi.com/blog/[category]/[slug]` — scroll down — confirm no ERPNext chrome appears
6. Submit a test email in the subscribe form — confirm success message and ERPNext email group receipt
7. Run `npm run build` — confirm zero type errors
8. A11y smoke: keyboard-tab through `/blog` page — confirm iframe title is announced, subscribe form fields are reachable and labelled

---

## Phase 2: Task Planning Approach *(described only — executed by /tasks)*

**Task generation strategy**:
- Task 1: ERPNext Website Settings — add embed detection JS snippet
- Task 2: ERPNext Website Settings — add embed suppression CSS
- Task 3: Verify ERPNext embed fix on blog listing and individual post pages
- Task 4: Update `src/app/blog/page.tsx` — two-row layout with reduced iframe height + `SubscribeForm`
- Task 5: Verify subscribe form visible without scrolling on `/blog` (desktop + mobile)
- Task 6: Run `npm run build` and confirm zero errors
- Task 7: A11y smoke check per quickstart
- Task 8: Commit and push; open PR

**Ordering**: ERPNext config (Tasks 1–3) before Next.js changes (Task 4), since the CSS fix is the dependency for individual post constraint. Tasks 1–2 can be done in parallel. Task 4 is independent of Tasks 1–3 and can proceed in parallel.

---

## Complexity Tracking

No constitution violations requiring justification.

---

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete
- [x] Phase 1: Design complete
- [x] Phase 2: Task planning approach described
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

---
*Based on GitchPage Constitution v1.0.0 — See `/.specify/memory/constitution.md`*
