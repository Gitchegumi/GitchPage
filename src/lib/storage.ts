/**
 * Shared client-side storage layer for GitchPage finance tools.
 *
 * This module provides a unified storage interface for:
 * - DebtPipe (debts)
 * - SpendPipe/Budget (income, bills, expenses)
 * - AccountPipe (accounts: checking, savings, credit cards, etc.)
 *
 * All data stays client-side in localStorage.
 * Designed for future migration to RxDB for better schema validation and cross-tab sync.
 */

import type { BudgetData } from "@/components/budget/types";
import { DEFAULT_BILL_CATEGORIES } from "@/components/budget/types";

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  ACCOUNTS: "gitchpage-accounts",
  BUDGET: "gitchpage-budget-data",
  DEBTS: "gitchpage-debts", // Legacy DebtPipe storage
  TRANSACTIONS: "gitchpage-transactions",
} as const;

// ============================================================================
// Account Types (Hierarchical)
// ============================================================================

export type AccountMainCategory = 'cash' | 'debt' | 'bill' | 'investment' | 'other';

export type CashSubtype = 'checking' | 'savings' | 'cash_wallet';
export type DebtSubtype = 'credit_card' | 'loan';
export type BillSubtype = typeof DEFAULT_BILL_CATEGORIES[number];
export type InvestmentSubtype = 'stock' | 'crypto' | 'retirement' | 'other_investment';

export type AccountSubtype = CashSubtype | DebtSubtype | BillSubtype | InvestmentSubtype | string;

// Legacy type (for migration)
export type LegacyAccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';

export interface Account {
  id: string;
  name: string;
  mainCategory: AccountMainCategory;
  subtype: AccountSubtype;
  /** Starting balance - static value when account was created/opened */
  startingBalance: number;
  /** Current computed balance = startingBalance + sum(transactions). Not stored, computed on demand. */
  _balance?: number; // Deprecated: for migration only, remove after migration

  // Credit card specific (when mainCategory === 'debt' && subtype === 'credit_card')
  creditLimit?: number;
  apr?: number;
  annualFee?: number;
  rewardsType?: string;

  // Loan specific (when mainCategory === 'debt' && subtype === 'loan')
  loanType?: 'personal' | 'student' | 'auto' | 'mortgage' | 'other';
  originalAmount?: number;
  currentBalance?: number; // could mirror balance
  interestRate?: number;
  termMonths?: number;
  startDate?: number;
  paymentFrequency?: 'monthly' | 'biweekly' | 'weekly';
  firstPaymentDate?: number;
  servicer?: string;

  // Bill specific (when mainCategory === 'bill')
  monthlyAmount?: number;
  dueDate?: number; // day of month 1-31
  isActive?: boolean;

  // Shared optional fields
  institution?: string;
  mask?: string;
  color?: string;
  hidden: boolean;
  showsInBudget: boolean; // whether this account appears in budget calculations (cash & debt)

  // Metadata
  createdAt: number;
  updatedAt: number;
}

// Backward compatibility: map legacy type to mainCategory/subtype
function migrateLegacyAccount(legacy: any): Account {
  const base: any = {
    id: String(legacy.id), // Ensure ID is a string for JSON serialization
    name: legacy.name,
    startingBalance: legacy.balance ?? 0, // Use balance as startingBalance
    institution: legacy.institution,
    mask: legacy.mask,
    color: legacy.color,
    hidden: legacy.hidden ?? false,
    showsInBudget: true, // legacy accounts were in budget by default
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt,
  };

  // Migrate legacy type
  const legacyType = legacy.type as LegacyAccountType | undefined;
  switch (legacyType) {
    case 'checking':
    case 'savings':
    case 'cash':
      base.mainCategory = 'cash';
      base.subtype = legacyType as CashSubtype;
      break;
    case 'credit':
      base.mainCategory = 'debt';
      base.subtype = 'credit_card';
      base.creditLimit = legacy.limit ?? undefined;
      break;
    case 'investment':
      base.mainCategory = 'investment';
      base.subtype = 'investment' as InvestmentSubtype;
      break;
    case 'other':
      base.mainCategory = 'other';
      base.subtype = 'other';
      break;
    default:
      // Fallback: treat as other
      base.mainCategory = 'other';
      base.subtype = 'other';
  }

  return base as Account;
}

