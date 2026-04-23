# Implementation Plan: Constrain Blog Iframe & Surface Subscribe Form

**Branch**: `002-constrain-blog-iframe` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)
**Supersedes**: plan.md dated 2026-04-22 (spec amended to add two-tier subscription model)

## Summary

Both the main blog listing page (`/blog`) and individual post pages (`/blog/[category]/[slug]`) embed ERPNext content via iframe with `?embed=1`. The listing page already constrains scrolling correctly; individual post pages allow users to scroll into the ERPNext header/footer. The subscribe form in the ERPNext footer is inaccessible on the listing page and, once surfaced in Next.js, needs to offer a meaningful subscription tier choice: blog posts only ("Blog Subscribers" email group) or all communications ("Website" email group). A new ERPNext email group and a new Next.js component are required.

---

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router, static export)
**Primary Dependencies**: React, Tailwind CSS, ERPNext (CSS/config + new email group), n8n (workflow update)
**Storage**: N/A
**Testing**: Manual smoke check; `npx tsc --noEmit`
**Target Platform**: Static site on GitHub Pages; ERPNext on `erp.gitchegumi.com`; n8n on `n8n.gitchegumi.com`
**Project Type**: Web (Next.js frontend, ERPNext as headless CMS, n8n as automation middleware)
**Performance Goals**: No regression on LCP; form interactions complete within 5 seconds
**Constraints**: Cross-origin iframe — no JS messaging into ERPNext; Next.js is static export (no server-side logic)
**Scale/Scope**: One new Next.js component, one updated `/blog` page, one n8n workflow change, two ERPNext config changes, one new ERPNext email group

---

## Constitution Check

| Principle                                 | Status             | Notes                                                                              |
| ----------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| I. Content Authenticity                   | ✅ Pass            | No content changes                                                                 |
| II. Sustainable Static Foundation         | ✅ Pass            | New component in static layer; no new API routes in Next.js                        |
| III. Design & Accessibility               | ✅ Pass            | New form must meet a11y standards; smoke check required pre-merge                  |
| IV. Build Integrity & Manual Verification | ⚠️ Requires action | Structural + new component → `npx tsc --noEmit` + manual a11y + visual smoke check |
| V. Lean Evolution                         | ✅ Pass            | New component is minimal; n8n change is additive; no new Next.js dependencies      |

**Gate**: PASS — `npx tsc --noEmit` clean + manual a11y + visual smoke check before merge.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-constrain-blog-iframe/
├── plan.md              ← this file
├── research.md          ← Phase 0 output (embedded below)
└── tasks.md             ← Phase 2 output (/tasks command)
```

### Source Changes (repository root)

```text
src/app/blog/
├── page.tsx                        ← modify: two-row layout, add TieredSubscribeForm
└── [category]/[slug]/page.tsx      ← no change (ERPNext CSS fix handles it)

src/components/
├── SubscribeForm.tsx               ← no change (left intact for other uses)
└── TieredSubscribeForm.tsx         ← new component
```

### Out-of-repo Changes

```text
erp.gitchegumi.com
├── Website Settings → Script       ← embed detection JS (unchanged from original plan)
├── Website Settings → Style        ← embed suppression CSS (unchanged from original plan)
└── Email Group → "Blog Subscribers" ← new, must be created before form goes live

