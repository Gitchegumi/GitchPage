"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Settings2,
  List,
  Upload,
  Download,
  ArrowUpFromLine,
  Play,
  RotateCcw,
  Trash2,
  FileText,
  Table2,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { loadAccounts } from "@/lib/storage";

// Types
interface DebtItem {
  id: string; // Add id for tracking
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
  dueDay: number;
  creditLimit: number;
}

interface Milestone {
  name: string;
  month: number | string;
  date: string;
  rate: number;
}

interface TimelineSnapshot {
  month: number;
  date: string;
  balances: Record<string, number>;
  payments: Record<string, number>;
  interests: Record<string, number>;
  startingBalances: Record<string, number>;
  plannedPayments: Record<string, number>;
  total: number;
  snowball: number;
}

interface SimulationResult {
  metrics: {
    months: number;
    date: number;
    interest: number;
    total: number;
    budget: number;
    split: string;
  };
  milestones: Milestone[];
  timeline: TimelineSnapshot[];
  debtNames: string[];
  method: "snowball" | "avalanche";
  extra: number;
}

interface OverrideItem {
  paid: boolean;
  amountOverride: number | null;
}

const BUDGET_TO_DEBTPIPE_KEY = "gitchpage-budget-to-debtpipe";
const DEBTPIPE_TO_BUDGET_KEY = "gitchpage-debtpipe-to-budget";

