export type IncomeFrequency =
  | "monthly"
  | "biweekly"
  | "1st-and-15th"
  | "weekly";

export interface IncomeItem {
  id: string;
  name: string;
  frequency: IncomeFrequency;
  /** For "1st-and-15th": [1st paycheck, 15th paycheck]. For others: [per-paycheck amount]. */
  amounts: number[];
  /** Computed from amounts + frequency + selected month */
  monthlyAmount: number;
  /** Day of month the paycheck arrives (1-31). Used for monthly frequency to allocate to correct half. */
  payDate: number | null;
}

export interface DebtItem {
  id: string;
  name: string;
  category: string;
  monthlyAmount: number;
  balance: number | null;
  /** Day of month payment is due (1-31) */
  dueBy: number | null;
  /** Credit limit (only for Credit Card category) */
  availableCredit: number | null;
  /** Whether this payment has been made this month */
  paid: boolean;
}

export interface BillItem {
  id: string;
  name: string;
  category: string;
  monthlyAmount: number;
  /** Day of month bill is due (1-31) */
  dueBy: number | null;
  /** Whether this bill has been paid this month */
  paid: boolean;
}

export interface BudgetData {
  month: string; // "YYYY-MM"
  incomes: IncomeItem[];
  debts: DebtItem[];
  bills: BillItem[];
  customDebtCategories: string[];
  customBillCategories: string[];
}

// --- Default categories ---
export const DEFAULT_DEBT_CATEGORIES = ["Credit Card", "Loan"];
export const DEFAULT_BILL_CATEGORIES = [
  "Utilities",
  "Subscriptions",
  "Insurance",
  "Phone",
  "Internet",
  "Rent/Mortgage",
  "Groceries",
  "Transportation",
  "Childcare",
  "Medical",
  "Other",
];

// --- Helpers ---

/** Get the number of days in a given month (1-indexed month). */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Approximate weeks in the given month (days / 7, rounded to 2 decimals). */
export function getWeeksInMonth(year: number, month: number): number {
  return Math.round((getDaysInMonth(year, month) / 7) * 100) / 100;
}

/** Compute the monthly amount from the per-check amounts and frequency. */
export function computeMonthlyAmount(
  frequency: IncomeFrequency,
  amounts: number[],
  weeksInMonth: number,
): number {
  switch (frequency) {
    case "monthly":
      return amounts[0] || 0;
    case "biweekly":
      return (amounts[0] || 0) * (weeksInMonth / 2);
    case "1st-and-15th":
      return (amounts[0] || 0) + (amounts[1] || 0);
    case "weekly":
      return (amounts[0] || 0) * weeksInMonth;
    default:
      return amounts[0] || 0;
  }
}

/** Number of pay periods per month for a given frequency. */
export function getPeriodsPerMonth(
  frequency: IncomeFrequency,
  weeksInMonth: number,
): number {
  switch (frequency) {
    case "monthly":
      return 1;
    case "biweekly":
      return weeksInMonth / 2;
    case "1st-and-15th":
      return 2;
    case "weekly":
      return weeksInMonth;
    default:
      return 1;
  }
}

export const FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  monthly: "Monthly",
  biweekly: "Bi-Weekly",
  "1st-and-15th": "1st & 15th",
  weekly: "Weekly",
};

// --- Half-month allocation helpers ---

/** Returns true if a day falls in the 1st–14th half of the month. */
export function isFirstHalf(day: number): boolean {
  return day >= 1 && day <= 14;
}

/**
 * Allocate income to half-month buckets.
 * - monthly: placed in whichever half payDate falls in
 * - 1st-and-15th: amounts[0] → 1st half, amounts[1] → 2nd half
 * - biweekly/weekly: split evenly
 */
export function allocateIncomeToHalves(incomes: IncomeItem[]): {
  firstHalf: number;
  secondHalf: number;
} {
  let firstHalf = 0;
  let secondHalf = 0;

  for (const inc of incomes) {
    switch (inc.frequency) {
      case "monthly": {
        const inFirst = inc.payDate ? isFirstHalf(inc.payDate) : true;
        if (inFirst) firstHalf += inc.monthlyAmount;
        else secondHalf += inc.monthlyAmount;
        break;
      }
      case "1st-and-15th": {
        const amounts = inc.amounts ?? [0, 0];
        firstHalf += amounts[0] || 0;
        secondHalf += amounts[1] || 0;
        break;
      }
      default: {
        // biweekly, weekly — split evenly
        firstHalf += inc.monthlyAmount / 2;
        secondHalf += inc.monthlyAmount / 2;
        break;
      }
    }
  }
  return { firstHalf, secondHalf };
}

/** Allocate expense items to half-month buckets based on dueBy day. */
export function allocateExpensesToHalves(
  items: { monthlyAmount: number; dueBy: number | null }[],
): { firstHalf: number; secondHalf: number } {
  let firstHalf = 0;
  let secondHalf = 0;

  for (const item of items) {
    const inFirst = item.dueBy ? isFirstHalf(item.dueBy) : true;
    if (inFirst) firstHalf += item.monthlyAmount;
    else secondHalf += item.monthlyAmount;
  }
  return { firstHalf, secondHalf };
}
