"use client";

import { useState } from "react";
import { ExpenseCategory } from "./types";

const DEFAULT_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

const CATEGORIES = [
  "Housing",
  "Utilities",
  "Food",
  "Transportation",
  "Insurance",
  "Healthcare",
  "Subscriptions",
  "Entertainment",
  "Debt Payments",
  "Savings",
  "Other",
];

interface Props {
  expenses: ExpenseCategory[];
  onAdd: (category: Omit<ExpenseCategory, "id">) => void;
  onUpdate: (id: string, updates: Partial<ExpenseCategory>) => void;
  onRemove: (id: string) => void;
}

export default function ExpenseSection({
  expenses,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<ExpenseCategory, "id">>({
    name: "",
    budgeted: 0,
    actual: 0,
    color: DEFAULT_COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      onAdd({
        ...newCategory,
        budgeted: newCategory.budgeted || 0,
        actual: newCategory.actual || 0,
      });
      setNewCategory({
        name: "",
        budgeted: 0,
        actual: 0,
        color: DEFAULT_COLORS[expenses.length % DEFAULT_COLORS.length],
      });
      setShowForm(false);
    }
  };

  const handleUpdate = (
    id: string,
    field: "name" | "budgeted" | "actual",
    value: string | number
  ) => {
    onUpdate(id, {
      [field]: field === "name" ? value : Number(value) || 0,
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-300">Expense Categories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category Name</label>
            <select
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Custom">Custom...</option>
            </select>
            {newCategory.name === "Custom" && (
              <input
                type="text"
                placeholder="Custom category name"
                className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Budgeted ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newCategory.budgeted || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    budgeted: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Actual ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newCategory.actual || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    actual: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newCategory.color === color
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
          >
            Add Category
          </button>
        </form>
      )}

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-gray-500 italic">No expense categories added yet.</p>
        ) : (
          expenses.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 group hover:border-purple-500/50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-white">{cat.name}</span>
                </div>
                <button
                  onClick={() => onRemove(cat.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Budgeted</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cat.budgeted}
                    onChange={(e) => handleUpdate(cat.id, "budgeted", e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Actual</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cat.actual}
                    onChange={(e) => handleUpdate(cat.id, "actual", e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="mt-2 text-sm">
                <span className={`font-medium ${cat.actual > cat.budgeted ? "text-red-400" : "text-green-400"}`}>
                  {cat.actual > cat.budgeted ? "Over" : "Under"} by $
                  {Math.abs(cat.actual - cat.budgeted).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
