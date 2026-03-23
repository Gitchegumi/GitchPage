import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/**
 * Next.js configuration for GitchPage
 *
 * Note on Top-N Static Generation (Issue #144):
 * - The Tools Hub page uses client-side lazy loading via next/dynamic for non-top-N tools
 * - This works with output: "export" (static HTML export)
 * - If ISR is needed in the future, set output: "standalone" or remove "export"
 *   and add `dynamicParams: true` and `revalidate: 3600` to route segments
 */
const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === "production" ? "" : "",
  output: "export",
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "mdx", "md", "js", "jsx"],
};

export default withMDX(nextConfig);
