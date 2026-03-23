"use client";

/**
 * LazyToolSection - Client component for lazy-loading non-top-N tools
 *
 * This component wraps next/dynamic to allow ssr: false in a Client Component.
 * It's used for tools that aren't in the top-N pre-generated set.
 */

import dynamic from "next/dynamic";

const LazyToolCard = dynamic(
  () => import("@/components/tools/LazyToolCard"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 bg-gray-700 rounded w-32" />
          <div className="h-5 bg-gray-700 rounded-full w-16" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
        </div>
        <div className="h-5 bg-gray-700 rounded w-24 mt-auto" />
      </div>
    ),
  }
);

interface ToolData {
  name: string;
  description: string;
  href: string;
  status: string;
  external?: boolean;
}

interface LazyToolSectionProps {
  tools: ToolData[];
}

export default function LazyToolSection({ tools }: LazyToolSectionProps) {
  return (
    <>
      {tools.map((tool) => (
        <LazyToolCard key={tool.name} tool={tool} />
      ))}
    </>
  );
}