export default function DebtPipe() {
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Settings
  const [startDate, setStartDate] = useState("");
  const [method, setMethod] = useState<"snowball" | "avalanche">("snowball");
  const [extraPayment, setExtraPayment] = useState<number>(500);

  // Data
  const [debtDataStr, setDebtDataStr] = useState("");
  const [debts, setDebts] = useState<DebtItem[]>([]);
  
  // Runtime State
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [interactiveOverrides, setInteractiveOverrides] = useState<Record<string, OverrideItem>>({});
  const [activeTab, setActiveTab] = useState<"milestones" | "timeline">("milestones");
  const [bridgeStatus, setBridgeStatus] = useState({ msg: "", isError: false });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Chart ref
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Initialize from storage
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    setStartDate(now.toISOString().slice(0, 7));

    const savedData = localStorage.getItem("debtpipe_data");
    const savedExtra = localStorage.getItem("debtpipe_extra");
    const savedMethod = localStorage.getItem("debtpipe_method");
    const savedStart = localStorage.getItem("debtpipe_start");
    const savedOverrides = localStorage.getItem("debtpipe_overrides");

    if (savedData) setDebtDataStr(savedData);
    if (savedExtra) setExtraPayment(parseFloat(savedExtra) || 0);
    if (savedMethod) setMethod(savedMethod as "snowball" | "avalanche");
    if (savedStart) setStartDate(savedStart);
    if (savedOverrides) {
      try {
        setInteractiveOverrides(JSON.parse(savedOverrides));
      } catch (e) {}
    }

    const pendingBudgetData = localStorage.getItem(BUDGET_TO_DEBTPIPE_KEY);
    if (pendingBudgetData && pendingBudgetData.trim()) {
      setDebtDataStr(pendingBudgetData);
      localStorage.removeItem(BUDGET_TO_DEBTPIPE_KEY);
    }
    setMounted(true);
  }, []);

  // Sync Debt Data text area with parsed Debts
  useEffect(() => {
    if (!debtDataStr.trim()) {
      setDebts([]);
      return;
    }
    const parsed = debtDataStr
      .trim()
      .split("\n")
      .map((line) => {
        const parts = line.split(",").map((s) => s.trim());
        let rate = parseFloat(parts[2]);
        if (rate < 1 && rate > 0) rate = parseFloat((rate * 100).toFixed(4));
        else rate = parseFloat(rate?.toFixed(4) || "0");
        return {
          id: Math.random().toString(36).substring(7),
          name: parts[0] || "Unknown",
          balance: parseFloat(parts[1]) || 0,
          interestRate: rate || 0,
          minPayment: parseFloat(parts[3]) || 0,
          dueDay: parseInt(parts[4]) || 1,
          creditLimit: parseFloat(parts[5]) || 0,
        };
      })
      .filter((d) => !isNaN(d.balance) && !isNaN(d.minPayment));
    setDebts(parsed);
  }, [debtDataStr]);

  const showStatus = (msg: string, isError: boolean = false) => {
    setBridgeStatus({ msg, isError });
    setTimeout(() => setBridgeStatus({ msg: "", isError: false }), 4000);
  };

  const handleUpdateFromAccountPipe = () => {
    const data = loadAccounts();
    const accountPipeDebts = data.accounts.filter(a => a.mainCategory === 'debt');
    
    if (accountPipeDebts.length === 0) {
      showStatus("⚠ No debt accounts found in AccountPipe.", true);
      return;
    }

    // Try to update existing rows first
    let currentRows = debtDataStr.split('\n').filter(r => r.trim() !== "");
    let updatedCount = 0;

    const newRows = currentRows.map(row => {
      const parts = row.split(',').map(s => s.trim());
      const name = parts[0];
      const matchingAccount = accountPipeDebts.find(a => a.name.toLowerCase() === name.toLowerCase());
      
      if (matchingAccount) {
        updatedCount++;
        // Keep name, update balance, keep others as fallback
        parts[1] = matchingAccount.balance.toString();
        // optionally update interestRate if it's there
        if ((matchingAccount as any).apr) parts[2] = (matchingAccount as any).apr.toString();
        else if ((matchingAccount as any).interestRate) parts[2] = (matchingAccount as any).interestRate.toString();
        
        // update due date if present
        if (matchingAccount.dueDate) {
          parts[4] = matchingAccount.dueDate.toString();
        }

        return parts.join(", ");
      }
      return row;
    });

    if (updatedCount > 0) {
      setDebtDataStr(newRows.join("\n"));
      showStatus(`✓ Updated ${updatedCount} debt balances from AccountPipe!`);
    } else {
      showStatus("⚠ No exact name matches found in AccountPipe.", true);
    }
  };

  const runSimulation = useCallback(() => {
    if (debts.length === 0) return;

    localStorage.setItem("debtpipe_data", debtDataStr);
    localStorage.setItem("debtpipe_extra", extraPayment.toString());
    localStorage.setItem("debtpipe_method", method);
    localStorage.setItem("debtpipe_start", startDate);

    const baseDate = new Date(startDate + "-01T12:00:00");

    const firstHalfMins = debts
      .filter((d) => d.dueDay <= 14)
      .reduce((sum, d) => sum + d.minPayment, 0);
    const secondHalfMins = debts
      .filter((d) => d.dueDay > 14)
      .reduce((sum, d) => sum + d.minPayment, 0);
    const monthlyBudget = extraPayment + firstHalfMins + secondHalfMins;

    const prioritizedDebts = [...debts];
    if (method === "snowball") {
      prioritizedDebts.sort((a, b) => a.balance - b.balance);
    } else {
      prioritizedDebts.sort((a, b) => b.interestRate - a.interestRate);
    }

    let currentMonth = 0;
    let totalInterestPaid = 0;
    const initialPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);

    const timeline: TimelineSnapshot[] = [];
    const milestones: Milestone[] = [];
    let currentDebts = JSON.parse(JSON.stringify(prioritizedDebts)) as DebtItem[];

    while (currentDebts.some((d) => d.balance > 0) && currentMonth < 600) {
      currentMonth++;
      let budget = monthlyBudget;
      const monthDate = new Date(baseDate);
      monthDate.setMonth(baseDate.getMonth() + currentMonth - 1);
      const dateStr = monthDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const snapshot: TimelineSnapshot = {
        month: currentMonth,
        date: dateStr,
        balances: {},
        payments: {},
        interests: {},
        startingBalances: {},
        plannedPayments: {},
        total: 0,
        snowball: 0,
      };

      currentDebts.forEach((d) => {
        snapshot.startingBalances[d.name] = d.balance;
      });

      currentDebts.forEach((d) => {
        let interest = 0;
        if (d.balance > 0) {
          interest = d.balance * (d.interestRate / 100 / 12);
          totalInterestPaid += interest;
          d.balance += interest;
        }
        snapshot.interests[d.name] = interest;
      });

      currentDebts.forEach((d) => {
        let paid = 0;
        if (d.balance > 0) {
          paid = Math.min(d.balance, d.minPayment);
          d.balance -= paid;
          budget -= paid;
        }
        snapshot.payments[d.name] = paid;
      });

      snapshot.snowball = budget;

      for (let d of currentDebts) {
        if (d.balance > 0 && budget > 0) {
          const extra = Math.min(d.balance, budget);
          d.balance -= extra;
          budget -= extra;
          snapshot.payments[d.name] += extra;
        }
        snapshot.plannedPayments[d.name] = snapshot.payments[d.name];
        snapshot.balances[d.name] = d.balance;
        snapshot.total += d.balance;
        
        if (d.balance <= 0 && !milestones.find((m) => m.name === d.name)) {
          milestones.push({
            name: d.name,
            month: currentMonth,
            date: dateStr,
            rate: d.interestRate,
          });
        }
      }
      timeline.push(snapshot);
    }

    const newResult: SimulationResult = {
      metrics: {
        months: currentMonth,
        date: new Date(baseDate).setMonth(baseDate.getMonth() + currentMonth - 1),
        interest: totalInterestPaid,
        total: initialPrincipal + totalInterestPaid,
        budget: monthlyBudget,
        split: `1-14th: $${(extraPayment + firstHalfMins).toLocaleString()} | 15th+: $${secondHalfMins.toLocaleString()}`,
      },
      milestones,
      timeline: timeline,
      debtNames: prioritizedDebts.map((d) => d.name),
      method,
      extra: extraPayment,
    };

    setResult(newResult);
  }, [debts, debtDataStr, extraPayment, method, startDate]);

  // Chart Rendering Effect
  useEffect(() => {
    if (!result || !chartRef.current || !isClient) return;

    // We only import Chart.js on client
    import('chart.js/auto').then((ChartModule) => {
      const Chart = ChartModule.default;
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const timelineToUse = replayWithOverrides().timeline;

      chartInstance.current = new Chart(chartRef.current as any, {
        type: "line",
        data: {
          labels: timelineToUse.map((d) => d.date),
          datasets: [
            {
              label: "Total Debt",
              data: timelineToUse.map((d) => d.total),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: {
                color: "#64748b",
                callback: (v: number | string) => "$" + v.toLocaleString(),
              },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#64748b", autoSkip: true, maxTicksLimit: 12 },
            },
          },
          plugins: { legend: { display: false } },
        },
      });
    });
  }, [result, isClient, interactiveOverrides]);

  const replayWithOverrides = useCallback(() => {
    if (!result) return { timeline: [], milestones: [] };

    let currentDebts = debts.slice();
    if (result.method === "snowball") {
      currentDebts.sort((a, b) => a.balance - b.balance);
    } else {
      currentDebts.sort((a, b) => b.interestRate - a.interestRate);
    }
    
    // Deep clone array to mutate securely
    currentDebts = JSON.parse(JSON.stringify(currentDebts));

    const timeline: TimelineSnapshot[] = [];
    const milestones: Milestone[] = [];
    const monthlyBudget = result.metrics.budget;

    for (let monthIdx = 0; monthIdx < 600; monthIdx++) {
      if (!currentDebts.some((d) => d.balance > 0)) break;

      const baseDateStr = monthIdx < result.timeline.length
        ? result.timeline[monthIdx].date
        : (() => {
            const d = new Date(startDate + "-01T12:00:00");
            d.setMonth(d.getMonth() + monthIdx);
            return d.toLocaleString("default", { month: "short", year: "numeric" });
          })();

      let budget = monthlyBudget;
      const snapshot: TimelineSnapshot = {
        month: monthIdx + 1,
        date: baseDateStr,
        balances: {},
        payments: {},
        interests: {},
        startingBalances: {},
        plannedPayments: {},
        total: 0,
        snowball: 0,
      };

      currentDebts.forEach((d) => {
        snapshot.startingBalances[d.name] = d.balance;
      });

      currentDebts.forEach((d) => {
        let interest = 0;
        if (d.balance > 0) {
          interest = d.balance * (d.interestRate / 100 / 12);
          d.balance += interest;
        }
        snapshot.interests[d.name] = interest;
      });

      currentDebts.forEach((d) => {
        let paid = 0;
        if (d.balance > 0) {
          paid = Math.min(d.balance, d.minPayment);
          d.balance -= paid;
          budget -= paid;
        }
        snapshot.payments[d.name] = paid;
      });

      snapshot.snowball = budget;

      for (let d of currentDebts) {
        if (d.balance > 0 && budget > 0) {
          const extra = Math.min(d.balance, budget);
          d.balance -= extra;
          budget -= extra;
          snapshot.payments[d.name] += extra;
        }
        snapshot.plannedPayments[d.name] = snapshot.payments[d.name];
      }

      currentDebts.forEach((d) => {
        const key = `${d.name}|${monthIdx}`;
        const ov = interactiveOverrides[key];
        if (ov && ov.amountOverride != null && ov.amountOverride > 0) {
          const planned = snapshot.payments[d.name];
          d.balance += planned;
          const actual = Math.min(d.balance, ov.amountOverride);
          d.balance -= actual;
          snapshot.payments[d.name] = actual;
        }

        snapshot.balances[d.name] = d.balance;
        snapshot.total += d.balance;
        if (d.balance <= 0 && !milestones.find((m) => m.name === d.name)) {
          milestones.push({
            name: d.name,
            month: monthIdx + 1,
            date: baseDateStr,
            rate: d.interestRate,
          });
        }
      });

      timeline.push(snapshot);
    }

    return { timeline, milestones };
  }, [result, debts, interactiveOverrides, startDate]);


  const handleTogglePaid = (debtName: string, monthIdx: number, checked: boolean) => {
    const key = `${debtName}|${monthIdx}`;
    setInteractiveOverrides(prev => {
      const next = { ...prev };
      if (checked) {
        if (!next[key]) next[key] = { paid: false, amountOverride: null };
        next[key].paid = true;
      } else {
        if (next[key]) {
          next[key].paid = false;
          if (next[key].amountOverride == null || next[key].amountOverride <= 0) {
            delete next[key];
          }
        }
      }
      localStorage.setItem("debtpipe_overrides", JSON.stringify(next));
      return next;
    });
  };

  const handleOverrideAmount = (debtName: string, monthIdx: number, value: number) => {
    const key = `${debtName}|${monthIdx}`;
    setInteractiveOverrides(prev => {
      const next = { ...prev };
      if (value > 0) {
        if (!next[key]) next[key] = { paid: true, amountOverride: null };
        next[key].amountOverride = value;
        next[key].paid = true; // Auto mark paid if amount altered
      } else {
        if (next[key]) {
          next[key].amountOverride = null;
          if (!next[key].paid) delete next[key];
        }
      }
      localStorage.setItem("debtpipe_overrides", JSON.stringify(next));
      return next;
    });
  };

  const resetOverrides = () => {
    if (confirm("Reset all payment overrides?")) {
      setInteractiveOverrides({});
      localStorage.removeItem("debtpipe_overrides");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const cleanData = text.split(/\r?\n/).filter(r => r.trim()).map((r) => {
          const separator = r.includes("\t") ? "\t" : ",";
          return r.split(separator).map((cell) => cell.trim().replace(/[$,]/g, "")).join(", ");
        }).join("\n");
      setDebtDataStr(cleanData);
      setTimeout(runSimulation, 50); // Small delay to let state settle
    };
    reader.readAsText(file);
  };

  const sendToBudget = () => {
    if (!result) {
      showStatus("⚠ Run the simulation first.", true);
      return;
    }
    const payload = debts.map((d) => ({
      name: d.name,
      minPayment: d.minPayment,
      balance: d.balance,
      interestRate: d.interestRate,
      dueDay: d.dueDay,
      creditLimit: d.creditLimit || 0,
    }));
    localStorage.setItem(DEBTPIPE_TO_BUDGET_KEY, JSON.stringify(payload));
    window.location.href = "/budget"; // Direct redirect instead of blank to avoid popup blockers and UI confusion
  };

  const clearData = () => {
    if (confirm("Clear all data and reset?")) {
      setDebtDataStr("");
      setDebts([]);
      setResult(null);
      setInteractiveOverrides({});
      localStorage.removeItem("debtpipe_data");
      localStorage.removeItem("debtpipe_extra");
      localStorage.removeItem("debtpipe_method");
      localStorage.removeItem("debtpipe_start");
      localStorage.removeItem("debtpipe_overrides");
    }
  };

  if (!mounted) return null;

  const activeTimeline = replayWithOverrides().timeline;
  const milestonesToRender = replayWithOverrides().milestones;
  
  const payoffOrderNames = milestonesToRender.map(m => m.name);
  const remainingDebts = debts.filter(d => !payoffOrderNames.includes(d.name));
  const combinedMilestones: Milestone[] = [
    ...milestonesToRender,
    ...remainingDebts.map(d => ({ name: d.name, month: "--", date: "--", rate: d.interestRate }))
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-1 space-y-6">
          <section className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
              <Settings2 className="w-4 h-4" /> Settings
            </h2>
            <div className="space-y-4 text-sm font-medium text-slate-300">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Start Date</label>
                <input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 outline-none transition-all focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 outline-none transition-all focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="snowball">Snowball (Smallest First)</option>
                  <option value="avalanche">Avalanche (Highest Rate First)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Extra Monthly Payment ($)</label>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 outline-none transition-all text-emerald-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <button
                  onClick={resetOverrides}
                  className="w-full bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Overrides
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
              <List className="w-4 h-4" /> Debt Data
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById("csvUpload")?.click()}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2.5 flex items-center justify-center gap-2 transition-all text-xs font-bold text-white group"
                >
                  <Upload className="w-4 h-4 group-hover:text-emerald-400" /> Upload
                </button>
                <button 
                  onClick={handleUpdateFromAccountPipe}
                  className="flex-[2] bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2 transition-all text-xs font-bold text-blue-300"
                >
                  Update from AccountPipe
                </button>
              </div>
              <input type="file" id="csvUpload" accept=".csv" className="hidden" onChange={handleFileUpload} />

              <div className="flex gap-2">
                <button
                  onClick={sendToBudget}
                  className="flex-1 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2 transition-all text-xs font-bold text-emerald-300"
                >
                  <ArrowUpFromLine className="w-4 h-4" /> Send to SpendPipe
                </button>
              </div>
              {bridgeStatus.msg && (
                <div className={`text-xs ${bridgeStatus.isError ? "text-rose-400" : "text-emerald-400"} min-h-[1rem]`}>
                  {bridgeStatus.msg}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Manual Entry Format</label>
                  <span className="text-[9px] text-slate-600 italic">Name, Bal, Rate, Min, [Day], [Limit]</span>
                </div>
                <textarea
                  rows={10}
                  value={debtDataStr}
                  onChange={(e) => setDebtDataStr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-xs focus:ring-2 outline-none transition-all text-white focus:ring-emerald-500"
                  placeholder="Name, Balance, Rate, Min, [DueDay], [Limit]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={runSimulation}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <Play className="w-4 h-4 fill-current" /> Run
                </button>
                
                {/* Export menu simple logic */}
                <div className="relative">
                  <button onClick={() => setShowExportMenu(!showExportMenu)} className="bg-slate-800 hover:bg-slate-600 text-white font-bold p-3.5 rounded-xl transition-all flex items-center justify-center border border-slate-700">
                    <Download className="w-4 h-4 text-emerald-400" />
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                       <button onClick={() => {
                           if (!result) return alert("Run simulation first.");
                           const blob = new Blob([debtDataStr], { type: "text/csv" });
                           const a = document.createElement("a");
                           a.href = URL.createObjectURL(blob);
                           a.download = "debtpipe_debts.csv";
                           a.click();
                           setShowExportMenu(false);
                       }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-700 text-slate-300 transition text-left">
                         <FileText className="w-3.5 h-3.5 text-blue-400" /> Input Data CSV
                       </button>
                    </div>
                  )}
                </div>

                <button onClick={clearData} className="bg-slate-800 hover:bg-rose-900/30 text-rose-500 p-3.5 rounded-xl transition-all border border-slate-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-3 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border-l-4 border-emerald-500 border-y border-r border-white/5">
              <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Time to Freedom</div>
              <div className="text-2xl font-bold text-white">{result ? `${result.metrics.months} Months` : '0 Months'}</div>
              <div className="text-xs text-slate-400">
                Payoff Date: {result ? new Date(result.metrics.date).toLocaleString("default", { month: "long", year: "numeric" }) : '--'}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border-l-4 border-amber-500 border-y border-r border-white/5">
              <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Total Interest</div>
              <div className="text-2xl font-bold text-amber-400">${result ? result.metrics.interest.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}</div>
              <div className="text-xs text-slate-400">Paid to banks</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border-l-4 border-rose-500 border-y border-r border-white/5">
              <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Total Cost</div>
              <div className="text-2xl font-bold text-rose-400">${result ? result.metrics.total.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}</div>
              <div className="text-xs text-slate-400">Principal + Interest</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border-l-4 border-blue-500 border-y border-r border-white/5">
              <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Monthly Flow</div>
              <div className="text-2xl font-bold text-blue-400">${result ? result.metrics.budget.toLocaleString() : '0.00'}</div>
              <div className="text-[10px] text-slate-400">Split: {result ? result.metrics.split : '--'}</div>
            </div>
          </div>

          <section className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 h-[350px]">
            <canvas ref={chartRef}></canvas>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
             <div className="border-b border-slate-700/50 flex bg-slate-800/30">
               <button
                 onClick={() => setActiveTab("milestones")}
                 className={`p-4 px-6 text-sm font-bold transition-all ${activeTab === "milestones" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-slate-400 hover:text-white"}`}
               >
                 Milestones
               </button>
               <button
                 onClick={() => setActiveTab("timeline")}
                 className={`p-4 px-6 text-sm font-bold transition-all ${activeTab === "timeline" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-slate-400 hover:text-white"}`}
               >
                 Full Timeline View
               </button>
             </div>

             {/* Milestones */}
             {activeTab === "milestones" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-700">
                      <tr>
                        <th className="p-4">Payoff Order</th>
                        <th className="p-4">Debt Name</th>
                        <th className="p-4 text-center">Interest Rate</th>
                        <th className="p-4 text-center">Month #</th>
                        <th className="p-4 text-right">Target Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-slate-300 text-center">
                      {combinedMilestones.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-slate-500 font-mono text-left">#{i + 1}</td>
                          <td className="p-4 font-bold text-white text-left">{m.name}</td>
                          <td className="p-4 text-slate-400 font-medium">{typeof m.rate === 'number' ? m.rate.toFixed(2) : m.rate}%</td>
                          <td className="p-4 font-medium">{m.month}</td>
                          <td className="p-4 text-right text-emerald-400 font-extrabold">{m.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}

             {/* Timeline */}
             {activeTab === "timeline" && result && (
               <div className="overflow-auto max-h-[600px] timeline-scrollbar relative">
                 <table className="w-full text-left text-xs border-collapse">
                   <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-widest sticky top-0 z-20 text-center">
                     <tr>
                       <th className="p-3 bg-slate-800 sticky left-0 z-30 min-w-[150px] border-b border-r border-slate-600">Debt Name</th>
                       {activeTimeline.map((step, monthIdx) => {
                         let unpaidSum = 0;
                         result.debtNames.forEach(name => {
                           const ov = interactiveOverrides[`${name}|${monthIdx}`];
                           if (!ov?.paid) unpaidSum += step.payments[name] || 0;
                         });
                         const showFlow = Math.abs(unpaidSum - result.metrics.budget) >= 0.01;
                         const snowball = step.snowball;
                         const snowballGrew = snowball > result.extra + 0.01;

                         return (
                           <th key={monthIdx} className="p-3 text-center border-l border-slate-700/50 min-w-[130px] border-b border-slate-600 bg-slate-800">
                             <div className="inline-flex items-center gap-1 justify-center mb-1">
                               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${snowballGrew ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}`}>
                                 ❄ ${snowball.toFixed(0)}
                               </span>
                             </div>
                             <div>{step.date}</div>
                             {showFlow && <div className="text-[9px] text-blue-400 font-semibold mt-0.5">Flow: ${unpaidSum.toFixed(2)}</div>}
                           </th>
                         );
                       })}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50 text-slate-400 text-center bg-slate-900/50">
                     {result.debtNames.map(name => (
                       <tr key={name} className="hover:bg-slate-800/40 group">
                         <td className="p-3 font-bold text-slate-200 sticky left-0 z-10 bg-slate-800 group-hover:bg-slate-700/90 transition-colors border-b border-r border-slate-700/30 text-left">
                           {name}
                         </td>
                         {activeTimeline.map((step, monthIdx) => {
                            const start = step.startingBalances[name] || 0;
                            const bal = step.balances[name];
                            const paid = step.payments[name];
                            const planned = step.plannedPayments[name] || 0;
                            const interest = step.interests[name];
                            
                            const ov = interactiveOverrides[`${name}|${monthIdx}`];
                            const isPaidToggled = ov?.paid;
                            const isActive = start > 0 || paid > 0 || interest > 0 || bal > 0;
                            const isZero = bal <= 0 && ((monthIdx === 0) || (activeTimeline[monthIdx-1]?.balances[name] > 0));

                            if (!isActive && bal <= 0 && !ov) {
                              return <td key={monthIdx} className="p-3 text-center border-l border-slate-700/30 border-b border-slate-700/30 text-slate-600">—</td>
                            }

                            return (
                              <td key={monthIdx} className={`p-3 text-center border-l border-slate-700/30 border-b border-slate-700/30 relative pt-5 ${isPaidToggled ? 'bg-[#057b9614]' : ''} ${isZero ? 'bg-emerald-900/20' : ''}`}>
                                {isActive && (
                                  <input 
                                    type="checkbox" 
                                    checked={!!isPaidToggled} 
                                    onChange={(e) => handleTogglePaid(name, monthIdx, e.target.checked)}
                                    className="absolute top-1 right-1 accent-[#053396] cursor-pointer"
                                  />
                                )}
                                <div className={start > 0 && start !== bal ? "text-slate-500 text-[9px] mb-1" : "hidden"}>
                                  Start ${start.toFixed(2)}
                                </div>
                                {interest > 0 && <div className="text-[9px] text-rose-500/80 font-medium italic">Int. ${interest.toFixed(2)}</div>}
                                {isActive && (
                                  <div className="text-[10px] text-emerald-400 font-bold mt-1">
                                    <input 
                                      type="number"
                                      className="w-16 bg-transparent border-b border-transparent hover:border-emerald-500/50 focus:border-emerald-500 focus:bg-slate-800 text-center outline-none transition-all"
                                      value={ov?.amountOverride !== null ? ov?.amountOverride ?? '' : ''}
                                      placeholder={`Pay $${(paid || planned || 0).toFixed(2)}`}
                                      onChange={(e) => handleOverrideAmount(name, monthIdx, parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                )}
                                <div className={bal <= 0 ? "text-emerald-500 font-bold text-[11px] mt-1" : "text-slate-300 text-[11px] mt-1"}>
                                  {bal <= 0 ? "PAID OFF!" : "$" + bal.toFixed(2)}
                                </div>
                              </td>
                            )
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </section>

        </div>
      </div>
{/* 
      <style jsx global>{`
        .timeline-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .timeline-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .timeline-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .timeline-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
      */}
    </div>
  );
}

