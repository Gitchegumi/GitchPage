"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Account,
  AccountMainCategory,
  AccountSubtype,
  loadAccounts,
  saveAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  MAIN_CATEGORY_LABELS,
  MAIN_CATEGORY_COLORS,
  generateAccountId,
  CASH_SUBTYPE_LABELS,
  DEBT_SUBTYPE_LABELS,
  getBillAccounts,
  getCashAccounts,
  getDebtAccounts,
} from "@/lib/storage";
import { DEFAULT_BILL_CATEGORIES } from "@/components/budget/types";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Building2,
  Wallet,
  CreditCard,
  TrendingUp,
  Banknote,
  MoreHorizontal,
  Check,
  X,
  FileText,
  Home,
  Car,
  GraduationCap,
  HeartPulse,
  Baby,
  Wifi,
  Phone,
  Zap,
  Palette,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface EditingAccount {
  id: string | null;
  name: string;
  mainCategory: AccountMainCategory;
  subtype: AccountSubtype;
  balance: string;

  // Credit card specific
  creditLimit?: string;
  apr?: string;
  annualFee?: string;
  rewardsType?: string;

  // Loan specific
  loanType?: 'personal' | 'student' | 'auto' | 'mortgage' | 'other';
  originalAmount?: string;
  interestRate?: string;
  termMonths?: string;
  startDate?: string;
  paymentFrequency?: 'monthly' | 'biweekly' | 'weekly';
  firstPaymentDate?: string;
  servicer?: string;

  // Bill specific
  monthlyAmount?: string;
  dueDate?: string;
  isActive?: boolean;

  // Shared
  institution: string;
  mask: string;
  color: string;
  hidden: boolean;
  showsInBudget: boolean; // new
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_EDITING: EditingAccount = {
  id: null,
  name: "",
  mainCategory: "cash",
  subtype: "checking",
  balance: "",
  creditLimit: "",
  apr: "",
  annualFee: "",
  rewardsType: "",
  loanType: "other",
  originalAmount: "",
  interestRate: "",
  termMonths: "",
  startDate: "",
  paymentFrequency: "monthly",
  firstPaymentDate: "",
  servicer: "",
  monthlyAmount: "",
  dueDate: "",
  isActive: true,
  institution: "",
  mask: "",
  color: MAIN_CATEGORY_COLORS.cash,
  hidden: false,
  showsInBudget: true, // new default
};

// ============================================================================
// Icon Mapping
// ============================================================================

const CategoryIcon = ({
  mainCategory,
  subtype,
}: {
  mainCategory: AccountMainCategory;
  subtype?: AccountSubtype;
}) => {
  switch (mainCategory) {
    case "cash":
      return <Building2 className="w-5 h-5" />;
    case "debt":
      return subtype === "loan" ? <TrendingUp className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />;
    case "bill":
      return <FileText className="w-5 h-5" />;
    case "investment":
      return <TrendingUp className="w-5 h-5" />;
    default:
      return <MoreHorizontal className="w-5 h-5" />;
  }
};

// Mapping of bill categories to icons (optional)
const BillCategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  const iconMap: Record<string, React.ElementType> = {
    Utilities: Zap,
    Subscriptions: Wifi,
    Insurance: HeartPulse,
    Phone: Phone,
    Internet: Wifi,
    Rent: Home,
    Mortgage: Home,
    Groceries: Wallet,
    Transportation: Car,
    Childcare: Baby,
    Medical: HeartPulse,
    Other: FileText,
  };
  const Icon = iconMap[category] || FileText;
  return <Icon className="w-4 h-4" />;
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
  const totalAssets = accounts
    .filter((a) => !a.hidden && a.mainCategory !== "debt")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const totalLiabilities = accounts
    .filter((a) => !a.hidden && a.mainCategory === "debt")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const totalBalance = totalAssets - totalLiabilities;

  // Main category order
  const MAIN_CATEGORY_ORDER: AccountMainCategory[] = ['cash', 'debt', 'bill', 'investment', 'other'];
  const handleAddNew = useCallback(() => {
    setEditing({
      ...DEFAULT_EDITING,
      color: MAIN_CATEGORY_COLORS.cash,
      mainCategory: "cash",
      subtype: "checking",
    });
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((account: Account) => {
    setEditing({
      id: account.id,
      name: account.name,
      mainCategory: account.mainCategory,
      subtype: account.subtype,
      balance: account.balance.toString(),
      creditLimit: (account as any).creditLimit?.toString() || "",
      apr: (account as any).apr?.toString() || "",
      annualFee: (account as any).annualFee?.toString() || "",
      rewardsType: (account as any).rewardsType || "",
      loanType: (account as any).loanType || "other",
      originalAmount: (account as any).originalAmount?.toString() || "",
      interestRate: (account as any).interestRate?.toString() || "",
      termMonths: (account as any).termMonths?.toString() || "",
      startDate: (account as any).startDate?.toString() || "",
      paymentFrequency: (account as any).paymentFrequency || "monthly",
      firstPaymentDate: (account as any).firstPaymentDate?.toString() || "",
      servicer: (account as any).servicer || "",
      monthlyAmount: (account as any).monthlyAmount?.toString() || "",
      dueDate: (account as any).dueDate?.toString() || "",
      isActive: (account as any).isActive !== false,
      institution: account.institution || "",
      mask: account.mask || "",
      color: account.color || MAIN_CATEGORY_COLORS[account.mainCategory],
      hidden: account.hidden,
      showsInBudget: (account as any).showsInBudget !== false, // default true
    });
    setShowForm(true);
  }, []);

  const handleSave = useCallback(() => {
    const balance = parseFloat(editing.balance) || 0;
    const now = Date.now();

    if (!editing.name.trim()) {
      return; // Require name
    }

    // Build account object with appropriate fields based on mainCategory
    const baseAccount: Partial<Account> = {
      name: editing.name.trim(),
      mainCategory: editing.mainCategory,
      subtype: editing.subtype,
      balance,
      institution: editing.institution.trim() || undefined,
      mask: editing.mask.trim() || undefined,
      color: editing.color,
      hidden: editing.hidden,
      showsInBudget: editing.showsInBudget, // new
    };

    // Add type-specific fields
    if (editing.mainCategory === "debt" && editing.subtype === "credit_card") {
      baseAccount.creditLimit = editing.creditLimit ? parseFloat(editing.creditLimit) : undefined;
      baseAccount.apr = editing.apr ? parseFloat(editing.apr) : undefined;
      baseAccount.annualFee = editing.annualFee ? parseFloat(editing.annualFee) : undefined;
      baseAccount.rewardsType = editing.rewardsType || undefined;
    } else if (editing.mainCategory === "debt" && editing.subtype === "loan") {
      baseAccount.loanType = editing.loanType;
      baseAccount.originalAmount = editing.originalAmount ? parseFloat(editing.originalAmount) : undefined;
      baseAccount.currentBalance = balance; // sync
      baseAccount.interestRate = editing.interestRate ? parseFloat(editing.interestRate) : undefined;
      baseAccount.termMonths = editing.termMonths ? parseInt(editing.termMonths) : undefined;
      baseAccount.startDate = editing.startDate ? parseInt(editing.startDate) : undefined;
      baseAccount.paymentFrequency = editing.paymentFrequency;
      baseAccount.firstPaymentDate = editing.firstPaymentDate ? parseInt(editing.firstPaymentDate) : undefined;
      baseAccount.servicer = editing.servicer || undefined;
    } else if (editing.mainCategory === "bill") {
      baseAccount.monthlyAmount = editing.monthlyAmount ? parseFloat(editing.monthlyAmount) : undefined;
      baseAccount.dueDate = editing.dueDate ? parseInt(editing.dueDate) : undefined;
      baseAccount.isActive = editing.isActive;
    }

    if (editing.id) {
      // Update existing
      updateAccount(editing.id, baseAccount);
    } else {
      // Add new
      addAccount(baseAccount as Omit<Account, "id" | "createdAt" | "updatedAt">);
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
      const imported = JSON.parse(importText) as any;
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

  const handleMainCategoryChange = (mainCategory: AccountMainCategory) => {
    let defaultSubtype: AccountSubtype = "checking";
    if (mainCategory === "debt") defaultSubtype = "credit_card";
    else if (mainCategory === "bill") defaultSubtype = DEFAULT_BILL_CATEGORIES[0];
    else if (mainCategory === "investment") defaultSubtype = "investment";
    else if (mainCategory === "other") defaultSubtype = "other";

    setEditing((prev) => ({
      ...prev,
      mainCategory,
      subtype: defaultSubtype,
      color: MAIN_CATEGORY_COLORS[mainCategory],
    }));
  };

  const handleSubtypeChange = (subtype: AccountSubtype) => {
    setEditing((prev) => ({ ...prev, subtype }));
  };

  // Helper to get extra fields for current account type
  const renderTypeSpecificFields = () => {
    const { mainCategory, subtype } = editing;

    if (mainCategory === "debt" && subtype === "credit_card") {
      return (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Credit Limit *</label>
            <input
              type="number"
              step="0.01"
              value={editing.creditLimit}
              onChange={(e) => setEditing((p) => ({ ...p, creditLimit: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">APR (%)</label>
            <input
              type="number"
              step="0.01"
              value={editing.apr}
              onChange={(e) => setEditing((p) => ({ ...p, apr: e.target.value }))}
              placeholder="e.g., 19.99"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Annual Fee</label>
              <input
                type="number"
                step="0.01"
                value={editing.annualFee}
                onChange={(e) => setEditing((p) => ({ ...p, annualFee: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rewards Type</label>
              <input
                type="text"
                value={editing.rewardsType}
                onChange={(e) => setEditing((p) => ({ ...p, rewardsType: e.target.value }))}
                placeholder="e.g., cashback, points"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </>
      );
    }

    if (mainCategory === "debt" && subtype === "loan") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Loan Type</label>
              <select
                value={editing.loanType}
                onChange={(e) => setEditing((p) => ({ ...p, loanType: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="student">Student</option>
                <option value="auto">Auto</option>
                <option value="mortgage">Mortgage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Payment Frequency</label>
              <select
                value={editing.paymentFrequency}
                onChange={(e) => setEditing((p) => ({ ...p, paymentFrequency: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Original Amount</label>
            <input
              type="number"
              step="0.01"
              value={editing.originalAmount}
              onChange={(e) => setEditing((p) => ({ ...p, originalAmount: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Interest Rate (APR %)</label>
            <input
              type="number"
              step="0.01"
              value={editing.interestRate}
              onChange={(e) => setEditing((p) => ({ ...p, interestRate: e.target.value }))}
              placeholder="e.g., 5.5"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Term (months)</label>
              <input
                type="number"
                value={editing.termMonths}
                onChange={(e) => setEditing((p) => ({ ...p, termMonths: e.target.value }))}
                placeholder="e.g., 360"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={editing.startDate ? new Date(parseInt(editing.startDate)).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditing((p) => ({ ...p, startDate: e.target.value ? new Date(e.target.value).getTime().toString() : '' }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">First Payment Date (optional)</label>
            <input
              type="date"
              value={editing.firstPaymentDate ? new Date(parseInt(editing.firstPaymentDate)).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditing((p) => ({ ...p, firstPaymentDate: e.target.value ? new Date(e.target.value).getTime().toString() : '' }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Servicer (optional)</label>
            <input
              type="text"
              value={editing.servicer}
              onChange={(e) => setEditing((p) => ({ ...p, servicer: e.target.value }))}
              placeholder="e.g., Sallie Mae"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </>
      );
    }

    if (mainCategory === "bill") {
      return (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Monthly Amount *</label>
            <input
              type="number"
              step="0.01"
              value={editing.monthlyAmount}
              onChange={(e) => setEditing((p) => ({ ...p, monthlyAmount: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Due Date *</label>
            <input
              type="number"
              min="1"
              max="31"
              value={editing.dueDate}
              onChange={(e) => setEditing((p) => ({ ...p, dueDate: e.target.value }))}
              placeholder="1-31"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.isActive}
              onChange={(e) => setEditing((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
            />
            <span className="text-gray-300">Active (shows in budget)</span>
          </label>
        </>
      );
    }

    return null;
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
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
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

              {/* Main Category Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {MAIN_CATEGORY_ORDER.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleMainCategoryChange(cat)}
                      className={`px-3 py-2 rounded-lg text-sm flex flex-col items-center gap-1 transition-colors ${
                        editing.mainCategory === cat
                          ? "bg-blue-600 text-white ring-2 ring-blue-400"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <CategoryIcon mainCategory={cat} subtype={editing.subtype} />
                      {MAIN_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtype Selection */}
              {editing.mainCategory === "cash" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["checking", "savings", "cash_wallet"] as CashSubtype[]).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubtypeChange(sub)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          editing.subtype === sub
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {CASH_SUBTYPE_LABELS[sub]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editing.mainCategory === "debt" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Debt Type</label>
                  <div className="flex gap-2">
                    {(["credit_card", "loan"] as DebtSubtype[]).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubtypeChange(sub)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          editing.subtype === sub
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {DEBT_SUBTYPE_LABELS[sub]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editing.mainCategory === "bill" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bill Category</label>
                  <select
                    value={editing.subtype as BillSubtype}
                    onChange={(e) => handleSubtypeChange(e.target.value as BillSubtype)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {DEFAULT_BILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editing.mainCategory === "investment" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Investment Type</label>
                  <select
                    value={String(editing.subtype || "investment")}
                    onChange={(e) => handleSubtypeChange(e.target.value as InvestmentSubtype)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="retirement">Retirement</option>
                    <option value="other_investment">Other</option>
                  </select>
                </div>
              )}

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
              </div>

              {/* Type-specific fields */}
              {renderTypeSpecificFields()}

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
                <div className="flex gap-2 flex-wrap">
                  {Object.values(MAIN_CATEGORY_COLORS)
                    .filter((color, idx, arr) => arr.indexOf(color) === idx) // unique
                    .map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditing((p) => ({ ...p, color }))}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          editing.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
              </div>

              {(editing.mainCategory === 'cash' || editing.mainCategory === 'debt') && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.showsInBudget}
                    onChange={(e) => setEditing((p) => ({ ...p, showsInBudget: e.target.checked }))}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-300">Shows in budget</span>
                </label>
              )}

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
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(DEFAULT_EDITING);
                }}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
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
              placeholder='{"accounts": [...], "version": 2}'
              className="w-full h-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            {importError && <p className="text-red-400 text-sm mt-2">{importError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
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
                type="button"
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
          {accounts.map((account) => {
            const isDebt = account.mainCategory === "debt";
            const isBill = account.mainCategory === "bill";
            const billAccount = isBill ? account as any : null;
            return (
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
                    style={{ backgroundColor: account.color || MAIN_CATEGORY_COLORS[account.mainCategory] }}
                  >
                    <CategoryIcon mainCategory={account.mainCategory} subtype={account.subtype} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{account.name}</span>
                      {account.hidden && <EyeOff className="w-4 h-4 text-gray-500" />}
                      {isBill && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Bill
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span>{MAIN_CATEGORY_LABELS[account.mainCategory]}</span>
                      {account.institution && <span>• {account.institution}</span>}
                      {account.mask && <span> • ••••{account.mask}</span>}
                      {isBill && billAccount?.monthlyAmount && (
                        <span className="text-blue-300">
                          • ${billAccount.monthlyAmount}/mo
                        </span>
                      )}
                      {isBill && billAccount?.dueDate && (
                        <span className="text-gray-500">
                          • due {billAccount.dueDate}
                        </span>
                      )}
                      {isDebt && account.creditLimit && (
                        <span className="text-gray-500">
                          of ${account.creditLimit.toLocaleString()} limit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        isDebt ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {isDebt ? "-" : ""}$
                      {account.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    {isBill && billAccount?.dueDate && (
                      <div className="text-xs text-gray-500">
                        Due: {billAccount.dueDate}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleHidden(account.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title={account.hidden ? "Show" : "Hide"}
                    >
                      {account.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(account)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}