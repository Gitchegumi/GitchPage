/**
 * TrakPipe - Transaction Register Storage Layer
 * 
 * Manages transactions for Cash and Investment accounts from AccountPipe.
 * All data stays client-side in localStorage.
 * 
 * Features:
 * - Transaction register for checking, savings, retirement accounts
 * - Balance syncing with AccountPipe
 * - URL-based data sharing (no backend)
 */

import type { Account } from './storage';

// ============================================================================
// Storage Keys
// ============================================================================

export const TRAKPIPE_STORAGE_KEY = "gitchpage-trakpipe-data";

// ============================================================================
// Types
// ============================================================================

export type TransactionType = 'debit' | 'credit' | 'transfer';

export interface Transaction {
  id: string;
  /** Account ID from AccountPipe */
  accountId: string;
  /** Date of transaction (timestamp) */
  date: number;
  /** Transaction description/memo */
  description: string;
  /** Amount (positive for credits, negative for debits) */
  amount: number;
  /** Transaction type */
  type: TransactionType;
  /** Optional category for filtering */
  category?: string;
  /** Whether this transaction has been reconciled */
  reconciled: boolean;
  /** Optional: ID of linked account for transfers */
  linkedAccountId?: string;
  /** Metadata */
  createdAt: number;
  updatedAt: number;
}

export interface TrakPipeData {
  transactions: Transaction[];
  /** Schema version */
  version: number;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_TRAKPIPE_DATA: TrakPipeData = {
  transactions: [],
  version: 1,
};

// Transaction categories
export const TRANSACTION_CATEGORIES = [
  "Income",
  "Transfer",
  "Utilities",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Dining",
  "Shopping",
  "Healthcare",
  "Insurance",
  "Subscriptions",
  "Fees",
  "Investment",
  "Other",
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

// ============================================================================
// Storage Functions
// ============================================================================

/** Generate a unique ID for new transactions */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Load transactions from localStorage */
export function loadTransactions(): TrakPipeData {
  if (typeof window === "undefined") {
    return DEFAULT_TRAKPIPE_DATA;
  }

  try {
    const saved = localStorage.getItem(TRAKPIPE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as TrakPipeData;
    }
  } catch (error) {
    console.error("Failed to load transactions:", error);
  }

  return DEFAULT_TRAKPIPE_DATA;
}

/** Save transactions to localStorage */
export function saveTransactions(data: TrakPipeData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TRAKPIPE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save transactions:", error);
  }
}

/** Add a new transaction */
export function addTransaction(
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
): Transaction {
  const data = loadTransactions();
  const now = Date.now();

  const newTransaction: Transaction = {
    ...transaction,
    id: generateTransactionId(),
    createdAt: now,
    updatedAt: now,
  };

  data.transactions.push(newTransaction);
  saveTransactions(data);

  return newTransaction;
}

/** Update an existing transaction */
export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | null {
  const data = loadTransactions();
  const index = data.transactions.findIndex((t) => t.id === id);

  if (index === -1) return null;

  data.transactions[index] = {
    ...data.transactions[index],
    ...updates,
    updatedAt: Date.now(),
  };

  saveTransactions(data);
  return data.transactions[index];
}

/** Delete a transaction */
export function deleteTransaction(id: string): boolean {
  const data = loadTransactions();
  const initialLength = data.transactions.length;

  data.transactions = data.transactions.filter((t) => t.id !== id);

  if (data.transactions.length === initialLength) return false;

  saveTransactions(data);
  return true;
}

/** Get transactions for a specific account */
export function getTransactionsByAccount(accountId: string): Transaction[] {
  const data = loadTransactions();
  return data.transactions
    .filter((t) => t.accountId === accountId)
    .sort((a, b) => b.date - a.date); // Most recent first
}

/** Get all transactions sorted by date */
export function getAllTransactions(): Transaction[] {
  const data = loadTransactions();
  return [...data.transactions].sort((a, b) => b.date - a.date);
}

/** Calculate running balance for an account */
export function calculateRunningBalance(
  accountId: string,
  startBalance: number = 0
): { transaction: Transaction; balance: number }[] {
  const transactions = getTransactionsByAccount(accountId);
  let balance = startBalance;
  
  return transactions.map((t) => {
    balance += t.amount;
    return { transaction: t, balance };
  }).reverse(); // Return oldest first for running balance
}

/** Get transactions filtered by date range */
export function getTransactionsByDateRange(
  accountId: string,
  startDate: number,
  endDate: number
): Transaction[] {
  return getTransactionsByAccount(accountId).filter(
    (t) => t.date >= startDate && t.date <= endDate
  );
}

/** Bulk import transactions */
export function importTransactions(
  transactions: Omit<Transaction, "id" | "createdAt" | "updatedAt">[]
): Transaction[] {
  const data = loadTransactions();
  const now = Date.now();

  const newTransactions = transactions.map((t) => ({
    ...t,
    id: generateTransactionId(),
    createdAt: now,
    updatedAt: now,
  }));

  data.transactions.push(...newTransactions);
  saveTransactions(data);

  return newTransactions;
}

/** Export all transactions as JSON */
export function exportTransactionsAsJSON(): string {
  const data = loadTransactions();
  return JSON.stringify(data, null, 2);
}

/** Import transactions from JSON */
export function importTransactionsFromJSON(json: string): boolean {
  try {
    const imported = JSON.parse(json) as TrakPipeData;

    if (!imported.transactions || !Array.isArray(imported.transactions)) {
      return false;
    }

    saveTransactions(imported);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// URL Sharing (Base64 encoded)
// ============================================================================

/** Encode transactions for URL sharing */
export function encodeTransactionsForShare(transactions: Transaction[]): string {
  // Filter to only essential fields for sharing
  const shareData = transactions.map((t) => ({
    a: t.accountId,
    d: t.date,
    ds: t.description,
    am: t.amount,
    ty: t.type,
    c: t.category,
    r: t.reconciled,
  }));

  const json = JSON.stringify(shareData);
  return btoa(encodeURIComponent(json));
}

/** Decode transactions from URL share */
export function decodeTransactionsFromShare(encoded: string): Partial<Transaction>[] {
  try {
    const json = decodeURIComponent(atob(encoded));
    const shareData = JSON.parse(json) as Array<{
      a: string;
      d: number;
      ds: string;
      am: number;
      ty: TransactionType;
      c?: string;
      r: boolean;
    }>;

    return shareData.map((s) => ({
      accountId: s.a,
      date: s.d,
      description: s.ds,
      amount: s.am,
      type: s.ty,
      category: s.c,
      reconciled: s.r,
    }));
  } catch (error) {
    console.error("Failed to decode shared transactions:", error);
    return [];
  }
}

/** Generate a shareable URL with transactions */
export function generateShareableUrl(
  accountId: string,
  accountName: string
): string {
  const transactions = getTransactionsByAccount(accountId);
  if (transactions.length === 0) {
    return "";
  }

  const encoded = encodeTransactionsForShare(transactions);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return `${baseUrl}/trakpipe?share=${encoded}&account=${encodeURIComponent(accountName)}`;
}
