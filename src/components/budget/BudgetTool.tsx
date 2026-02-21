import { useState, useEffect } from "react";
import { IncomeSource, ExpenseCategory, BudgetEntry } from "./types";
import IncomeSection from "./IncomeSection";
import ExpenseSection from "./ExpenseSection";
import SummaryCards from "./SummaryCards";
import { exportToCSV, importFromCSV } from "./utils/csv";

const STORAGE_KEY = "gitchpage-budget-data";
const CURRENT_MONTH = new Date().toISOString().slice(0, 7); // YYYY-MM

function uuidv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function BudgetTool() {
  const [budget, setBudget] = useState<BudgetEntry>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
    return {
      id: uuidv4(),
      date: CURRENT_MONTH,
      incomes: [],
      expenses: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  }, [budget]);

  const addIncome = (income: Omit<IncomeSource, "id">) => {
    setBudget((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: uuidv4() }],
    }));
  };

  const updateIncome = (id: string, updates: Partial<IncomeSource>) => {
    setBudget((prev) => ({
      ...prev,
      incomes: prev.incomes.map((inc) =>
        inc.id === id ? { ...inc, ...updates } : inc
      ),
    }));
  };

  const removeIncome = (id: string) => {
    setBudget((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((inc) => inc.id !== id),
    }));
  };

  const addExpenseCategory = (category: Omit<ExpenseCategory, "id">) => {
    setBudget((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...category, id: uuidv4() }],
    }));
  };

  const updateExpenseCategory = (id: string, updates: Partial<ExpenseCategory>) => {
    setBudget((prev) => ({
      ...prev,
      expenses: prev.expenses.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  };

  const removeExpenseCategory = (id: string) => {
    setBudget((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((cat) => cat.id !== id),
    }));
  };

  const handleExport = () => {
    exportToCSV(budget);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromCSV(file).then((data) => {
        if (data) {
          setBudget(data);
        }
      });
    }
  };

  const totalIncome = budget.incomes.reduce(
    (sum, inc) => sum + inc.monthlyAmount,
    0
  );

  const totalBudgeted = budget.expenses.reduce(
    (sum, cat) => sum + cat.budgeted,
    0
  );

  const totalActual = budget.expenses.reduce(
    (sum, cat) => sum + cat.actual,
    0
  );

  return (
    <div className="space-y-6">
      <SummaryCards
        totalIncome={totalIncome}
        totalBudgeted={totalBudgeted}
        totalActual={totalActual}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeSection
          incomes={budget.incomes}
          onAdd={addIncome}
          onUpdate={updateIncome}
          onRemove={removeIncome}
        />
        <ExpenseSection
          expenses={budget.expenses}
          onAdd={addExpenseCategory}
          onUpdate={updateExpenseCategory}
          onRemove={removeExpenseCategory}
        />
      </div>
    </div>
  );
}
