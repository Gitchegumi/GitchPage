"use client";

import { useState } from "react";
import { IncomeSource, Frequency } from "./types";

const FREQUENCY_OPTIONS: Frequency[] = [
  "monthly",
  "biweekly",
  "weekly",
  "irregular",
];

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Rental",
  "Side Hustle",
  "Other",
];

interface Props {
  incomes: IncomeSource[];
  onAdd: (income: Omit<IncomeSource, "id">) => void;
  onUpdate: (id: string, updates: Partial<IncomeSource>) => void;
  onRemove: (id: string) => void;
}

export default function IncomeSection({
  incomes,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: "",
    monthlyAmount: 0,
    frequency: "monthly" as Frequency,
    category: "Salary",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIncome.name.trim() && newIncome.monthlyAmount > 0) {
      onAdd(newIncome);
      setNewIncome({
        name: "",
        monthlyAmount: 0,
        frequency: "monthly",
        category: "Salary",
      });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Income Streams</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Add Income"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={newIncome.name}
              onChange={(e) =>
                setNewIncome({ ...newIncome, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Salary, Freelance Client X"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Monthly Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newIncome.monthlyAmount || ""}
                onChange={(e) =>
                  setNewIncome({
                    ...newIncome,
                    monthlyAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Frequency</label>
              <select
                value={newIncome.frequency}
                onChange={(e) =>
                  setNewIncome({
                    ...newIncome,
                    frequency: e.target.value as Frequency,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {FREQUENCY_OPTIONS.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={newIncome.category}
              onChange={(e) =>
                setNewIncome({ ...newIncome, category: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
          >
            Add Income Stream
          </button>
        </form>
      )}

      <div className="space-y-3">
        {incomes.length === 0 ? (
          <p className="text-gray-500 italic">No income streams added yet.</p>
        ) : (
          incomes.map((income) => (
            <div
              key={income.id}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex justify-between items-center group hover:border-blue-500/50 transition"
            >
              <div>
                <div className="font-medium text-white">{income.name}</div>
                <div className="text-sm text-gray-400">
                  {income.category} • {income.frequency}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-green-400">
                  ${income.monthlyAmount.toLocaleString()}
                </span>
                <button
                  onClick={() => onRemove(income.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
