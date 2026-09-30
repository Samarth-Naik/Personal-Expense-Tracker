import { useState } from "react";
import type { Expense } from "../types/expense";
import type { Category } from "../types/category";
import type { ExpenseInput } from "../hooks/useExpenses";

type ExpenseFormProps = {
  editingExpense: Expense | null;
  categories: Category[];
  onSubmit: (input: ExpenseInput) => void;
  onCancelEdit: () => void;
};

const today = () => new Date().toISOString().split("T")[0];

export function ExpenseForm({
  editingExpense,
  categories,
  onSubmit,
  onCancelEdit,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [error, setError] = useState("");

  // Tracks which Expense (if any) the form fields currently reflect, so we
  // can detect a change during render and re-sync — the pattern React
  // recommends for "adjust state when a prop changes" instead of an effect.
  const [syncedExpense, setSyncedExpense] = useState<Expense | null>(null);

  if (editingExpense !== syncedExpense) {
    setSyncedExpense(editingExpense);

    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    }
  }

  // Falls back to the first available category for a fresh (non-edit) form
  // until the user picks one themselves. Derived at render time rather than
  // stored via an effect, since it's just a default for display/submit.
  const effectiveCategory = category || categories[0]?.name || "";

  const reset = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(today());
    setError("");
  };

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (!effectiveCategory) {
      setError("Please select or add a category first.");
      return;
    }

    setError("");
    onSubmit({
      amount: Number(amount),
      category: effectiveCategory,
      description,
      date,
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancelEdit();
  };

  // If the expense being edited uses a category that's since been deleted,
  // keep it selectable so editing doesn't silently change its category.
  const categoryOptions = categories.some((c) => c.name === effectiveCategory)
    ? categories.map((c) => c.name)
    : [effectiveCategory, ...categories.map((c) => c.name)].filter(Boolean);

  return (
    <section className="card expense-form">
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
      <div className="form-row">
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </label>

        <label>
          Category
          <select
            value={effectiveCategory}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.length === 0 ? (
              <option value="">No categories yet</option>
            ) : (
              categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            )}
          </select>
        </label>

        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {error && <p>{error}</p>}

        <div className="form-actions">
          <button onClick={handleSubmit}>
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>

          {editingExpense && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </section>
  );
}