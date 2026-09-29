import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  // Default the category field to the first available category once
  // categories have loaded, but only for a fresh (non-edit) form.
  useEffect(() => {
    if (!editingExpense && !category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [editingExpense, category, categories]);

  const reset = () => {
    setAmount("");
    setCategory(categories[0]?.name ?? "");
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
    if (!category) {
      setError("Please select or add a category first.");
      return;
    }

    setError("");
    onSubmit({ amount: Number(amount), category, description, date });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancelEdit();
  };

  // If the expense being edited uses a category that's since been deleted,
  // keep it selectable so editing doesn't silently change its category.
  const categoryOptions = categories.some((c) => c.name === category)
    ? categories.map((c) => c.name)
    : [category, ...categories.map((c) => c.name)].filter(Boolean);

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
            value={category}
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