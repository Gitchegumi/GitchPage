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
  IncomeItem,
  IncomeFrequency,
  FREQUENCY_LABELS,
  computeMonthlyAmount,
} from "./types";

interface Props {
  incomes: IncomeItem[];
  weeksInMonth: number;
  onChange: (incomes: IncomeItem[]) => void;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function SortableRow({
  item,
  weeksInMonth,
  onUpdate,
  onRemove,
}: {
  item: IncomeItem;
  weeksInMonth: number;
  onUpdate: (id: string, updates: Partial<IncomeItem>) => void;
  onRemove: (id: string) => void;
}) {
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

  const amounts = item.amounts ?? [0];

  const handleFrequencyChange = (freq: IncomeFrequency) => {
    const newAmounts =
      freq === "1st-and-15th"
        ? [amounts[0] || 0, amounts[1] || 0]
        : [amounts[0] || 0];
    const monthly = computeMonthlyAmount(freq, newAmounts, weeksInMonth);
    // Clear payDate if not monthly
    const payDate = freq === "monthly" ? item.payDate : null;
    onUpdate(item.id, {
      frequency: freq,
      amounts: newAmounts,
      monthlyAmount: monthly,
      payDate,
    });
  };

  const handleAmountChange = (index: number, value: string) => {
    const newAmounts = [...amounts];
    newAmounts[index] = parseFloat(value) || 0;
    const monthly = computeMonthlyAmount(
      item.frequency,
      newAmounts,
      weeksInMonth,
    );
    onUpdate(item.id, { amounts: newAmounts, monthlyAmount: monthly });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700 group hover:border-blue-500/50 transition"
    >
      {/* Drag handle */}
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
        placeholder="Income name"
        className="flex-1 min-w-0 px-2 py-1 bg-transparent border border-transparent hover:border-gray-600 focus:border-blue-500 rounded text-sm text-white focus:outline-none transition"
      />

      {/* Frequency */}
      <select
        value={item.frequency}
        onChange={(e) =>
          handleFrequencyChange(e.target.value as IncomeFrequency)
        }
        className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300 focus:outline-none focus:border-blue-500"
      >
        {(Object.keys(FREQUENCY_LABELS) as IncomeFrequency[]).map((freq) => (
          <option key={freq} value={freq}>
            {FREQUENCY_LABELS[freq]}
          </option>
        ))}
      </select>

      {/* Pay Date — only for monthly income */}
      {item.frequency === "monthly" && (
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            Pay day
          </span>
          <input
            type="number"
            min="1"
            max="31"
            value={item.payDate ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(item.id, {
                payDate:
                  val === ""
                    ? null
                    : Math.min(31, Math.max(1, parseInt(val) || 1)),
              });
            }}
            placeholder="—"
            className="w-12 px-1 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-center focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Amount(s) */}
      <div className="flex items-center gap-1">
        {item.frequency === "1st-and-15th" ? (
          <div className="flex flex-col gap-1">
            <input
              type="number"
              min="0"
              step="0.01"
              value={amounts[0] || ""}
              onChange={(e) => handleAmountChange(0, e.target.value)}
              placeholder="1st"
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={amounts[1] || ""}
              onChange={(e) => handleAmountChange(1, e.target.value)}
              placeholder="15th"
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <input
            type="number"
            min="0"
            step="0.01"
            value={amounts[0] || ""}
            onChange={(e) => handleAmountChange(0, e.target.value)}
            placeholder="Amount"
            className="w-28 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Monthly total */}
      <div className="w-28 text-right text-sm font-semibold text-green-400 tabular-nums">
        ${fmt(item.monthlyAmount)}
        <div className="text-[10px] text-gray-500 font-normal">/ month</div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition p-1"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}

export default function IncomeSection({
  incomes,
  weeksInMonth,
  onChange,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleUpdate = (id: string, updates: Partial<IncomeItem>) => {
    onChange(
      incomes.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleRemove = (id: string) => {
    onChange(incomes.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: IncomeItem = {
      id: crypto.randomUUID(),
      name: "",
      frequency: "monthly",
      amounts: [0],
      monthlyAmount: 0,
      payDate: 1,
    };
    onChange([newItem, ...incomes]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = incomes.findIndex((i) => i.id === active.id);
      const newIndex = incomes.findIndex((i) => i.id === over.id);
      onChange(arrayMove(incomes, oldIndex, newIndex));
    }
  };

  const total = incomes.reduce((sum, i) => sum + i.monthlyAmount, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-2xl font-semibold text-blue-300 hover:text-blue-200 transition"
        >
          <span
            className={`text-sm transition-transform ${isCollapsed ? "" : "rotate-90"}`}
          >
            ▶
          </span>
          Income
          <span className="text-sm font-normal text-gray-400 ml-2">
            (${fmt(total)}/mo)
          </span>
        </button>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
        >
          + Add
        </button>
      </div>

      {!isCollapsed && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={incomes.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {incomes.length === 0 ? (
                <p className="text-gray-500 italic text-sm">
                  No income items yet. Click + Add to start.
                </p>
              ) : (
                incomes.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    weeksInMonth={weeksInMonth}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
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
