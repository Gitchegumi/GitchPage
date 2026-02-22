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
import { BillItem, DEFAULT_BILL_CATEGORIES } from "./types";

interface Props {
  bills: BillItem[];
  categories: string[];
  onChange: (bills: BillItem[]) => void;
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
  item: BillItem;
  categories: string[];
  onUpdate: (id: string, updates: Partial<BillItem>) => void;
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700 group hover:border-orange-500/50 transition ${item.paid ? "opacity-60" : ""}`}
    >
      {/* Paid checkbox */}
      <input
        type="checkbox"
        checked={item.paid ?? false}
        onChange={(e) => onUpdate(item.id, { paid: e.target.checked })}
        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer accent-orange-500"
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
        placeholder="Bill name"
        className={`flex-1 min-w-0 px-2 py-1 bg-transparent border border-transparent hover:border-gray-600 focus:border-orange-500 rounded text-sm text-white focus:outline-none transition ${item.paid ? "line-through text-gray-500" : ""}`}
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
            className="w-28 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-orange-500"
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
          className="w-32 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300 focus:outline-none focus:border-orange-500"
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

      {/* Amount */}
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
          placeholder="Amount"
          className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-right focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Due By */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-500 whitespace-nowrap">Due</span>
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
          className="w-12 px-1 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white text-center focus:outline-none focus:border-orange-500"
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
  );
}

export default function BillsSection({
  bills,
  categories,
  onChange,
  onAddCategory,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const allCategories = [
    ...DEFAULT_BILL_CATEGORIES,
    ...categories.filter((c) => !DEFAULT_BILL_CATEGORIES.includes(c)),
  ];

  const handleUpdate = (id: string, updates: Partial<BillItem>) => {
    onChange(
      bills.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleRemove = (id: string) => {
    onChange(bills.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: BillItem = {
      id: crypto.randomUUID(),
      name: "",
      category: "",
      monthlyAmount: 0,
      dueBy: null,
      paid: false,
    };
    onChange([newItem, ...bills]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = bills.findIndex((i) => i.id === active.id);
      const newIndex = bills.findIndex((i) => i.id === over.id);
      onChange(arrayMove(bills, oldIndex, newIndex));
    }
  };

  const totalBills = bills.reduce((sum, b) => sum + b.monthlyAmount, 0);
  const unpaidCount = bills.filter((b) => !b.paid).length;
  const unpaidTotal = bills
    .filter((b) => !b.paid)
    .reduce((sum, b) => sum + b.monthlyAmount, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-2xl font-semibold text-orange-300 hover:text-orange-200 transition"
        >
          <span
            className={`text-sm transition-transform ${isCollapsed ? "" : "rotate-90"}`}
          >
            ▶
          </span>
          Bills
          <span className="text-sm font-normal text-gray-400 ml-2">
            (${fmt(totalBills)}/mo)
          </span>
          {unpaidCount > 0 && (
            <span className="text-sm font-normal text-orange-400 ml-2">
              • {unpaidCount} unpaid (${fmt(unpaidTotal)})
            </span>
          )}
          {unpaidCount === 0 && bills.length > 0 && (
            <span className="text-sm font-normal text-green-400 ml-2">
              • All paid ✓
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const sorted = [...bills].sort(
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
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition"
          >
            + Add
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={bills.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {bills.length === 0 ? (
                <p className="text-gray-500 italic text-sm">
                  No bills yet. Click + Add to start.
                </p>
              ) : (
                bills.map((item) => (
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
