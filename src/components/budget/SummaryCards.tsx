"use client";

interface HalfMonth {
  income: number;
  bills: number;
  debts: number;
}

interface Props {
  totalIncome: number;
  totalBills: number;
  totalDebtPayments: number;
  totalDebtBalance: number;
  firstHalf: HalfMonth;
  secondHalf: HalfMonth;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SummaryCards({
  totalIncome,
  totalBills,
  totalDebtPayments,
  totalDebtBalance,
  firstHalf,
  secondHalf,
}: Props) {
  const expendable = totalIncome - totalBills - totalDebtPayments;
  const firstExpendable = firstHalf.income - firstHalf.bills - firstHalf.debts;
  const secondExpendable =
    secondHalf.income - secondHalf.bills - secondHalf.debts;

  const cards = [
    {
      label: "Total Income",
      monthly: totalIncome,
      first: firstHalf.income,
      second: secondHalf.income,
      color: "text-green-400",
      border: "border-green-500/30",
    },
    {
      label: "Total Bills",
      monthly: totalBills,
      first: firstHalf.bills,
      second: secondHalf.bills,
      color: "text-orange-400",
      border: "border-orange-500/30",
    },
    {
      label: "Debt Payments",
      monthly: totalDebtPayments,
      first: firstHalf.debts,
      second: secondHalf.debts,
      color: "text-red-400",
      border: "border-red-500/30",
    },
    {
      label: "Expendable",
      monthly: expendable,
      first: firstExpendable,
      second: secondExpendable,
      color: expendable >= 0 ? "text-emerald-400" : "text-red-400",
      border: expendable >= 0 ? "border-emerald-500/30" : "border-red-500/30",
    },
    {
      label: "Debt Balance",
      monthly: totalDebtBalance,
      first: null,
      second: null,
      color: "text-yellow-400",
      border: "border-yellow-500/30",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Monthly totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border ${card.border}`}
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {card.label}
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>
              ${fmt(card.monthly)}
            </div>
          </div>
        ))}
      </div>

      {/* Half-month breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { label: "1st – 14th", data: firstHalf, exp: firstExpendable },
          {
            label: "15th – End of Month",
            data: secondHalf,
            exp: secondExpendable,
          },
        ].map((half) => (
          <div
            key={half.label}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
          >
            <div className="text-sm font-semibold text-gray-300 mb-3">
              {half.label}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-400">Income</span>
              <span className="text-right text-green-400 font-medium">
                ${fmt(half.data.income)}
              </span>
              <span className="text-gray-400">Bills</span>
              <span className="text-right text-orange-400 font-medium">
                ${fmt(half.data.bills)}
              </span>
              <span className="text-gray-400">Debts</span>
              <span className="text-right text-red-400 font-medium">
                ${fmt(half.data.debts)}
              </span>
              <span className="text-gray-400 font-semibold border-t border-gray-700 pt-1 mt-1">
                Expendable
              </span>
              <span
                className={`text-right font-bold border-t border-gray-700 pt-1 mt-1 ${half.exp >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                ${fmt(half.exp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
