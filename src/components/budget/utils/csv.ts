import { BudgetEntry, IncomeSource, ExpenseCategory } from "./types";

export function exportToCSV(budget: BudgetEntry) {
  const rows: string[] = [];

  // Header
  rows.push(["Budget Entry", budget.date].join(","));

  // Income section
  rows.push([""]);
  rows.push(["Income Streams"]);
  rows.push(["Name", "Monthly Amount", "Frequency", "Category"]);
  budget.incomes.forEach((inc) => {
    rows.push([inc.name, inc.monthlyAmount, inc.frequency, inc.category]);
  });

  // Expense section
  rows.push([""]);
  rows.push(["Expense Categories"]);
  rows.push(["Name", "Budgeted", "Actual", "Color"]);
  budget.expenses.forEach((cat) => {
    rows.push([cat.name, cat.budgeted, cat.actual, cat.color]);
  });

  // Totals
  rows.push([""]);
  rows.push(["Totals"]);
  const totalIncome = budget.incomes.reduce((sum, i) => sum + i.monthlyAmount, 0);
  const totalBudgeted = budget.expenses.reduce((sum, c) => sum + c.budgeted, 0);
  const totalActual = budget.expenses.reduce((sum, c) => sum + c.actual, 0);
  rows.push(["Total Income", totalIncome.toString()]);
  rows.push(["Total Budgeted", totalBudgeted.toString()]);
  rows.push(["Total Actual", totalActual.toString()]);

  const csvContent = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `budget-${budget.date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromCSV(
  file: File
): Promise<BudgetEntry | null> {
  try {
    const text = await file.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    const incomes: IncomeSource[] = [];
    const expenses: ExpenseCategory[] = [];

    let section: "income" | "expense" | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes("Income Streams")) {
        section = "income";
        continue;
      } else if (line.includes("Expense Categories")) {
        section = "expense";
        continue;
      } else if (line.includes("Totals")) {
        break;
      }

      if (section === "income" && line.includes("Name") && line.includes("Monthly Amount")) {
        // Skip header
        continue;
      }
      if (section === "expense" && line.includes("Name") && line.includes("Budgeted")) {
        // Skip header
        continue;
      }

      if (section === "income") {
        const [name, amount, frequency, category] = line.split(",");
        if (name && amount) {
          incomes.push({
            id: crypto.randomUUID(),
            name,
            monthlyAmount: parseFloat(amount),
            frequency: frequency as IncomeSource["frequency"],
            category,
          });
        }
      } else if (section === "expense") {
        const [name, budgeted, actual, color] = line.split(",");
        if (name) {
          expenses.push({
            id: crypto.randomUUID(),
            name,
            budgeted: parseFloat(budgeted) || 0,
            actual: parseFloat(actual) || 0,
            color: color || "#3B82F6",
          });
        }
      }
    }

    const date = new Date().toISOString().slice(0, 7); // current month

    return {
      id: crypto.randomUUID(),
      date,
      incomes,
      expenses,
    };
  } catch (err) {
    console.error("Failed to import CSV:", err);
    return null;
  }
}
