import Link from "next/link";
import {
  isTopN,
  TOP_N_TOOL_SLUGS,
  TOOLS,
  TOP_N_COUNT,
} from "@/lib/top-n-tools";
import LazyToolSection from "@/components/tools/LazyToolSection";

// ============================================================================
// Tool Definitions (using centralized config)
// ============================================================================

type ToolDef = {
  name: string;
  description: string;
  href: string;
  status: string;
  external?: boolean;
};

// Build tool arrays from centralized config
const finpipeToolsConfig = TOOLS.filter((t) => t.category === "finpipe");
const tradingToolsConfig = TOOLS.filter((t) => t.category === "quant");

const finpipeTools: ToolDef[] = finpipeToolsConfig.map((t) => ({
  name: t.name,
  description: t.description,
  href: t.route,
  status: t.status,
  external: t.external,
}));

const tradingTools: ToolDef[] = tradingToolsConfig.map((t) => ({
  name: t.name,
  description: t.description,
  href: t.route,
  status: t.status,
  external: t.external,
}));

// Split tools into top-N (static) and rest (lazy-loaded)
const finpipeTopN = finpipeTools.filter((t) => isTopN(t.href.replace("/", "")));
const finpipeLazy = finpipeTools.filter((t) => !isTopN(t.href.replace("/", "")));

// ============================================================================
// Static ToolCard (for top-N tools, rendered at build time)
// ============================================================================

function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-semibold text-white">{tool.name}</h3>
        {tool.status === "active" ? (
          <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full whitespace-nowrap ml-2">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-300 rounded-full whitespace-nowrap ml-2">
            Coming Soon
          </span>
        )}
      </div>
      <p className="text-gray-400 mb-4 flex-grow">{tool.description}</p>
      {tool.status === "active" ? (
        <Link
          href={tool.href}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-auto"
        >
          Try it now
          <svg
            className="ml-1 w-4 h-4"
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
        </Link>
      ) : tool.external ? (
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-auto"
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          View on GitHub
          <svg
            className="ml-1 w-4 h-4"
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
      ) : (
        <span className="inline-flex items-center text-gray-500 mt-auto">
          <svg
            className="mr-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Coming soon
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Tool Section Component
// ============================================================================

interface ToolSectionProps {
  title: string;
  badge: string;
  badgeColor: string;
  staticTools?: ToolDef[];
  lazyTools?: ToolDef[];
}

function ToolSection({
  title,
  badge,
  badgeColor,
  staticTools = [],
  lazyTools = [],
}: ToolSectionProps) {
  const hasTools = staticTools.length > 0 || lazyTools.length > 0;
  if (!hasTools) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span
          className={`${badgeColor} text-gray-900 px-3 py-1 rounded-lg mr-3 text-sm font-bold`}
        >
          {badge}
        </span>
        <span className="text-gray-400 text-lg font-normal">{title}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Static ToolCards - pre-rendered at build time */}
        {staticTools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
        {/* Lazy-loaded tools - loaded on client via LazyToolSection */}
        {lazyTools.length > 0 && <LazyToolSection tools={lazyTools} />}
      </div>
    </section>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Tools Hub
        </h1>
        <p className="text-gray-400 mb-2">
          A collection of mini-apps and utilities to help with your workflow.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Top {TOP_N_COUNT} tools pre-loaded:{" "}
          {TOP_N_TOOL_SLUGS.join(", ")}
        </p>

        {/* FinPipe Section */}
        <ToolSection
          title="Financial Tools"
          badge="FinPipe"
          badgeColor="bg-gradient-to-r from-green-400 to-emerald-500"
          staticTools={finpipeTopN}
          lazyTools={finpipeLazy}
        />

        {/* Trading Tools Section - all lazy-loaded */}
        <ToolSection
          title="Trading Tools"
          badge="Quant"
          badgeColor="bg-gradient-to-r from-blue-500 to-cyan-400"
          lazyTools={tradingTools}
        />
      </div>
    </div>
  );
}
