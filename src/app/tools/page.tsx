import Link from "next/link";

const tools = [
  {
    name: "DebtPipe",
    description: "Debt snowball calculator with PDF exports. Track and eliminate your debt with a proven strategy.",
    href: "/debtpipe",
    status: "active",
  },
  {
    name: "Budget Tool",
    description: "Monthly budgeting - track income, expenses, and cash flow. Includes template download and Excel import.",
    href: "/budget",
    status: "active",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Tools Hub
        </h1>
        <p className="text-gray-400 mb-8">
          A collection of mini-apps and utilities to help with your workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-semibold text-white">{tool.name}</h2>
                {tool.status === "active" ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-300 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-gray-400 mb-4">{tool.description}</p>
              {tool.status === "active" ? (
                <Link
                  href={tool.href}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
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
              ) : (
                <span className="inline-flex items-center text-gray-500">
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
          ))}
        </div>
      </div>
    </div>
  );
}