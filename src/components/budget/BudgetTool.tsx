"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BudgetData,
  IncomeItem,
  DebtItem,
  BillItem,
  getWeeksInMonth,
  computeMonthlyAmount,
  allocateIncomeToHalves,
  allocateExpensesToHalves,
  type IncomeFrequency,
} from "./types";
import IncomeSection from "./IncomeSection";
import DebtSection from "./DebtSection";
import BillsSection from "./BillsSection";
import SummaryCards from "./SummaryCards";
import {
  Download,
  Upload,
  FileText,
  Table,
  FilePieChart,
  Settings2,
} from "lucide-react";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  downloadTemplate,
  importFromCSV,
} from "./utils/export";

const STORAGE_KEY = "gitchpage-budget-data";

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

const DEFAULT_BUDGET: BudgetData = {
  month: currentMonth(),
  incomes: [],
  debts: [],
  bills: [],
  customDebtCategories: [],
  customBillCategories: [],
};

export default function BudgetTool() {
  // 1. Initialize with default — NO localStorage read during SSR
  const [budget, setBudget] = useState<BudgetData>(DEFAULT_BUDGET);
  const [hydrated, setHydrated] = useState(false);
  const [showDataMenu, setShowDataMenu] = useState(false);

  // 2. Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BudgetData;
        // Backward compat — ensure all fields exist
        if (!parsed.month) parsed.month = currentMonth();
        if (!parsed.incomes) parsed.incomes = [];
        if (!parsed.debts) parsed.debts = [];
        if (!parsed.bills) parsed.bills = [];
        if (!parsed.customDebtCategories) parsed.customDebtCategories = [];
        if (!parsed.customBillCategories) parsed.customBillCategories = [];
        // Normalize old income items that lack amounts/frequency/payDate
        const weeks = getWeeksInMonth(
          parseInt(parsed.month.split("-")[0], 10),
          parseInt(parsed.month.split("-")[1], 10),
        );
        parsed.incomes = parsed.incomes.map((inc) => {
          const raw = inc as unknown as Record<string, unknown>;
          const amounts = (raw.amounts as number[]) ?? [
            (raw.monthlyAmount as number) || 0,
          ];
          const frequency = (inc.frequency as IncomeFrequency) || "monthly";
          return {
            ...inc,
            frequency,
            amounts,
            monthlyAmount: computeMonthlyAmount(frequency, amounts, weeks),
            payDate: (raw.payDate as number | null) ?? null,
          } as IncomeItem;
        });
        // Normalize debts (add dueBy if missing)
        parsed.debts = parsed.debts.map((d) => ({
          ...d,
          dueBy: d.dueBy ?? null,
          availableCredit:
            ((d as unknown as Record<string, unknown>).availableCredit as
              | number
              | null) ?? null,
          paid: (d as unknown as Record<string, unknown>).paid === true,
        }));
        // Normalize bills (add dueBy, paid, remove old fields if present)
        parsed.bills = parsed.bills.map((b) => {
          const raw = b as unknown as Record<string, unknown>;
          return {
            id: b.id,
            name: b.name,
            category: b.category || "",
            monthlyAmount: b.monthlyAmount || 0,
            dueBy: (raw.dueBy as number | null) ?? null,
            paid: raw.paid === true,
          } as BillItem;
        });
        setBudget(parsed);
      }
    } catch {
      // Corrupted data — stick with defaults
    }
    setHydrated(true);
  }, []);

  // 3. Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  }, [budget, hydrated]);

  // Derived values
  const [year, monthNum] = useMemo(() => {
    const parts = budget.month.split("-");
    return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
  }, [budget.month]);

  const weeksInMonth = useMemo(
    () => getWeeksInMonth(year, monthNum),
    [year, monthNum],
  );

  // Recalculate income monthlyAmounts when month changes
  const recalcIncomes = useCallback(
    (incomes: IncomeItem[], weeks: number): IncomeItem[] =>
      incomes.map((inc) => ({
        ...inc,
        monthlyAmount: computeMonthlyAmount(
          inc.frequency,
          inc.amounts ?? [0],
          weeks,
        ),
      })),
    [],
  );

  const handleMonthChange = (newMonth: string) => {
    const parts = newMonth.split("-");
    const newYear = parseInt(parts[0], 10);
    const newMonthNum = parseInt(parts[1], 10);
    const newWeeks = getWeeksInMonth(newYear, newMonthNum);
    setBudget((prev) => ({
      ...prev,
      month: newMonth,
      incomes: recalcIncomes(prev.incomes, newWeeks),
    }));
  };

  const handleIncomesChange = (incomes: IncomeItem[]) => {
    setBudget((prev) => ({ ...prev, incomes }));
  };

  const handleDebtsChange = (debts: DebtItem[]) => {
    setBudget((prev) => ({ ...prev, debts }));
  };

  const handleBillsChange = (bills: BillItem[]) => {
    setBudget((prev) => ({ ...prev, bills }));
  };

  const handleAddDebtCategory = (cat: string) => {
    setBudget((prev) => ({
      ...prev,
      customDebtCategories: prev.customDebtCategories.includes(cat)
        ? prev.customDebtCategories
        : [...prev.customDebtCategories, cat],
    }));
  };

  const handleAddBillCategory = (cat: string) => {
    setBudget((prev) => ({
      ...prev,
      customBillCategories: prev.customBillCategories.includes(cat)
        ? prev.customBillCategories
        : [...prev.customBillCategories, cat],
    }));
  };

  // Summary calculations
  const totalIncome = budget.incomes.reduce(
    (sum, i) => sum + i.monthlyAmount,
    0,
  );
  const totalBills = budget.bills.reduce((sum, b) => sum + b.monthlyAmount, 0);
  const totalDebtPayments = budget.debts.reduce(
    (sum, d) => sum + d.monthlyAmount,
    0,
  );
  const totalDebtBalance = budget.debts.reduce(
    (sum, d) => sum + (d.balance ?? 0),
    0,
  );

  // Half-month allocation
  const incomeHalves = useMemo(
    () => allocateIncomeToHalves(budget.incomes),
    [budget.incomes],
  );
  const billHalves = useMemo(
    () => allocateExpensesToHalves(budget.bills),
    [budget.bills],
  );
  const debtHalves = useMemo(
    () => allocateExpensesToHalves(budget.debts),
    [budget.debts],
  );

  const firstHalf = {
    income: incomeHalves.firstHalf,
    bills: billHalves.firstHalf,
    debts: debtHalves.firstHalf,
  };
  const secondHalf = {
    income: incomeHalves.secondHalf,
    bills: billHalves.secondHalf,
    debts: debtHalves.secondHalf,
  };

  // Month selector helpers
  const monthLabel = new Date(year, monthNum - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Don't render until hydrated to prevent flicker
  if (!hydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-800/50 rounded-xl" />
        <div className="h-48 bg-gray-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            const d = new Date(year, monthNum - 2, 1);
            handleMonthChange(d.toISOString().slice(0, 7));
          }}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
        >
          ← Prev
        </button>
        <div className="text-lg font-semibold text-white">{monthLabel}</div>
        <button
          onClick={() => {
            const d = new Date(year, monthNum, 1);
            handleMonthChange(d.toISOString().slice(0, 7));
          }}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
        >
          Next →
        </button>

        <div className="flex-1" />

        <div className="relative">
          <button
            onClick={() => setShowDataMenu(!showDataMenu)}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
          >
            <Settings2 className="w-4 h-4" />
            Manage Data
          </button>

          {showDataMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-1 divide-y divide-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportToCSV(budget);
                      setShowDataMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    Export CSV
                  </button>
                  <button
                    onClick={async () => {
                      await exportToExcel(budget);
                      setShowDataMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  >
                    <Table className="w-4 h-4 text-green-400" />
                    Export Excel
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(budget);
                      setShowDataMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  >
                    <FilePieChart className="w-4 h-4 text-red-400" />
                    Export PDF
                  </button>
                </div>
                <div className="py-1">
                  <label className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition cursor-pointer">
                    <Upload className="w-4 h-4 text-orange-400" />
                    Import CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          importFromCSV(file, (imported) => {
                            setBudget((prev) => ({
                              ...prev,
                              ...imported,
                            }));
                            setShowDataMenu(false);
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => {
                      downloadTemplate();
                      setShowDataMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="text-xs text-gray-500 ml-2">
          ({weeksInMonth} weeks)
        </span>
      </div>

      {/* Summary */}
      <SummaryCards
        totalIncome={totalIncome}
        totalBills={totalBills}
        totalDebtPayments={totalDebtPayments}
        totalDebtBalance={totalDebtBalance}
        firstHalf={firstHalf}
        secondHalf={secondHalf}
      />

      {/* Sections */}
      <IncomeSection
        incomes={budget.incomes}
        weeksInMonth={weeksInMonth}
        onChange={handleIncomesChange}
      />

      <DebtSection
        debts={budget.debts}
        categories={budget.customDebtCategories}
        onChange={handleDebtsChange}
        onAddCategory={handleAddDebtCategory}
      />

      <BillsSection
        bills={budget.bills}
        categories={budget.customBillCategories}
        onChange={handleBillsChange}
        onAddCategory={handleAddBillCategory}
      />
    </div>
  );
}
