import { useState } from "react";
import type { Expense } from "../types/expense";
import { ExpenseTable } from "./ExpenseTable";

type CategoryBreakdownProps = {
  categoryTotals: Record<string, number>;
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export function CategoryBreakdown({
  categoryTotals,
  expenses,
  onEdit,
  onDelete,
}: CategoryBreakdownProps) {
  const categories = Object.entries(categoryTotals).filter(
    ([, total]) => total > 0,
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeCategory =
    selectedCategory && categories.some(([name]) => name === selectedCategory)
      ? selectedCategory
      : (categories[0]?.[0] ?? null);

  const getCategoryExpenses = (category: string) =>
    expenses
      .filter((expense) => expense.category === category)
      .sort((a, b) => b.date.localeCompare(a.date));

  if (categories.length === 0) {
    return (
      <section className="card category-breakdown">
        <h2>Category Breakdown</h2>
        <p className="empty-state">No expenses found for this month.</p>
      </section>
    );
  }

  return (
    <section className="card category-breakdown">
      <h2>Category Breakdown</h2>

      {/* Desktop category tabs */}
      <div
        className="category-tabs"
        role="tablist"
        aria-label="Expense categories"
      >
        {categories.map(([category, total]) => (
          <button
            key={category}
            type="button"
            role="tab"
            id={`category-tab-${category}`}
            aria-selected={activeCategory === category}
            aria-controls={`category-panel-${category}`}
            className={`category-tab ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <span>{category}</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </button>
        ))}
      </div>

      {/* Desktop transaction panel */}
      {activeCategory && (
        <div
          className="category-transactions desktop-category-panel"
          role="tabpanel"
          id={`category-panel-${activeCategory}`}
          aria-labelledby={`category-tab-${activeCategory}`}
        >
          <h3>{activeCategory} Transactions</h3>

          <ExpenseTable
            key={activeCategory}
            expenses={getCategoryExpenses(activeCategory)}
            onEdit={onEdit}
            onDelete={onDelete}
            mode="lazy"
            limit={5}
            step={10}
          />
        </div>
      )}

      {/* Mobile category accordions */}
      <div className="category-accordions">
        {categories.map(([category, total]) => {
          const isOpen = activeCategory === category;

          return (
            <div className="category-accordion" key={category}>
              <button
                type="button"
                className={`category-accordion-trigger ${
                  isOpen ? "active" : ""
                }`}
                aria-expanded={isOpen}
                aria-controls={`category-accordion-panel-${category}`}
                onClick={() => setSelectedCategory(isOpen ? null : category)}
              >
                <span className="category-accordion-name">{category}</span>

                <strong>₹{total.toLocaleString("en-IN")}</strong>

                <span className="category-accordion-chevron" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div
                  className="category-accordion-content"
                  id={`category-accordion-panel-${category}`}
                >
                  <ExpenseTable
                    key={category}
                    expenses={getCategoryExpenses(category)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    mode="lazy"
                    limit={5}
                    step={10}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
