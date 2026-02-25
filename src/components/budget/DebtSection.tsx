"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DebtItem,
  DEFAULT_DEBT_CATEGORIES,
  BUDGET_TO_DEBTPIPE_KEY,
} from "./types";

interface Props {
  debts: DebtItem[];
  categories: string[];
  onChange: (debts: DebtItem[]) => void;
  onAddCategory: (category: string) => void;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function SortableRow({
  item,
  categories,
  onUpdate,
  onRemove,
  onAddCategory,
}: {
  item: DebtItem;
  categories: string[];
  onUpdate: (id: string, updates: Partial<DebtItem>) => void;
  onRemove: (id: string) => void;
  onAddCategory: (category: string) => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCategoryChange = (value: string) => {
    if (value === "__custom__") {
      setShowCustom(true);
    } else {
      onUpdate(item.id, { category: value });
      setShowCustom(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onAddCategory(customValue.trim());
      onUpdate(item.id, { category: customValue.trim() });
      setCustomValue("");
      setShowCustom(false);
    }
  };

  const isCreditCard = item.category === "Credit Card";
  const creditLimit = item.availableCredit ?? 0;
  const balance = item.balance ?? 0;
  const thirtyPctLevel = creditLimit * 0.3;
  const fiftyPctLevel = creditLimit * 0.5;
  const utilizationPct = creditLimit > 0 ? (balance / creditLimit) * 100 : 0;
  const isOver50 = creditLimit > 0 && balance > fiftyPctLevel;
  const isOver30 = creditLimit > 0 && balance > thirtyPctLevel;
  const paydownTo50 = balance > fiftyPctLevel ? balance - fiftyPctLevel : 0;
  const paydownTo30 = balance > thirtyPctLevel ? balance - thirtyPctLevel : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-900/50 rounded-lg border border-gray-700 group hover:border-red-500/50 transition ${item.paid ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-2 p-3">
        {/* Paid checkbox */}
        <input
          type="checkbox"
          checked={item.paid ?? false}
          onChange={(e) => onUpdate(item.id, { paid: e.target.checked })}
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer accent-red-500"
          title={item.paid ? "Mark unpaid" : "Mark paid"}
        />

        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1 touch-none"
          title="Drag to reorder"
        >
          ☰
        </button>

        {/* Name */}
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
          placeholder="Debt name"
          className={`flex-1 min-w-0 px-2 py-1 bg-transparent border border-transparent hover:border-gray-600 focus:border-red-500 rounded text-sm text-white focus:outline-none transition ${item.paid ? "line-through text-gray-500" : ""}`}
        />

        {/* Category dropdown */}
        {showCustom ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
              placeholder="New category"
              className="w-28 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-red-500"
              autoFocus
            />
            <button
              onClick={handleCustomSubmit}
              className="text-green-400 text-sm px-1"
            >
              ✓
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="text-gray-400 text-sm px-1"
            >
              ✕
            </button>
          </div>
        ) : (
          <select
            value={item.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-28 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300 focus:outline-none focus:border-red-500"
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__custom__">+ Custom...</option>
          </select>
        )}

        {/* Monthly Payment */}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-1">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.monthlyAmount || ""}
            onChange={(e) =>
              onUpdate(item.id, {
                monthlyAmount: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Payment"
            className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Balance */}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-1">Bal</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.balance ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(item.id, {
                balance: val === "" ? null : parseFloat(val) || 0,
              });
            }}
            placeholder="—"
            className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Interest Rate (APR %) */}
        <div className="flex items-center">
          <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">
            APR%
          </span>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={item.interestRate ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                onUpdate(item.id, { interestRate: null });
              } else {
                let rate = parseFloat(val);
                if (!isNaN(rate)) {
                  // Auto-convert decimal entry (e.g. 0.2624 → 26.24)
                  if (rate > 0 && rate < 1) rate = rate * 100;
                  rate = parseFloat(rate.toFixed(4));
                }
                onUpdate(item.id, { interestRate: isNaN(rate) ? 0 : rate });
              }
            }}
            placeholder="—"
            className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Available Credit — only for Credit Card */}
        {isCreditCard && (
          <div className="flex items-center">
            <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">
              Limit
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.availableCredit ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                onUpdate(item.id, {
                  availableCredit: val === "" ? null : parseFloat(val) || 0,
                });
              }}
              placeholder="—"
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-red-500"
            />
          </div>
        )}

        {/* Due By */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            Due
          </span>
          <input
            type="number"
            min="1"
            max="31"
            value={item.dueBy ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(item.id, {
                dueBy:
                  val === ""
                    ? null
                    : Math.min(31, Math.max(1, parseInt(val) || 1)),
              });
            }}
            placeholder="—"
            className="w-12 px-1 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-center focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition p-1"
          title="Remove"
        >
          ✕
        </button>
      </div>

      {isCreditCard && creditLimit > 0 && (
        <div className="px-3 pb-3 pt-0">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">
                Utilization:{" "}
                <span
                  className={
                    isOver50
                      ? "text-red-400 font-semibold"
                      : isOver30
                        ? "text-yellow-400 font-semibold"
                        : "text-green-400 font-semibold"
                  }
                >
                  {utilizationPct.toFixed(1)}%
                </span>
              </span>
              <span className="text-gray-500">
                30%: ${fmt(thirtyPctLevel)} &nbsp;·&nbsp; 50%: $
                {fmt(fiftyPctLevel)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              {/* 30% marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-green-400/70 z-10"
                style={{ left: "30%" }}
                title="30% threshold"
              />
              {/* 50% marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10 shadow-[0_0_4px_rgba(250,204,21,0.8)]"
                style={{ left: "50%" }}
                title="50% threshold"
              />
              {/* Usage bar */}
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOver50
                    ? "bg-gradient-to-r from-red-600 to-red-400"
                    : isOver30
                      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                      : "bg-gradient-to-r from-green-500 to-emerald-400"
                }`}
                style={{ width: `${Math.min(utilizationPct, 100)}%` }}
              />
            </div>
            {/* Pay-down targets — always shown when there's a balance */}
            {balance > 0 && (
              <div className="mt-2 space-y-1 text-xs">
                <div className={isOver50 ? "text-red-400" : "text-gray-500"}>
                  {isOver50 ? "⚠" : "·"}{" "}
                  <span className="font-bold">${fmt(paydownTo50)}</span> to get
                  under 50%
                  {!isOver50 && " — already there ✓"}
                </div>
                <div className={isOver30 ? "text-amber-400" : "text-gray-500"}>
                  {isOver30 ? "💡" : "·"}{" "}
                  <span className="font-bold">${fmt(paydownTo30)}</span> to get
                  under 30%
                  {!isOver30 && " — already there ✓"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DebtSection({
  debts,
  categories,
  onChange,
  onAddCategory,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setBridgeStatus(msg);
    setTimeout(() => setBridgeStatus(null), 3000);
  };

  const handleSendToDebtPipe = () => {
    if (debts.length === 0) {
      showStatus("⚠ No debts to send.");
      return;
    }
    const csv = debts
      .map((d) =>
        [
          d.name || "Unnamed",
          d.balance ?? 0,
          d.interestRate != null ? parseFloat(d.interestRate.toFixed(4)) : 0,
          d.monthlyAmount,
          d.dueBy ?? 1,
          d.availableCredit ?? "",
        ].join(", "),
      )
      .join("\n");
    localStorage.setItem(BUDGET_TO_DEBTPIPE_KEY, csv);
    window.open("/debtpipe/", "_blank");
  };
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const allCategories = [
    ...DEFAULT_DEBT_CATEGORIES,
    ...categories.filter((c) => !DEFAULT_DEBT_CATEGORIES.includes(c)),
  ];

  const handleUpdate = (id: string, updates: Partial<DebtItem>) => {
    onChange(
      debts.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleRemove = (id: string) => {
    onChange(debts.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: DebtItem = {
      id: crypto.randomUUID(),
      name: "",
      category: "",
      monthlyAmount: 0,
      balance: null,
      interestRate: null,
      dueBy: null,
      availableCredit: null,
      paid: false,
    };
    onChange([newItem, ...debts]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = debts.findIndex((i) => i.id === active.id);
      const newIndex = debts.findIndex((i) => i.id === over.id);
      onChange(arrayMove(debts, oldIndex, newIndex));
    }
  };

  const totalPayments = debts.reduce((sum, d) => sum + d.monthlyAmount, 0);
  const totalBalance = debts.reduce((sum, d) => sum + (d.balance ?? 0), 0);
  const unpaidCount = debts.filter((d) => !d.paid).length;
  const unpaidTotal = debts
    .filter((d) => !d.paid)
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-2xl font-semibold text-red-300 hover:text-red-200 transition"
        >
          <span
            className={`text-sm transition-transform ${isCollapsed ? "" : "rotate-90"}`}
          >
            ▶
          </span>
          Debts
          <span className="text-sm font-normal text-gray-400 ml-2">
            (${fmt(totalPayments)}/mo • ${fmt(totalBalance)} bal)
          </span>
          {unpaidCount > 0 && (
            <span className="text-sm font-normal text-red-400 ml-2">
              • {unpaidCount} unpaid (${fmt(unpaidTotal)})
            </span>
          )}
          {unpaidCount === 0 && debts.length > 0 && (
            <span className="text-sm font-normal text-green-400 ml-2">
              • All paid ✓
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSendToDebtPipe}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-medium transition"
            title="Send debt list to DebtPipe and open it"
          >
            Send to DebtPipe ↗
          </button>
          <button
            onClick={() => {
              const sorted = [...debts].sort(
                (a, b) => (a.dueBy ?? 32) - (b.dueBy ?? 32),
              );
              onChange(sorted);
            }}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition"
            title="Sort items by due date"
          >
            Sort by Due
          </button>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Bridge status message */}
      {bridgeStatus && (
        <div className="text-xs text-emerald-400 px-1 -mt-2 mb-1 transition-opacity">
          {bridgeStatus}
        </div>
      )}

      {!isCollapsed && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={debts.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {debts.length === 0 ? (
                <p className="text-gray-500 italic text-sm">
                  No debts yet. Click + Add to start.
                </p>
              ) : (
                debts.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    categories={allCategories}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                    onAddCategory={onAddCategory}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
