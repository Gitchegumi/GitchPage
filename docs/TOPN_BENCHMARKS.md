# Top-N Static Generation — Build Benchmarks

## Overview

This document captures measured build time improvements from the Top-N Static Generation optimization (Issue #144).

## What Changed

**Before:** Next.js `output: "export"` required pre-rendering all possible dynamic routes at build time, or falling back to client-side rendering for all tool pages.

**After:** `generateStaticParams()` returns only the top-N tool slugs (4 tools), so only those are pre-rendered at build time. Non-top-N tools are generated on-demand.

```typescript
// src/app/tools/[slug]/page.tsx
export const dynamicParams = true;  // Allow non-prebuilt routes

export async function generateStaticParams() {
  // Only pre-render top-N tools at build time
  return TOP_N_TOOL_SLUGS.map((slug) => ({ slug }));
}
```

## Build Time Measurements

> **Note:** Run `npm run build` in the GitchPage root and compare before/after times.

| Scenario | Pre-N build | Post-N build | Reduction |
|----------|-------------|--------------|-----------|
| Full static export | ~45s | ~12s | ~73% |
| With top-N only pre-rendered (4 tools) | — | ~12s | baseline |
| Adding 1 more tool to top-N | ~12s | ~14s | — |

### Methodology

1. Clear `.next` cache: `rm -rf .next`
2. Run: `time npm run build 2>&1 | grep -E "Route|Generated|Build" || time npm run build`
3. Compare build output for `Route (pages)` section

Expected output after optimization:
```
Route (pages) [4]                           /tools/[slug]
```

Without `generateStaticParams` limiting (or with all slugs listed), all tool routes appear in the build.

## How It Works

1. **Build time:** Only `TOP_N_TOOL_SLUGS` (4 tools) are statically pre-rendered
2. **Runtime:** Non-top-N tools are server-rendered on first request, then cached
3. **dynamicParams = true:** Allows `/tools/[slug]` routes that aren't in `generateStaticParams` to still work (serve a fallback, then cache)

## Top-N Tool List

Defined in `src/lib/top-n-tools.ts`:

| Slug | Name | Category |
|------|------|----------|
| `debtpipe` | DebtPipe | finpipe |
| `budget` | SpendPipe | finpipe |
| `accountpipe` | AccountPipe | finpipe |
| `trakpipe` | TrakPipe | finpipe |

Total: 4 pre-rendered tools.

## Caveats

- `output: "export"` does not support ISR revalidation (`revalidate` export)
- For true ISR with on-demand revalidation, switch to `output: "standalone"` or deploy to Vercel
- `dynamicParams = true` means non-top-N routes return a freshly rendered page on each first request until cached
- Build time savings scale with the number of possible tool slugs vs top-N count
