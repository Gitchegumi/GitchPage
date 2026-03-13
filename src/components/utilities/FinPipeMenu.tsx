import Link from "next/link";
import { Building2, CreditCard, Wallet } from "lucide-react";

interface FinPipeMenuProps {
  current: "accountpipe" | "debtpipe" | "spendpipe";
}

export function FinPipeMenu({ current }: FinPipeMenuProps) {
  const tools = [
    {
      id: "accountpipe",
      name: "AccountPipe",
      href: "/accountpipe",
      icon: Building2,
      description: "Manage Ledger",
    },
    {
      id: "spendpipe",
      name: "SpendPipe",
      href: "/budget",
      icon: Wallet,
      description: "Budget Tracker",
    },
    {
      id: "debtpipe",
      name: "DebtPipe",
      href: "/debtpipe",
      icon: CreditCard,
      description: "Payoff Simulator",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm border border-gray-700/50 w-fit">
      {tools.map((tool) => {
        const isActive = current === tool.id;
        const Icon = tool.icon;
        
        return (
          <Link
            key={tool.id}
            href={tool.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tool.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
