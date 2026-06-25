import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Gitchegumi Media",
  description:
    "Financial tools, trading utilities, and mini-apps built by Gitchegumi. DebtPipe, SpendPipe, AccountPipe, TrakPipe, QuantPipe.",
};

type ToolDef = {
  name: string;
  description: string;
  href: string;
  status: "active" | "coming_soon";
  external?: boolean;
};

const finpipeTools: ToolDef[] = [
  {
    name: "DebtPipe",
    description:
      "Debt snowball calculator with PDF exports. Track and eliminate your debt with a proven strategy.",
    href: "/debtpipe",
    status: "active",
  },
  {
    name: "SpendPipe",
    description:
      "Monthly budgeting — track income, expenses, and cash flow. Includes template download and Excel import.",
    href: "/budget",
    status: "active",
  },
  {
    name: "AccountPipe",
    description:
      "Manage all your accounts in one place — checking, savings, credit cards, investments. Integrates with DebtPipe and SpendPipe.",
    href: "/accountpipe",
    status: "active",
  },
  {
    name: "TrakPipe",
    description:
      "Transaction ledger for tracking all your financial movements across accounts. Import, categorize, and reconcile with ease.",
    href: "/trakpipe",
    status: "active",
  },
];

const tradingTools: ToolDef[] = [
  {
    name: "QuantPipe",
    description:
      "Institutional-grade backtesting and strategy development for forex and CFD traders. Powered by VectorBT and DuckDB.",
    href: "https://github.com/Gitchegumi/quantpipe",
    status: "coming_soon",
    external: true,
  },
];

function StatusBadge({ status }: { status: ToolDef["status"] }) {
  if (status === "active") {
    return (
      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(175,224,206,0.14)", color: "#afe0ce", border: "1px solid rgba(175,224,206,0.25)", whiteSpace: "nowrap" }}>
        Active
      </span>
    );
  }
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(252,163,17,0.12)", color: "#fca311", border: "1px solid rgba(252,163,17,0.22)", whiteSpace: "nowrap" }}>
      Coming Soon
    </span>
  );
}

function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "24px 26px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px", gap: "10px" }}>
        <h3 style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#f0f0f0", margin: 0 }}>{tool.name}</h3>
        <StatusBadge status={tool.status} />
      </div>
      <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.9rem", lineHeight: 1.62, color: "#9aa3a6", flexGrow: 1, margin: "0 0 18px" }}>{tool.description}</p>

      {tool.status === "active" ? (
        <Link
          href={tool.href}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#fca311", textDecoration: "none" }}
        >
          Try it now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      ) : tool.external ? (
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#4166f5", textDecoration: "none" }}
        >
          View on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ) : (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Oswald, sans-serif", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          Coming soon
        </span>
      )}
    </div>
  );
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: "8px",
        fontFamily: "Oswald, sans-serif",
        fontWeight: 700,
        fontSize: "0.65rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        background: color,
        color: "#0a0a0a",
        marginRight: "14px",
        flexShrink: 0,
      }}
    >
      {text}
    </span>
  );
}

export default function ToolsPage() {
  return (
    <div style={{ background: "radial-gradient(120% 140% at 0% 0%, rgba(65,102,245,0.08), transparent 40%), radial-gradient(100% 120% at 100% 100%, rgba(252,163,17,0.06), transparent 40%), #0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2.5rem 3rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0f0f0", opacity: 0.45, marginBottom: "18px" }}>
            Build · Tools Hub
          </div>
          <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05, color: "#f0f0f0", margin: "0 0 14px" }}>
            Tools
          </h1>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "1rem", lineHeight: 1.6, color: "#9aa3a6", margin: 0, maxWidth: "36rem" }}>
            A collection of mini-apps and utilities — built to solve real problems I run into.
          </p>
        </div>

        {/* FinPipe Section */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
            <SectionLabel text="FinPipe" color="#afe0ce" />
            <span style={{ fontFamily: "'Roboto Serif', serif", fontSize: "1.1rem", color: "#9aa3a6" }}>Financial Tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {finpipeTools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </section>

        {/* Trading Tools Section */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
            <SectionLabel text="Quant" color="#4166f5" />
            <span style={{ fontFamily: "'Roboto Serif', serif", fontSize: "1.1rem", color: "#9aa3a6" }}>Trading Tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tradingTools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