export interface AccountsData {
  accounts: Account[];
  /** Schema version for future migrations */
  version: number;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_ACCOUNTS_DATA: AccountsData = {
  accounts: [],
  version: 4, // bumped after adding startingBalance and computed balances
};

// Main category labels and colors
export const MAIN_CATEGORY_LABELS: Record<AccountMainCategory, string> = {
  cash: "Cash",
  debt: "Debt",
  bill: "Bill",
  investment: "Investment",
  other: "Other",
};

export const MAIN_CATEGORY_COLORS: Record<AccountMainCategory, string> = {
  cash: "#F59E0B",       // amber
  debt: "#EF4444",       // red
  bill: "#3B82F6",       // blue
  investment: "#8B5CF6", // purple
  other: "#6B7280",      // gray
};

// Cash sub-labels
export const CASH_SUBTYPE_LABELS: Record<CashSubtype, string> = {
  checking: "Checking",
  savings: "Savings",
  cash_wallet: "Cash Wallet",
};

// Debt sub-labels
export const DEBT_SUBTYPE_LABELS: Record<DebtSubtype, string> = {
  credit_card: "Credit Card",
  loan: "Loan",
};

// Bill sub-labels (just use the category name itself)
export function getBillSubtypeLabel(category: BillSubtype): string {
  return category;
}

// ============================================================================
// Storage Functions
// ============================================================================

/** Generate a unique ID for new accounts */
export function generateAccountId(): string {
  return `acc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Load accounts from localStorage with migration */
export function loadAccounts(): AccountsData {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNTS_DATA;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (saved) {
      const parsed = JSON.parse(saved) as AccountsData;
      // Ensure version field exists
      if (!parsed.version || parsed.version < 4) {
        // Migrate legacy accounts to hierarchical schema + startingBalance
        parsed.accounts = parsed.accounts.map((acc: any) => {
          // If already has mainCategory, skip hierarchy migration but check startingBalance
          if (acc.mainCategory) {
            // Ensure showsInBudget exists for older v2/v3 accounts
            if (acc.showsInBudget === undefined) {
              acc.showsInBudget = true;
            }
            // Migrate balance to startingBalance if startingBalance missing
            if (acc.startingBalance === undefined) {
              acc.startingBalance = acc.balance ?? 0;
              // Remove balance field entirely
              delete acc.balance;
            }
            // Handle deprecated _balance field
            if (acc._balance !== undefined) {
              delete acc._balance;
            }
            return acc;
          }
          const migrated = migrateLegacyAccount(acc);
          // ensure showsInBudget exists (migrateLegacyAccount sets it to true)
          return migrated;
        });
        parsed.version = 4;
        // Save migrated data
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(parsed));
      }
      // Ensure all account IDs are strings (defensive: coerce numeric IDs from old data)
      parsed.accounts = parsed.accounts.map((acc: any) => ({
        ...acc,
        id: String(acc.id),
      }));
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load accounts:", error);
  }

  return DEFAULT_ACCOUNTS_DATA;
}

/** Save accounts to localStorage */
export function saveAccounts(data: AccountsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save accounts:", error);
  }
}

/** Add a new account */
export function addAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account {
  const data = loadAccounts();
  const now = Date.now();

  // Backwards compatibility: if balance is provided but not startingBalance, use balance as startingBalance
  const startingBalance = account.startingBalance !== undefined ? account.startingBalance : (account as any).balance ?? 0;

  const newAccount: Account = {
    ...account,
    startingBalance,
    id: generateAccountId(),
    createdAt: now,
    updatedAt: now,
    hidden: account.hidden ?? false,
  };

  data.accounts.push(newAccount);
  saveAccounts(data);

  return newAccount;
}

/** Update an existing account */
export function updateAccount(id: string, updates: Partial<Account>): Account | null {
  const data = loadAccounts();
  const index = data.accounts.findIndex((a) => a.id === id);

  if (index === -1) return null;

  data.accounts[index] = {
    ...data.accounts[index],
    ...updates,
    updatedAt: Date.now(),
  };

  saveAccounts(data);
  return data.accounts[index];
}

/** Delete an account */
export function deleteAccount(id: string): boolean {
  const data = loadAccounts();
  const initialLength = data.accounts.length;

  data.accounts = data.accounts.filter((a) => a.id !== id);

  if (data.accounts.length === initialLength) return false;

  saveAccounts(data);
  return true;
}

/** Get total balance across all non-hidden accounts */
export function getTotalBalance(includeCredit = false): number {
  const data = loadAccounts();

  return data.accounts
    .filter((a) => !a.hidden)
    .reduce((total, account) => {
      const currentBal = getAccountCurrentBalance(account.id);
      if (account.mainCategory === 'debt' && !includeCredit) {
        // Credit cards and loans show as negative (what you owe)
        return total - currentBal;
      }
      return total + currentBal;
    }, 0);
}

/** Get accounts grouped by mainCategory */
export function getAccountsByMainCategory(): Record<AccountMainCategory, Account[]> {
  const data = loadAccounts();
  const grouped: Record<AccountMainCategory, Account[]> = {
    cash: [],
    debt: [],
    bill: [],
    investment: [],
    other: [],
  };

  for (const account of data.accounts) {
    if (!grouped[account.mainCategory]) {
      grouped[account.mainCategory] = [];
    }
    grouped[account.mainCategory].push(account);
  }

  return grouped;
}

/** Get bill accounts (active) */
export function getBillAccounts(): Account[] {
  const data = loadAccounts();
  return data.accounts.filter(
    (a) => a.mainCategory === 'bill' && a.isActive !== false
  );
}

/** Get cash accounts (checking/savings) */
export function getCashAccounts(): Account[] {
  const data = loadAccounts();
  return data.accounts.filter((a) => a.mainCategory === 'cash');
}

/** Get investment accounts */
export function getInvestmentAccounts(): Account[] {
  const data = loadAccounts();
  return data.accounts.filter((a) => a.mainCategory === 'investment');
}

/** Get debt accounts (credit_card/loan) */
export function getDebtAccounts(): Account[] {
  const data = loadAccounts();
  return data.accounts.filter((a) => a.mainCategory === 'debt');
}

/** Get the current balance for an account: startingBalance + sum of all transactions */
export function getAccountCurrentBalance(accountId: string): number {
  const account = loadAccounts().accounts.find((a) => a.id === accountId);
  if (!account) return 0;

  const txs = getTransactionsForAccount(accountId);
  const transactionSum = txs.reduce((sum, tx) => sum + tx.amount, 0);
  return (account.startingBalance || 0) + transactionSum;
}

/** Recalculate all account balances from transactions.
 * Useful for data integrity checks or after manual edits.
 * Returns a map of accountId -> new balance. */
export function recalculateAllBalances(): Record<string, number> {
  const accountsData = loadAccounts();
  const results: Record<string, number> = {};

  for (const account of accountsData.accounts) {
    const txs = getTransactionsForAccount(account.id);
    const transactionSum = txs.reduce((sum, tx) => sum + tx.amount, 0);
    const newBalance = (account.startingBalance || 0) + transactionSum;
    results[account.id] = newBalance;
  }

  return results;
}

// ============================================================================
// Transaction Support (for TrakPipe)
// ============================================================================

export interface Transaction {
  id: string;
  accountId: string;
  date: number; // timestamp ms
  payee: string;
  category?: string;
  amount: number; // signed: positive income, negative expense
  memo?: string;
  cleared: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TransactionsData {
  transactions: Transaction[];
  version: number;
}

export const DEFAULT_TRANSACTIONS_DATA: TransactionsData = {
  transactions: [],
  version: 1,
};

export function loadTransactions(): TransactionsData {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS_DATA;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load transactions:", e);
  }
  return DEFAULT_TRANSACTIONS_DATA;
}

export function saveTransactions(data: TransactionsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save transactions:", e);
  }
}

export function addTransaction(tx: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Transaction {
  const data = loadTransactions();
  const now = Date.now();

  // No need to adjust account balance - it's computed on demand via getAccountCurrentBalance()

  const newTx: Transaction = {
    ...tx,
    id: `tx_${now}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  data.transactions.push(newTx);
  saveTransactions(data);
  return newTx;
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const data = loadTransactions();
  const idx = data.transactions.findIndex(t => t.id === id);
  if (idx === -1) return null;

  // No need to adjust account balance - it's computed on demand via getAccountCurrentBalance()

  data.transactions[idx] = {
    ...data.transactions[idx],
    ...updates,
    updatedAt: Date.now(),
  };
  saveTransactions(data);
  return data.transactions[idx];
}

export function deleteTransaction(id: string): boolean {
  const data = loadTransactions();
  const idx = data.transactions.findIndex(t => t.id === id);
  if (idx === -1) return false;

  // No need to adjust account balance - it's computed on demand via getAccountCurrentBalance()

  data.transactions.splice(idx, 1);
  saveTransactions(data);
  return true;
}

export function getTransactionsForAccount(accountId: string): Transaction[] {
  const data = loadTransactions();
  return data.transactions
    .filter(t => t.accountId === accountId)
    .sort((a, b) => a.date - b.date); // oldest first
}

export function getAllTransactions(): Transaction[] {
  const data = loadTransactions();
  return data.transactions.sort((a, b) => a.date - b.date);
}

/** Export all accounts as JSON for backup */
export function exportAccountsAsJSON(): string {
  const data = loadAccounts();
  return JSON.stringify(data, null, 2);
}

/** Import accounts from JSON */
export function importAccountsFromJSON(json: string): boolean {
  try {
    const imported = JSON.parse(json) as AccountsData;

    // Basic validation
    if (!imported.accounts || !Array.isArray(imported.accounts)) {
      return false;
    }

    // Ensure all account IDs are strings
    imported.accounts = imported.accounts.map((acc: any) => {
      if (typeof acc.id !== 'string') {
        acc.id = String(acc.id);
      }
      return acc;
    });

    // Migrate if needed
    if (!imported.version || imported.version < 2) {
      imported.accounts = imported.accounts.map((acc: any) => {
        if (acc.mainCategory) return acc;
        return migrateLegacyAccount(acc);
      });
      imported.version = 2;
    }

    saveAccounts(imported);
    return true;
  } catch {
    return false;
  }
}