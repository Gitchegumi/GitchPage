import { BudgetEntry, IncomeSource, ExpenseCategory } from "./types";
import * as XLSX from "xlsx";

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

export function downloadTemplate() {
  // Create a minimal template with headers only
  const rows: string[] = [];
  rows.push(["Budget Entry", new Date().toISOString().slice(0, 7)].join(","));
  rows.push([""]);
  rows.push(["Income Streams"]);
  rows.push(["Name", "Monthly Amount", "Frequency", "Category"]);
  rows.push(["Salary", "5000", "monthly", "Employment"]);
  rows.push([""]);
  rows.push(["Expense Categories"]);
  rows.push(["Name", "Budgeted", "Actual", "Color"]);
  rows.push(["Rent", "1500", "1500", "#EF4444"]);
  rows.push([""]);
  rows.push(["Totals"]);
  rows.push(["Total Income", ""]);
  rows.push(["Total Budgeted", ""]);
  rows.push(["Total Actual", ""]);

  const csvContent = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "budget-template.csv";
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
            frequency: (frequency as IncomeSource["frequency"]) || "monthly",
            category: category || "",
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

export async function importFromExcel(
  file: File
): Promise<BudgetEntry | null> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];

    // Expecting a layout similar to CSV: 
    // Row 0: ["Budget Entry", "YYYY-MM"]
    // Row 1: [""]
    // Row 2: ["Income Streams"]
    // Row 3: ["Name", "Monthly Amount", "Frequency", "Category"]
    // Then data rows for incomes
    // Then blank, then ["Expense Categories"]
    // Then header ["Name","Budgeted","Actual","Color"]
    // Then expense rows
    // Then blank, then ["Totals"], etc.

    const incomes: IncomeSource[] = [];
    const expenses: ExpenseCategory[] = [];
    let section: "income" | "expense" | null = null;
    let date = new Date().toISOString().slice(0, 7);

    // Optional: parse date from row 0 if present
    if (data.length > 0 && data[0][0] === "Budget Entry" && data[0][1]) {
      date = String(data[0][1]).trim();
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      const firstCell = String(row[0]).trim();

      if (firstCell === "Income Streams") {
        section = "income";
        continue;
      } else if (firstCell === "Expense Categories") {
        section = "expense";
        continue;
      } else if (firstCell === "Totals") {
        break;
      }

      // Check for header rows in each section
      if (section === "income") {
        if (firstCell === "Name" && row.includes("Monthly Amount")) continue;
        if (row.length >= 4) {
          const [name, amount, frequency, category] = row.map((c) => String(c).trim());
          if (name && amount) {
            incomes.push({
              id: crypto.randomUUID(),
              name,
              monthlyAmount: parseFloat(amount) || 0,
              frequency: (frequency as IncomeSource["frequency"]) || "monthly",
              category: category || "",
            });
          }
        }
      } else if (section === "expense") {
        if (firstCell === "Name" && row.includes("Budgeted")) continue;
        if (row.length >= 4) {
          const [name, budgeted, actual, color] = row.map((c) => String(c).trim());
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
    }

    return {
      id: crypto.randomUUID(),
      date,
      incomes,
      expenses,
    };
  } catch (err) {
    console.error("Failed to import Excel:", err);
    return null;
  }
}