n8n.gitchegumi.com
└── Subscribe workflow              ← add tier routing (IF node: "blog" → Blog Subscribers, else → Website)
```

---

## Phase 0: Research

### Finding 1 — Why individual post iframes are not constrained (unchanged)

**Decision**: ERPNext's `?embed=1` works for the blog listing page because the content fits within `calc(100vh - 90px)`. On individual posts the content is taller, so the iframe becomes internally scrollable and the user can reach the ERPNext footer.

**Resolution**: Add a JS snippet to ERPNext Website Settings that detects `?embed=1` and adds `erpnext-embedded` class to `<html>`, combined with CSS that `display: none !important` on all header/footer selectors.

**Alternatives rejected**: `scrolling="no"` on iframe (breaks post readability); `postMessage` resize (cross-origin complexity); Jinja template overrides (fragile).

---

### Finding 2 — Subscribe form: new component required

**Decision**: Create `src/components/TieredSubscribeForm.tsx` as a new component. Do not modify the existing `SubscribeForm` — it may be used elsewhere on the site and has a different, simpler purpose.

**Rationale**: The new form requires tier selection UI (two option cards), a `tier` field in the payload, and a different heading/description. Modifying `SubscribeForm` would add conditional logic and reduce its clarity. A separate component is cleaner and aligns with Principle V (lean, purposeful components).

**Component design**:

```text
┌──────────────────────────────────────────┐
│  Stay in the loop                        │
│  Choose what you'd like to hear about:   │
│                                          │
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ ✦ Blog only     │ │ ✦ Tell me       │ │
│  │                 │ │   everything    │ │
│  │ New posts only. │ │ Posts + shop    │ │
│  │ That's it.      │ │ launches and    │ │
│  │                 │ │ announcements.  │ │
│  └─────────────────┘ └─────────────────┘ │
│                                          │
│  [ your@email.com              ]         │
│  [        Subscribe            ]         │
└──────────────────────────────────────────┘
```

- Tier selection is **required** — submit button is disabled until both a tier and a valid email are provided.
- Option cards use a selected/unselected visual state consistent with brand colors.
- Honeypot field retained (hidden, same pattern as `SubscribeForm`).
- Posts to `NEXT_PUBLIC_N8N_SUBSCRIBE_URL` with payload `{ email, tier, honeypot }`.

**Alternatives rejected**: Modifying `SubscribeForm` (adds conditional complexity); ERPNext Web Form inside iframe (cross-origin, harder to brand-match); radio buttons without cards (less readable on mobile).

---

### Finding 3 — n8n subscribe workflow routing

**Decision**: Update the existing n8n subscribe workflow to read a `tier` field from the incoming webhook payload and route to the appropriate ERPNext email group.

**Routing logic**:

- `tier === "blog"` → add subscriber to ERPNext "Blog Subscribers" email group
- `tier === "all"` (or any other value) → add subscriber to ERPNext "Website" email group

**Implementation**: Add a Switch or IF node in n8n after the webhook trigger, before the ERPNext API call. The ERPNext "add to email group" step is duplicated for each branch (or parameterised if n8n supports it cleanly). The existing webhook URL (`NEXT_PUBLIC_N8N_SUBSCRIBE_URL`) does not need to change.

**Alternatives rejected**: Two separate n8n webhook URLs (requires two env vars and complicates the component); client-side ERPNext API call (exposes API key in browser).

---

### Finding 4 — "Blog Subscribers" email group

**Decision**: Create a new ERPNext email group named exactly **"Blog Subscribers"** via the ERPNext admin UI before the form goes live.

**Rationale**: This group will receive blog post notifications only, keeping it cleanly separated from "Website" which will eventually include ecommerce announcements.

**Setup**: ERPNext → Email Group → New → Name: "Blog Subscribers", Group Type: Newsletter. No subscribers need to be migrated — existing 3 subscribers in "Website" chose that before the two-tier model existed and can remain there.

---

### Finding 5 — Updated height budget for `/blog` layout

**Decision**: Reserve `320px` (up from `220px`) for the `TieredSubscribeForm`, adjusting the iframe height to `calc(100vh - 90px - 320px)`.

**Rationale**: Two option cards + description text + email input + submit button + padding require approximately 300–320px at desktop widths. On mobile (< 640px) the layout stacks naturally; a `min-height: 0` on the iframe with `flex-shrink: 1` prevents overflow.

---

## Phase 1: Design & Contracts

### ERPNext Config (Website Settings)

**Script tab** — detect embed mode (unchanged from original plan):

```javascript
(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get("embed") === "1") {
    document.documentElement.classList.add("erpnext-embedded");
  }
})();
```

**Style tab** — suppress chrome in embed mode (unchanged from original plan):

```css
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

### New "Blog Subscribers" Email Group

Create via ERPNext admin UI. No migration of existing subscribers required.

### TieredSubscribeForm Component (`src/components/TieredSubscribeForm.tsx`)

