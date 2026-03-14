/**
 * Transaction interface for TrakPipe
 */

export interface Transaction {
  id: string;
  accountId: string;
  date: number; // timestamp ms
  payee: string;
  category?: string;
  amount: number; // signed: positive = income, negative = expense
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

export const TRANSACTIONS_STORAGE_KEY = "gitchpage-transactions";

export function loadTransactions(): TransactionsData {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS_DATA;
  try {
    const saved = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load transactions:", e);
  }
  return DEFAULT_TRANSACTIONS_DATA;
}

export function saveTransactions(data: TransactionsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save transactions:", e);
  }
}

export function addTransaction(tx: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Transaction {
  const data = loadTransactions();
  const now = Date.now();
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
  const len = data.transactions.length;
  data.transactions = data.transactions.filter(t => t.id !== id);
  if (data.transactions.length === len) return false;
  saveTransactions(data);
  return true;
}

export function getTransactionsForAccount(accountId: string): Transaction[] {
  const data = loadTransactions();
  return data.transactions.filter(t => t.accountId === accountId).sort((a,b) => a.date - b.date);
}

// Balance sync: when a transaction is added/updated/deleted, adjust account balance
export function adjustAccountBalance(accountId: string, deltaAmount: number): void {
  // Read accounts from storage
  const { loadAccounts, updateAccount } = await import('./storage'); // circular? We'll handle differently
  // Actually we should export these from storage and call them
}