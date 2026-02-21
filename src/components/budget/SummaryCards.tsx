"use client";

interface Props {
  totalIncome: number;
  totalBudgeted: number;
  totalActual: number;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SummaryCards({
  totalIncome,
  totalBudgeted,
  totalActual,
  onExport,
  onImport,
}: Props) {
  const savings = totalIncome - totalActual;
  const budgetStatus =
    totalActual <= totalBudgeted ? "text-green-400" : "text-red-400";
  const savingsStatus = savings >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="text-sm text-gray-400">Total Income</div>
        <div className="text-2xl font-bold text-green-400">
          ${totalIncome.toLocaleString()}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="text-sm text-gray-400">Budgeted Expenses</div>
        <div className="text-2xl font-bold text-blue-400">
          ${totalBudgeted.toLocaleString()}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="text-sm text-gray-400">Actual Spending</div>
        <div className={`text-2xl font-bold ${budgetStatus}`}>
          ${totalActual.toLocaleString()}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="text-sm text-gray-400">Net Savings</div>
        <div className={`text-2xl font-bold ${savingsStatus}`}>
          ${savings.toLocaleString()}
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 flex gap-4 flex-wrap">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Export CSV
        </button>
        <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={onImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
