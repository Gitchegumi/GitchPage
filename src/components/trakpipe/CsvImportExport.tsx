"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Download,
  X,
  ChevronRight,
  ChevronLeft,
  FileUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Transaction } from "@/lib/storage";

// ─── CSV utilities ─────────────────────────────────────────────────────────────

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (!nonEmpty.length) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(field.trim());
        field = "";
      } else {
        field += ch;
      }
    }
    result.push(field.trim());
    return result;
  };

  const headers = parseRow(nonEmpty[0]);
  const rows = nonEmpty
    .slice(1)
    .map(parseRow)
    .filter((r) => r.some((c) => c.trim()));
  return { headers, rows };
}

function parseDate(str: string): number | null {
  const s = str.trim().replace(/^["']|["']$/g, "");
  // YYYY-MM-DD
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  // M/D/YYYY or MM/DD/YYYY
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]).getTime();
  // M/D/YY
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (m) {
    const yr = +m[3] < 50 ? 2000 + +m[3] : 1900 + +m[3];
    return new Date(yr, +m[1] - 1, +m[2]).getTime();
  }
  return null;
}

function parseAmount(str: string): number | null {
  const s = str.trim().replace(/^["']|["']$/g, "");
  // Parentheses denote negative: (200.00) → -200
  const negative = s.startsWith("(") && s.endsWith(")");
  const cleaned = s.replace(/[$,\s()]/g, "");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return null;
  return negative ? -Math.abs(n) : n;
}

function formatLocalDate(ts: number): string {
  const d = new Date(ts);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function buildExportCSV(transactions: Transaction[]): string {
  const headers = ["Date", "Payee", "Category", "Amount", "Memo", "Reconciled"];
  const rows = transactions.map((tx) => [
    formatLocalDate(tx.date),
    tx.payee,
    tx.category ?? "",
    tx.amount.toFixed(2),
    tx.memo ?? "",
    tx.cleared ? "Yes" : "No",
  ]);
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
}

// ─── Types ─────────────────────────────────────────────────────────────────────

const NONE = "__none__";

interface Mapping {
  date: string;
  payee: string;
  amountMode: "single" | "split";
  amount: string;
  debit: string;
  credit: string;
  invertAmount: boolean;
  category: string;
  memo: string;
}

const DEFAULT_MAPPING: Mapping = {
  date: NONE,
  payee: NONE,
  amountMode: "single",
  amount: NONE,
  debit: NONE,
  credit: NONE,
  invertAmount: false,
  category: NONE,
  memo: NONE,
};

interface ParsedRow {
  date: number | null;
  payee: string;
  amount: number | null;
  category: string;
  memo: string;
  isValid: boolean;
}

// ─── Export button ─────────────────────────────────────────────────────────────

export function CsvExportButton({
  transactions,
  accountName,
}: {
  transactions: Transaction[];
  accountName: string;
}) {
  const handleExport = () => {
    const csv = buildExportCSV(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${accountName.replace(/\s+/g, "_")}_transactions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}

// ─── Import button + modal ─────────────────────────────────────────────────────

export function CsvImportButton({
  onImport,
}: {
  onImport: (
    date: number,
    payee: string,
    amount: number,
    category?: string,
    memo?: string,
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState<Mapping>(DEFAULT_MAPPING);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("upload");
      setHeaders([]);
      setRawRows([]);
      setFileName("");
      setMapping(DEFAULT_MAPPING);
    }, 200);
  };

  const loadFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: h, rows } = parseCSV(text);
      if (!h.length) return;
      setHeaders(h);
      setRawRows(rows);

      // Auto-match columns by common header names
      const find = (...keywords: string[]) =>
        h.find((col) =>
          keywords.some((k) =>
            col
              .toLowerCase()
              .replace(/[^a-z]/g, "")
              .includes(k.replace(/[^a-z]/g, "")),
          ),
        ) ?? NONE;

      setMapping((prev) => ({
        ...prev,
        date: find("date", "transactiondate", "transdate", "postdate"),
        payee: find("payee", "description", "merchant", "name"),
        amount: find("amount", "transactionamount"),
        debit: find("debit", "withdrawal"),
        credit: find("credit", "deposit"),
        category: find("category"),
        memo: find("memo", "note", "reference", "remarks"),
      }));

      setStep("map");
    };
    reader.readAsText(file);
  };

  const set = (key: keyof Mapping, value: string | boolean) =>
    setMapping((m) => ({ ...m, [key]: value }));

  // Apply the current mapping to every raw row
  const parsedRows: ParsedRow[] = rawRows.map((row) => {
    const col = (key: string) =>
      key === NONE ? "" : (row[headers.indexOf(key)] ?? "").trim();

    const date = parseDate(col(mapping.date));
    const payee = col(mapping.payee);

    let amount: number | null = null;
    if (mapping.amountMode === "single") {
      const raw = parseAmount(col(mapping.amount));
      if (raw !== null) amount = mapping.invertAmount ? -raw : raw;
    } else {
      const d = parseAmount(col(mapping.debit)) ?? 0;
      const c = parseAmount(col(mapping.credit)) ?? 0;
      amount = c - d;
    }

    return {
      date,
      payee,
      amount,
      category: col(mapping.category),
      memo: col(mapping.memo),
      isValid: date !== null && amount !== null && payee.length > 0,
    };
  });

  const validCount = parsedRows.filter((r) => r.isValid).length;

  const canAdvance =
    mapping.date !== NONE &&
    mapping.payee !== NONE &&
    (mapping.amountMode === "single"
      ? mapping.amount !== NONE
      : mapping.debit !== NONE && mapping.credit !== NONE);

  const handleImport = () => {
    for (const row of parsedRows) {
      if (!row.isValid) continue;
      onImport(
        row.date!,
        row.payee,
        row.amount!,
        row.category || undefined,
        row.memo || undefined,
      );
    }
    close();
  };

  // Reusable column selector
  const ColSelect = ({
    label,
    value,
    onChange,
    required = false,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
  }) => (
    <div className="flex items-center gap-3">
      <label className="w-36 text-sm text-gray-400 shrink-0">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-3 py-2 bg-gray-700 border rounded-lg text-white text-sm ${
          required && value === NONE ? "border-red-500" : "border-gray-600"
        }`}
      >
        <option value={NONE}>— not mapped —</option>
        {headers.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  );

  const STEPS = ["upload", "map", "preview"] as const;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-700 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">Import CSV</h3>
                <div className="flex items-center gap-1 mt-2">
                  {STEPS.map((s, i) => {
                    const done = STEPS.indexOf(step) > i;
                    const active = step === s;
                    return (
                      <div key={s} className="flex items-center gap-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            active
                              ? "bg-blue-600 text-white"
                              : done
                              ? "bg-green-600 text-white"
                              : "bg-gray-600 text-gray-400"
                          }`}
                        >
                          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span
                          className={`text-xs ${active ? "text-white" : "text-gray-500"}`}
                        >
                          {s === "upload"
                            ? "Upload"
                            : s === "map"
                            ? "Map Fields"
                            : "Preview & Import"}
                        </span>
                        {i < 2 && (
                          <ChevronRight className="w-3 h-3 text-gray-600 mx-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-white mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* Step 1 — Upload */}
              {step === "upload" && (
                <div
                  className={`border-2 border-dashed rounded-xl p-14 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) loadFile(file);
                  }}
                >
                  <FileUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-white font-medium text-lg">
                    Drop a CSV file here
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    or click to browse your files
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) loadFile(f);
                    }}
                  />
                </div>
              )}

              {/* Step 2 — Map fields */}
              {step === "map" && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium">{fileName}</span>
                    {" — "}
                    {rawRows.length} rows detected. Map your CSV columns to
                    TrakPipe fields. Required fields are marked with{" "}
                    <span className="text-red-400">*</span>.
                  </p>

                  <div className="space-y-3">
                    <ColSelect
                      label="Date"
                      value={mapping.date}
                      onChange={(v) => set("date", v)}
                      required
                    />
                    <ColSelect
                      label="Payee / Description"
                      value={mapping.payee}
                      onChange={(v) => set("payee", v)}
                      required
                    />
                  </div>

                  {/* Amount section */}
                  <div className="border border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-400 w-36 shrink-0">
                        Amount <span className="text-red-400">*</span>
                      </span>
                      <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                        <input
                          type="radio"
                          checked={mapping.amountMode === "single"}
                          onChange={() => set("amountMode", "single")}
                          className="accent-blue-500"
                        />
                        Single column
                      </label>
                      <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                        <input
                          type="radio"
                          checked={mapping.amountMode === "split"}
                          onChange={() => set("amountMode", "split")}
                          className="accent-blue-500"
                        />
                        Debit / Credit columns
                      </label>
                    </div>

                    {mapping.amountMode === "single" ? (
                      <>
                        <ColSelect
                          label="Amount column"
                          value={mapping.amount}
                          onChange={(v) => set("amount", v)}
                          required
                        />
                        <div className="flex items-center gap-2 pl-39 ml-36">
                          <input
                            type="checkbox"
                            id="invert"
                            checked={mapping.invertAmount}
                            onChange={(e) =>
                              set("invertAmount", e.target.checked)
                            }
                            className="w-4 h-4 accent-blue-500"
                          />
                          <label
                            htmlFor="invert"
                            className="text-sm text-gray-300 cursor-pointer"
                          >
                            Invert amounts (expenses are positive in your file)
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <ColSelect
                          label="Debit column"
                          value={mapping.debit}
                          onChange={(v) => set("debit", v)}
                          required
                        />
                        <ColSelect
                          label="Credit column"
                          value={mapping.credit}
                          onChange={(v) => set("credit", v)}
                          required
                        />
                        <p className="text-xs text-gray-500 pl-36 ml-3">
                          Result = Credit − Debit (income positive, expense negative)
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <ColSelect
                      label="Category"
                      value={mapping.category}
                      onChange={(v) => set("category", v)}
                    />
                    <ColSelect
                      label="Memo / Notes"
                      value={mapping.memo}
                      onChange={(v) => set("memo", v)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Preview */}
              {step === "preview" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      {validCount} row{validCount !== 1 ? "s" : ""} ready to import
                    </span>
                    {parsedRows.length - validCount > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <AlertCircle className="w-4 h-4" />
                        {parsedRows.length - validCount} row
                        {parsedRows.length - validCount !== 1 ? "s" : ""} will be
                        skipped (missing date, payee, or amount)
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                        <tr>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Payee</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {parsedRows.map((row, i) => (
                          <tr
                            key={i}
                            className={
                              row.isValid
                                ? "hover:bg-gray-700/30"
                                : "opacity-50 bg-red-900/10"
                            }
                          >
                            <td className="px-3 py-2 text-gray-300 whitespace-nowrap">
                              {row.date !== null ? (
                                new Date(row.date).toLocaleDateString()
                              ) : (
                                <span className="text-red-400">Invalid</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-white max-w-[180px] truncate">
                              {row.payee || (
                                <span className="text-red-400">Missing</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-gray-400">
                              {row.category || "—"}
                            </td>
                            <td
                              className={`px-3 py-2 text-right font-medium whitespace-nowrap ${
                                row.amount === null
                                  ? "text-red-400"
                                  : row.amount >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {row.amount !== null ? (
                                <>
                                  {row.amount >= 0 ? "+" : ""}$
                                  {Math.abs(row.amount).toFixed(2)}
                                </>
                              ) : (
                                "Invalid"
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.isValid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 shrink-0">
              <button
                onClick={
                  step === "upload"
                    ? close
                    : () => setStep(step === "preview" ? "map" : "upload")
                }
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {step === "upload" ? "Cancel" : "Back"}
              </button>

              {step === "map" && (
                <button
                  onClick={() => setStep("preview")}
                  disabled={!canAdvance}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm"
                >
                  Preview
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === "preview" && (
                <button
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Import {validCount} transaction
                  {validCount !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
