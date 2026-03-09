"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Account,
  AccountType,
  AccountsData,
  loadAccounts,
  saveAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_COLORS,
  generateAccountId,
  type AccountType as AccountTypeEnum,
} from "@/lib/storage";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Wallet,
  Building2,
  CreditCard,
  TrendingUp,
  Banknote,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface EditingAccount {
  id: string | null;
  name: string;
  type: AccountType;
  balance: string;
  limit: string;
  institution: string;
  mask: string;
  color: string;
  hidden: boolean;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_EDITING: EditingAccount = {
  id: null,
  name: "",
  type: "checking",
  balance: "",
  limit: "",
  institution: "",
  mask: "",
  color: ACCOUNT_TYPE_COLORS.checking,
  hidden: false,
};

// ============================================================================
// Account Type Icons
// ============================================================================

const AccountTypeIcon = ({ type }: { type: AccountType }) => {
  switch (type) {
    case "checking":
      return <Building2 className="w-5 h-5" />;
    case "savings":
      return <Wallet className="w-5 h-5" />;
    case "credit":
      return <CreditCard className="w-5 h-5" />;
    case "investment":
      return <TrendingUp className="w-5 h-5" />;
    case "cash":
      return <Banknote className="w-5 h-5" />;
    default:
      return <MoreHorizontal className="w-5 h-5" />;
  }
};

// ============================================================================
// Main Component
// ============================================================================

export default function AccountPipe() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EditingAccount>(DEFAULT_EDITING);
  const [showDataMenu, setShowDataMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  // Load accounts on mount
  useEffect(() => {
    const data = loadAccounts();
    setAccounts(data.accounts);
    setHydrated(true);
  }, []);

  // Compute totals
  const totalBalance = accounts
    .filter((a) => !a.hidden)
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const totalCredit = accounts
    .filter((a) => !a.hidden && a.type === "credit")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const totalAssets = accounts
    .filter((a) => !a.hidden && a.type !== "credit")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const totalLiabilities = accounts
    .filter((a) => !a.hidden && a.type === "credit")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  // Handlers
  const handleAddNew = useCallback(() => {
    setEditing({
      ...DEFAULT_EDITING,
      color: ACCOUNT_TYPE_COLORS.checking,
    });
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((account: Account) => {
    setEditing({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      limit: (account.limit || "").toString(),
      institution: account.institution || "",
      mask: account.mask || "",
      color: account.color || ACCOUNT_TYPE_COLORS[account.type],
      hidden: account.hidden,
    });
    setShowForm(true);
  }, []);

  const handleSave = useCallback(() => {
    const balance = parseFloat(editing.balance) || 0;
    const limit = editing.limit ? parseFloat(editing.limit) : undefined;

    if (!editing.name.trim()) {
      return; // Require name
    }

    if (editing.id) {
      // Update existing
      updateAccount(editing.id, {
        name: editing.name.trim(),
        type: editing.type,
        balance,
        limit,
        institution: editing.institution.trim() || undefined,
        mask: editing.mask.trim() || undefined,
        color: editing.color,
        hidden: editing.hidden,
      });
    } else {
      // Add new
      addAccount({
        name: editing.name.trim(),
        type: editing.type,
        balance,
        limit,
        institution: editing.institution.trim() || undefined,
        mask: editing.mask.trim() || undefined,
        color: editing.color,
        hidden: editing.hidden,
      });
    }

    // Reload accounts
    const data = loadAccounts();
    setAccounts(data.accounts);
    setShowForm(false);
    setEditing(DEFAULT_EDITING);
  }, [editing]);

  const handleDelete = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      deleteAccount(id);
      const data = loadAccounts();
      setAccounts(data.accounts);
    }
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    const account = accounts.find((a) => a.id === id);
    if (account) {
      updateAccount(id, { hidden: !account.hidden });
      const data = loadAccounts();
      setAccounts(data.accounts);
    }
  }, [accounts]);

  const handleExport = useCallback(() => {
    const data = loadAccounts();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gitchpage-accounts-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    try {
      const imported = JSON.parse(importText) as AccountsData;
      if (!imported.accounts || !Array.isArray(imported.accounts)) {
        setImportError("Invalid format: missing accounts array");
        return;
      }
      saveAccounts(imported);
      const data = loadAccounts();
      setAccounts(data.accounts);
      setShowImportModal(false);
      setImportText("");
      setImportError("");
    } catch {
      setImportError("Invalid JSON format");
    }
  }, [importText]);

  const handleTypeChange = (type: AccountType) => {
    setEditing((prev) => ({
      ...prev,
      type,
      color: ACCOUNT_TYPE_COLORS[type],
    }));
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Assets</div>
          <div className="text-2xl font-bold text-green-400">
            ${totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Liabilities</div>
          <div className="text-2xl font-bold text-red-400">
            -${totalLiabilities.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Net Worth</div>
          <div
            className={`text-2xl font-bold ${
              totalBalance >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Accounts</div>
          <div className="text-2xl font-bold text-purple-400">
            {accounts.filter((a) => !a.hidden).length}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDataMenu(!showDataMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Data
          </button>
          {showDataMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  handleExport();
                  setShowDataMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowDataMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editing.id ? "Edit Account" : "Add Account"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Name *</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Main Checking"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors ${
                        editing.type === type
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <AccountTypeIcon type={type} />
                      {ACCOUNT_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.balance}
                    onChange={(e) => setEditing((p) => ({ ...p, balance: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {editing.type === "credit" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Credit Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editing.limit}
                      onChange={(e) => setEditing((p) => ({ ...p, limit: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Institution</label>
                  <input
                    type="text"
                    value={editing.institution}
                    onChange={(e) => setEditing((p) => ({ ...p, institution: e.target.value }))}
                    placeholder="e.g., Chase Bank"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editing.mask}
                    onChange={(e) => setEditing((p) => ({ ...p, mask: e.target.value.replace(/\D/g, "") }))}
                    placeholder="1234"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Color</label>
                <div className="flex gap-2">
                  {Object.values(ACCOUNT_TYPE_COLORS).map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditing((p) => ({ ...p, color }))}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        editing.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.hidden}
                  onChange={(e) => setEditing((p) => ({ ...p, hidden: e.target.checked }))}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-gray-300">Hidden from dashboards</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(DEFAULT_EDITING);
                }}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Import Accounts</h2>
            <p className="text-gray-400 text-sm mb-4">
              Paste the exported JSON data below. This will replace all existing accounts.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"accounts": [...], "version": 1}'
              className="w-full h-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            {importError && <p className="text-red-400 text-sm mt-2">{importError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText("");
                  setImportError("");
                }}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No accounts yet</p>
          <p className="text-sm">Click "Add Account" to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                account.hidden
                  ? "bg-gray-800/30 border-gray-700/50 opacity-60"
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: account.color || ACCOUNT_TYPE_COLORS[account.type] }}
                >
                  <AccountTypeIcon type={account.type} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{account.name}</span>
                    {account.hidden && (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {account.institution && <span>{account.institution}</span>}
                    {account.institution && account.mask && <span> • </span>}
                    {account.mask && <span>••••{account.mask}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      account.type === "credit" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {account.type === "credit" ? "-" : ""}$
                    {account.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  {account.type === "credit" && account.limit && (
                    <div className="text-xs text-gray-500">
                      of ${account.limit.toLocaleString()} limit
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleHidden(account.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={account.hidden ? "Show" : "Hide"}
                  >
                    {account.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}