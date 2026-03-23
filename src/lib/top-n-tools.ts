/**
 * Top-N Static Generation Configuration for GitchPage Tools Hub
 *
 * This config defines which tools are pre-generated at build time (top-N)
 * versus lazy-loaded on the client. The "top" designation is based on
 * expected traffic/popularity until analytics are available.
 *
 * Top-N tools are rendered statically at build time for:
 * - Faster initial page load (no client JS needed for these)
 * - Better SEO (fully rendered HTML)
 * - Better Core Web Vitals
 *
 * Non-top-N tools are lazy-loaded via next/dynamic with ssr: false,
 * showing a skeleton until hydrated.
 *
 * TOP_N_COUNT defines how many tools are pre-built statically.
 * Set to 20 per the issue #144 specification.
 */

export const TOP_N_COUNT = 20;

/**
 * Tool definitions with metadata for the tools hub.
 * Currently includes all active internal tools.
 */
export const TOOLS = [
  {
    name: "DebtPipe",
    slug: "debtpipe",
    description:
      "Debt snowball calculator with PDF exports. Track and eliminate your debt with a proven strategy.",
    status: "active",
    route: "/debtpipe",
    category: "finpipe",
    external: false,
  },
  {
    name: "SpendPipe",
    slug: "budget",
    description:
      "Monthly budgeting - track income, expenses, and cash flow. Includes template download and Excel import.",
    status: "active",
    route: "/budget",
    category: "finpipe",
    external: false,
  },
  {
    name: "AccountPipe",
    slug: "accountpipe",
    description:
      "Manage all your accounts in one place - checking, savings, credit cards, investments. Integrates with DebtPipe and SpendPipe.",
    status: "active",
    route: "/accountpipe",
    category: "finpipe",
    external: false,
  },
  {
    name: "TrakPipe",
    slug: "trakpipe",
    description:
      "Transaction ledger for tracking all your financial movements across accounts. Import, categorize, and reconcile with ease.",
    status: "active",
    route: "/trakpipe",
    category: "finpipe",
    external: false,
  },
  {
    name: "QuantPipe",
    slug: "quantpipe",
    description:
      "Institutional-grade backtesting and strategy development for forex and CFD traders. Powered by VectorBT and DuckDB.",
    status: "coming_soon",
    route: "https://github.com/Gitchegumi/quantpipe",
    category: "quant",
    external: true,
  },
] as const;

export type Tool = (typeof TOOLS)[number];

/**
 * Top-N tool slugs that are pre-generated at build time.
 * These are the most-visited/popular tools based on expected traffic.
 *
 * Currently includes all 4 active internal tools.
 * Expand this list as more tools are added.
 */
export const TOP_N_TOOL_SLUGS = ["debtpipe", "budget", "accountpipe", "trakpipe"] as const;

export type TopNToolSlug = (typeof TOP_N_TOOL_SLUGS)[number];

/**
 * Top-N tool names for display purposes.
 * Derived from TOP_N_TOOL_SLUGS via TOOLS lookup.
 */
export const TOP_N_TOOL_NAMES: readonly string[] = TOP_N_TOOL_SLUGS.map(
  (slug) => TOOLS.find((t) => t.slug === slug)?.name ?? slug
);

/**
 * Legacy export for backwards compatibility.
 * @deprecated Use TOP_N_TOOL_SLUGS or TOP_N_TOOL_NAMES instead.
 */
export const TOP_N_TOOLS = TOP_N_TOOL_NAMES;

/**
 * Check if a tool slug is in the top-N pre-built set.
 */
export function isTopN(slug: string): boolean {
  return (TOP_N_TOOL_SLUGS as readonly string[]).includes(slug);
}

/**
 * Legacy function for backwards compatibility.
 * Checks if a tool name is in the top-N set.
 * @deprecated Use isTopN(slug) with slugs instead.
 */
export function isTopNByName(toolName: string): boolean {
  return TOP_N_TOOL_NAMES.includes(toolName);
}

/**
 * Get tool by slug.
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/**
 * Get all tool slugs (for dynamic route validation).
 */
export function getAllToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}
