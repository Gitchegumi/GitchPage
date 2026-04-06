/**
 * Tools Hub - Dynamic Tool Page with Top-N Static Generation
 *
 * This page implements the top-N static generation pattern from issue #144:
 * - Top N tools (defined in top-n-tools.ts) are pre-generated at build time
 * - Other tools are rendered dynamically via SSR/client-side
 * - dynamicParams=true allows non-prebuilt routes to still work
 *
 * Build time optimization is secondary per user feedback;
 * prioritize correctness and clean implementation.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  TOP_N_TOOL_SLUGS,
  TOP_N_COUNT,
  isTopN,
  getToolBySlug,
  getAllToolSlugs,
  TOOLS,
} from "@/lib/top-n-tools";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Enable dynamic rendering for non-top-N tools.
 * Without this, tools not in generateStaticParams would 404.
 */
export const dynamicParams = true;

/**
 * Generate metadata for SEO.
 * Pre-generated for top-N tools, generated on-demand for others.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found | GitchPage" };
  }

  return {
    title: `${tool.name} | Tools Hub | GitchPage`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Tools Hub`,
      description: tool.description,
      type: "website",
    },
  };
}

/**
 * Generate static params for top-N tools only.
 * This is the core of the top-N static generation pattern.
 * Non-top-N tools will be rendered dynamically on first request.
 */
export async function generateStaticParams() {
  console.log(`[tools/[slug]] Generating static params for top ${TOP_N_COUNT} tools:`, TOP_N_TOOL_SLUGS);

  return TOP_N_TOOL_SLUGS.map((slug) => ({
    slug,
  }));
}

/**
 * Tool page component.
 * For top-N tools: pre-rendered at build time (static).
 * For other tools: rendered on-demand (dynamic SSR).
 */
export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  // 404 if tool doesn't exist
  if (!tool) {
    notFound();
  }

  // Track whether this is a dynamic (non-top-N) render
  const isDynamic = !isTopN(slug);

  if (isDynamic) {
    console.log(`[tools/[slug]] Dynamic render for: ${slug}`);
  }

  // Handle external tools
  if (tool.external) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.name}</h1>
            <p className="text-gray-400 mb-6">{tool.description}</p>
            <a
              href={tool.route}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              View on GitHub
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // For active internal tools, render the appropriate component
  // These pages handle their own rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="inline-flex items text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Tools Hub
        </Link>

        {/* Tool header */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {tool.name}
            </h1>
            <span className="px-3 py-1 text-sm font-medium bg-green-900 text-green-300 rounded-full">
              {isDynamic ? "Dynamic" : "Static"}
            </span>
          </div>
          <p className="text-gray-400 mb-6">{tool.description}</p>
          <a
            href={tool.route}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Open {tool.name}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Info for dynamic renders */}
        {isDynamic && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-8">
            <p className="text-yellow-300 text-sm">
              <strong>Note:</strong> This tool is not in the top-{TOP_N_COUNT} pre-built tools.
              It is being rendered dynamically. Pre-built tools load faster and are better for SEO.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