- `"use client"` directive (client component, same as `SubscribeForm`)
- State: `email`, `tier: "blog" | "all" | null`, `honeypot`, `status`, `message`
- Two option cards — selected card highlighted with brand blue border/glow
- Submit disabled until `tier !== null && email valid`
- On submit: POST `{ email, tier, honeypot }` to `NEXT_PUBLIC_N8N_SUBSCRIBE_URL`
- Success/error feedback using same pattern as `SubscribeForm`
- Wraps in `MagicCard` with same gradient settings as `SubscribeForm`

### Updated `/blog` Page Layout (`src/app/blog/page.tsx`)

```text
┌─────────────────────────────────┐
│  iframe (ERPNext blog listing)  │  flex-1, min-height: 0; approx calc(100vh - 90px - 320px)
│  ?embed=1                       │
├─────────────────────────────────┤
│  TieredSubscribeForm            │  ~320px
└─────────────────────────────────┘
```

Parent: `flex flex-col` with `height: calc(100vh - 90px)`.
Iframe: `flex-1 min-h-0` (takes remaining space after form).
Form wrapper: `shrink-0` with appropriate horizontal padding.

This approach is more resilient than a hard-coded iframe height subtraction — the flex layout absorbs any height discrepancy naturally.

### n8n Workflow Update

Add after webhook trigger, before ERPNext call:

```text
IF node: {{ $json.tier === "blog" }}
  → TRUE branch: Add to ERPNext "Blog Subscribers" email group
  → FALSE branch: Add to ERPNext "Website" email group
```

Honeypot check (already present) remains before the IF node.

### Individual Post Pages

No Next.js change required. ERPNext CSS fix handles constraint on all embedded page types.

### Quickstart (manual verification steps)

1. In ERPNext admin, create "Blog Subscribers" email group.
2. Deploy ERPNext Website Settings (Script + Style changes).
3. Open `erp.gitchegumi.com/blog?embed=1` — scroll up and down — confirm no navbar or footer visible.
4. Open `erp.gitchegumi.com/blog/[category]/[slug]?embed=1` — scroll to bottom — confirm no footer visible.
5. Update n8n subscribe workflow with tier routing IF node.
6. Open `gitchegumi.com/blog` — confirm `TieredSubscribeForm` is visible in the initial viewport (375px+ widths).
7. Submit with "Blog only" tier — confirm success message; verify email appears in ERPNext "Blog Subscribers" group.
8. Submit with "Tell me everything" tier — confirm success message; verify email appears in ERPNext "Website" group.
9. Attempt to submit without selecting a tier — confirm submit button is disabled.
10. Run `npx tsc --noEmit` — confirm zero errors.
11. Open `gitchegumi.com/blog/[category]/[slug]` — scroll to top and bottom — confirm no ERPNext chrome.
12. A11y smoke: keyboard-tab through `/blog` — iframe title announced, option cards reachable and selectable, email field labelled, submit button activatable.

---

## Phase 2: Task Planning Approach _(described only — executed by /tasks)_

**Task generation strategy**:

1. Create "Blog Subscribers" email group in ERPNext admin (foundational — must exist before n8n or form goes live)
2. ERPNext Website Settings — embed detection JS
3. ERPNext Website Settings — embed suppression CSS
4. Verify ERPNext embed fix (blog listing + individual post)
5. Update n8n subscribe workflow — add tier IF node
6. Build `TieredSubscribeForm` component in `src/components/TieredSubscribeForm.tsx`
7. Update `src/app/blog/page.tsx` — flex layout + `TieredSubscribeForm`
8. Type-check (`npx tsc --noEmit`)
9. Visual + a11y smoke check per quickstart
10. End-to-end subscription verification (both tiers)
11. Final build pass + commit + PR

**Ordering**: ERPNext email group (step 1) and n8n update (step 5) are prerequisites for end-to-end verification. ERPNext config (steps 2–3) and n8n (step 5) and component build (step 6) can all proceed in parallel. Step 7 depends on step 6.

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

_Based on GitchPage Constitution v1.1.1 — See `.specify/memory/constitution.md`_
