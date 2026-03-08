"use client";

import { useMemo } from "react";
import { DebtItem, BillItem } from "./types";

interface Props {
  debts: DebtItem[];
  bills: BillItem[];
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Total Budget Tracker - shows overall budget vs actual spend across all expense categories.
 * Placement: Below SummaryCards, above IncomeSection
 */
export default function TotalBudgetTracker({ debts, bills }: Props) {
  const { totalBudgeted, totalActual, percentage, isOverBudget, hasAnyActual } =
    useMemo(() => {
      // Sum of all budgeted amounts (bills + debt payments)
      const budgeted =
        bills.reduce((sum, b) => sum + b.monthlyAmount, 0) +
        debts.reduce((sum, d) => sum + d.monthlyAmount, 0);

      // Sum of actual amounts (only count items that have an actual value set)
      const actualBills = bills
        .filter((b) => b.actual !== null && b.actual !== undefined)
        .reduce((sum, b) => sum + (b.actual ?? 0), 0);
      const actualDebts = debts
        .filter((d) => d.actual !== null && d.actual !== undefined)
        .reduce((sum, d) => sum + (d.actual ?? 0), 0);
      const actual = actualBills + actualDebts;

      // Calculate percentage (capped at 100 for display, but flag if over)
      const pct = budgeted > 0 ? (actual / budgeted) * 100 : 0;
      const overBudget = actual > budgeted && budgeted > 0;

      // Check if any actual values have been entered
      const hasAny = actualBills > 0 || actualDebts > 0;

      return {
        totalBudgeted: budgeted,
        totalActual: actual,
        percentage: Math.min(pct, 100),
        isOverBudget: overBudget,
        hasAnyActual: hasAny,
      };
    }, [debts, bills]);

  // Don't render if there's no budget data
  if (totalBudgeted === 0) {
    return null;
  }

  // Determine bar color based on utilization
  const getBarColor = () => {
    if (!hasAnyActual) return "bg-gray-600";
    if (isOverBudget || percentage > 100) return "bg-red-500";
    if (percentage > 90) return "bg-orange-500";
    if (percentage > 75) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  // Determine status text
  const getStatusText = () => {
    if (!hasAnyActual) return "No actual spending entered yet";
    if (isOverBudget || percentage > 100)
      return `Over budget by $${fmt(totalActual - totalBudgeted)}`;
    if (percentage === 100) return "Exactly on budget";
    const remaining = totalBudgeted - totalActual;
    return `$${fmt(remaining)} remaining`;
  };

  const remaining = totalBudgeted - totalActual;

  return (
    <div className="bg-gradient-to-r from-gray-800/60 to-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Total Budget Tracker
          </h3>
          <p className="text-sm text-gray-400">
            Bills + Debt Payments vs. Actual Spend
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${fmt(totalActual)}
            <span className="text-lg text-gray-500 font-normal">
              {" "}
              / ${fmt(totalBudgeted)}
            </span>
          </div>
          <div
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Markers at 25%, 50%, 75% */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-gray-600/50"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      {/* Legend / Details */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600" />
          <span className="text-gray-400">Under 75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">75% - 90%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-400">Over 90%</span>
        </div>
      </div>

      {/* Breakdown hint */}
      {hasAnyActual && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-between text-xs text-gray-500">
          <span>
            Bills: $
            {fmt(
              bills.reduce((sum, b) => sum + (b.actual ?? 0), 0),
            )}
          </span>
          <span>
            Debts: $
            {fmt(
              debts.reduce((sum, d) => sum + (d.actual ?? 0), 0),
            )}
          </span>
          <span
            className={isOverBudget ? "text-red-400" : "text-emerald-400"}
          >
            {isOverBudget ? "Over" : "Under"}: ${fmt(Math.abs(remaining))}
          </span>
        </div>
      )}
    </div>
  );
}