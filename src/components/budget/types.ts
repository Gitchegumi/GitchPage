export interface IncomeSource {
  id: string;
  name: string;
  monthlyAmount: number;
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'irregular';
  category: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  color: string;
  subcategories?: ExpenseSubcategory[];
}

export interface ExpenseSubcategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
}

export interface BudgetEntry {
  id: string;
  date: string; // YYYY-MM
  incomes: IncomeSource[];
  expenses: ExpenseCategory[];
  notes?: string;
}

export type Frequency = IncomeSource['frequency'];
