"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Account,
  getCashAccounts,
  getInvestmentAccounts,
  getDebtAccounts,
  getBillAccounts,
  loadAccounts,
  Transaction,
  addTransaction,
  getTransactionsForAccount,
  updateTransaction,
  deleteTransaction,
  getAccountCurrentBalance,
  STORAGE_KEYS,
} from "@/lib/storage";
import { BudgetData } from "@/components/budget/types";
import { FinPipeMenu } from "@/components/utilities/FinPipeMenu";
import { CsvExportButton, CsvImportButton } from "@/components/trakpipe/CsvImportExport";
import { Plus, ArrowLeft, Wallet, Edit2, Trash2 } from "lucide-react";

type View = "dashboard" | "register";

export default function TrakPipe() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [view, setView] = useState<View>("dashboard");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Category options: union of debt/bill account names and SpendPipe categories
  const categories = useMemo(() => {
    const accData = loadAccounts();
    const debtNames = accData.accounts
      .filter((a) => a.mainCategory === "debt" && !a.hidden)
      .map((a) => a.name);
    const billNames = accData.accounts
      .filter((a) => a.mainCategory === "bill" && !a.hidden)
      .map((a) => a.name);
    let spend: string[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) {
        const bud = JSON.parse(saved) as BudgetData;
        spend = [
          ...new Set([
            ...bud.debts.map((d) => d.category).filter(Boolean),
            ...bud.bills.map((b) => b.category).filter(Boolean),
            ...bud.customDebtCategories,
            ...bud.customBillCategories,
          ]),
        ];
      }
    } catch (e) {}
    return [
      ...new Set([
        ...debtNames,
        ...billNames,
        ...spend,
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Utilities",
        "Other",
      ]),
    ].sort();
  }, []);

  useEffect(() => {
    // Only load Cash and Investment accounts (not debt or bill)
    const all = [...getCashAccounts(), ...getInvestmentAccounts()].filter(
      (a) => !a.hidden,
    );
    setAccounts(all);
  }, []);

  const refreshAll = () => {
    if (selectedAccount) {
      setTransactions(getTransactionsForAccount(selectedAccount.id));
    }
    // Only load Cash and Investment accounts
    const all = [...getCashAccounts(), ...getInvestmentAccounts()].filter(
      (a) => !a.hidden,
    );
    setAccounts(all);
    window.dispatchEvent(new Event("trakpipe-tx-change"));
  };

  const loadRegister = (account: Account) => {
    setSelectedAccount(account);
    setTransactions(getTransactionsForAccount(account.id));
    setView("register");
  };

  const goBack = () => {
    setView("dashboard");
    setSelectedAccount(null);
    setTransactions([]);
    setEditingId(null);
  };

  // Find a debt or bill account whose name matches the given category string
  const findLinkedAccount = (category: string): Account | null => {
    const all = loadAccounts().accounts;
    return (
      all.find(
        (a) =>
          (a.mainCategory === "debt" || a.mainCategory === "bill") &&
          a.name === category &&
          !a.hidden,
      ) ?? null
    );
  };

  const handleAddTransaction = (
    date: number,
    payee: string,
    amount: number,
    category?: string,
    memo?: string,
  ) => {
    if (!selectedAccount) return;

    // Create the primary transaction on the cash/investment account
    const mainTx = addTransaction({
      accountId: selectedAccount.id,
      date,
      payee,
      amount,
      category,
      memo,
      cleared: false,
    });

    // Double-entry: if the category matches a debt/bill account, create a
    // counter transaction on that account (same amount — reduces its balance)
    if (category) {
      const linked = findLinkedAccount(category);
      if (linked) {
        const counterTx = addTransaction({
          accountId: linked.id,
          date,
          payee,
          amount,
          category: "Payment",
          cleared: false,
          linkedTransactionId: mainTx.id,
        });
        updateTransaction(mainTx.id, { linkedTransactionId: counterTx.id });
      }
    }

    refreshAll();
  };

  const startEdit = (tx: Transaction) => setEditingId(tx.id);
  const cancelEdit = () => setEditingId(null);

  const handleUpdateTransaction = (updates: Partial<Transaction>) => {
    if (!editingId || !editingTx) return;

    const newCategory = updates.category;
    const newLinked = newCategory ? findLinkedAccount(newCategory) : null;
    const mainUpdates: Partial<Transaction> = { ...updates };

    if (editingTx.linkedTransactionId) {
      if (newLinked) {
        // Counter transaction still needed — update it (handles account change too)
        updateTransaction(editingTx.linkedTransactionId, {
          accountId: newLinked.id,
          date: updates.date,
          payee: updates.payee,
          amount: updates.amount,
          cleared: updates.cleared,
        });
      } else {
        // Category no longer maps to a debt/bill account — remove counter transaction
        deleteTransaction(editingTx.linkedTransactionId);
        mainUpdates.linkedTransactionId = undefined;
      }
    } else if (newLinked) {
      // Category newly maps to a debt/bill account — create counter transaction
      const counterTx = addTransaction({
        accountId: newLinked.id,
        date: updates.date ?? editingTx.date,
        payee: updates.payee ?? editingTx.payee,
        amount: updates.amount ?? editingTx.amount,
        category: "Payment",
        cleared: updates.cleared ?? editingTx.cleared,
        linkedTransactionId: editingId,
      });
      mainUpdates.linkedTransactionId = counterTx.id;
    }

    updateTransaction(editingId, mainUpdates);
    setEditingId(null);
    refreshAll();
  };

  const toggleCleared = (tx: Transaction) => {
    updateTransaction(tx.id, { cleared: !tx.cleared });
    if (tx.linkedTransactionId) {
      updateTransaction(tx.linkedTransactionId, { cleared: !tx.cleared });
    }
    refreshAll();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      const tx = transactions.find((t) => t.id === id);
      if (tx?.linkedTransactionId) {
        deleteTransaction(tx.linkedTransactionId);
      }
      deleteTransaction(id);
      refreshAll();
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) =>
      sortOrder === "newest" ? b.date - a.date : a.date - b.date,
    );
  }, [transactions, sortOrder]);

  // Balance = startingBalance + ALL transactions (regardless of cleared status)
  const balance = useMemo(() => {
    return selectedAccount ? getAccountCurrentBalance(selectedAccount.id) : 0;
  }, [transactions, selectedAccount]);

  // Reconciled = startingBalance + cleared transactions only
  const reconciledBalance = useMemo(() => {
    if (!selectedAccount) return 0;
    const clearedSum = transactions
      .filter(t => t.cleared)
      .reduce((sum, t) => sum + t.amount, 0);
    return (selectedAccount.startingBalance || 0) + clearedSum;
  }, [transactions, selectedAccount]);

  const today = new Date().toISOString().split("T")[0];

  if (view === "dashboard") {
    return (
      <div className="space-y-6 md:mx-16 mx-8 md:my-8 my-4">
        <h1 className="text-2xl font-bold text-white">TrakPipe</h1>
        <p className="text-gray-400">
          Transaction register for Cash and Investment accounts.
        </p>
        <FinPipeMenu current="trakpipe" />

        {accounts.length === 0 ? (
          <div className="text-gray-400">
            No accounts available. Create accounts in AccountPipe first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => loadRegister(acc)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: acc.color || "#3B82F6" }}
                  >
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{acc.name}</div>
                    <div className="text-sm text-gray-400">
                      {acc.institution || ""}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  $
                  {getAccountCurrentBalance(acc.id).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!selectedAccount) return null;

  const editingTx = transactions.find((t) => t.id === editingId);

  return (
    <div className="space-y-4 md:mb-8 mb-4 md:mx-16 mx-8">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to accounts
      </button>

      <FinPipeMenu current="trakpipe" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {selectedAccount.name}
          </h1>
          <div className="text-gray-400">Register</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <CsvImportButton onImport={handleAddTransaction} />
            <CsvExportButton
              transactions={transactions}
              accountName={selectedAccount.name}
            />
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-2xl font-bold text-yellow-400">
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-400">Reconciled</div>
            <div className="text-2xl font-bold text-green-400">
              $
              {reconciledBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Opening Balance */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-white">Starting Balance</div>
            <div className="text-sm text-gray-400">
              Opening balance for this account
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-blue-400">
              $
              {(selectedAccount as any).startingBalance?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              }) ?? "0.00"}
            </div>
            <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
              Reconciled
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Quick Add Transaction
        </h2>
        {editingId ? (
          <EditForm
            tx={editingTx!}
            onSave={handleUpdateTransaction}
            onCancel={cancelEdit}
            categories={categories}
          />
        ) : (
          <QuickAddForm
            onSubmit={handleAddTransaction}
            categories={categories}
            defaultDate={today}
          />
        )}
      </div>

      {/* Transactions table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 text-sm">
            <tr>
              <th className="px-4 py-3">
                <button
                  onClick={() =>
                    setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))
                  }
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  title="Toggle sort order"
                >
                  Date
                  <span className="text-xs">
                    {sortOrder === "newest" ? "↓" : "↑"}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3">Payee</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Reconciled</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No transactions yet
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-white">{tx.payee}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {tx.category || "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${tx.amount >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleCleared(tx)}
                      className={`px-2 py-1 rounded text-xs ${tx.cleared ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-300"}`}
                    >
                      {tx.cleared ? 'Reconciled' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(tx)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingId && editingTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Edit Transaction
            </h3>
            <EditForm
              tx={editingTx}
              onSave={handleUpdateTransaction}
              onCancel={cancelEdit}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Subcomponents
// ------------------------------------------------------------------

function QuickAddForm({
  onSubmit,
  categories,
  defaultDate,
}: {
  onSubmit: (
    date: number,
    payee: string,
    amount: number,
    category?: string,
  ) => void;
  categories: string[];
  defaultDate: string;
}) {
  const [date, setDate] = useState(defaultDate);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!payee || isNaN(amt)) return;
    const [y, m, d] = date.split("-").map(Number);
    const dateMs = new Date(y, m - 1, d).getTime();
    const signedAmt = type === "income" ? amt : -amt;
    onSubmit(dateMs, payee, signedAmt, category);
    setPayee("");
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
    >
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Payee</label>
        <input
          type="text"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          placeholder="Who?"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 rounded ${type === "expense" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 rounded ${type === "income" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Income
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add
      </button>
    </form>
  );
}

function EditForm({
  tx,
  onSave,
  onCancel,
  categories,
}: {
  tx: Transaction;
  onSave: (updates: Partial<Transaction>) => void;
  onCancel: () => void;
  categories: string[];
}) {
  const txDate = new Date(tx.date);
  const [date, setDate] = useState(
    `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}-${String(txDate.getDate()).padStart(2, "0")}`,
  );
  const [payee, setPayee] = useState(tx.payee);
  const [amount, setAmount] = useState(Math.abs(tx.amount).toString());
  const [category, setCategory] = useState(tx.category || categories[0] || "");
  const [cleared, setCleared] = useState(tx.cleared);
  const [memo, setMemo] = useState(tx.memo || "");
  const [type, setType] = useState<"income" | "expense">(
    tx.amount >= 0 ? "income" : "expense",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!payee || isNaN(amt)) return;
    const signedAmt = type === "income" ? amt : -amt;
    const [y, m, d] = date.split("-").map(Number);
    onSave({
      date: new Date(y, m - 1, d).getTime(),
      payee,
      amount: signedAmt,
      category,
      cleared,
      memo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Payee</label>
        <input
          type="text"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Memo</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={cleared}
          onChange={(e) => setCleared(e.target.checked)}
          className="w-4 h-4"
        />
        <label className="text-white">Cleared</label>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-2 rounded ${type === "expense" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2 rounded ${type === "income" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Income
        </button>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
