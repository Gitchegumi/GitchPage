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

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  ACCOUNTS: "gitchpage-accounts",
  BUDGET: "gitchpage-budget-data",
  DEBTS: "gitchpage-debts", // Legacy DebtPipe storage
} as const;

// ============================================================================
// Account Types
// ============================================================================

export type AccountType = 
  | "checking" 
  | "savings" 
  | "credit" 
  | "investment" 
  | "cash" 
  | "other";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Current balance (positive number). For credit cards, this is the current balance. */
  balance: number;
  /** Credit limit (only for credit accounts) */
  limit?: number;
  /** Institution name */
  institution?: string;
  /** Last 4 digits of account */
  mask?: string;
  /** Color for UI display */
  color?: string;
  /** Whether this account is hidden from dashboards */
  hidden: boolean;
  /** Created timestamp */
  createdAt: number;
  /** Last updated timestamp */
  updatedAt: number;
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
  version: 1,
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  cash: "Cash",
  other: "Other",
};

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  checking: "#3B82F6",   // blue
  savings: "#10B981",    // green
  credit: "#EF4444",     // red
  investment: "#8B5CF6", // purple
  cash: "#F59E0B",       // amber
  other: "#6B7280",      // gray
};

// ============================================================================
// Storage Functions
// ============================================================================

/** Generate a unique ID for new accounts */
export function generateAccountId(): string {
  return `acc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Load accounts from localStorage */
export function loadAccounts(): AccountsData {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNTS_DATA;
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (saved) {
      const parsed = JSON.parse(saved) as AccountsData;
      // Ensure version field exists for migrations
      if (!parsed.version) {
        parsed.version = 1;
      }
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
  
  const newAccount: Account = {
    ...account,
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
      if (account.type === "credit" && !includeCredit) {
        // Credit cards show as negative (what you owe)
        return total - (account.balance || 0);
      }
      return total + (account.balance || 0);
    }, 0);
}

/** Get accounts grouped by type */
export function getAccountsByType(): Record<AccountType, Account[]> {
  const data = loadAccounts();
  const grouped: Record<AccountType, Account[]> = {
    checking: [],
    savings: [],
    credit: [],
    investment: [],
    cash: [],
    other: [],
  };
  
  for (const account of data.accounts) {
    if (!grouped[account.type]) {
      grouped[account.type] = [];
    }
    grouped[account.type].push(account);
  }
  
  return grouped;
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
    
    saveAccounts(imported);
    return true;
  } catch {
    return false;
  }
}