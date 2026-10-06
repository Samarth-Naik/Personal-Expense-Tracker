import { useEffect, useRef, useState } from "react";
import type { Expense } from "../types/expense";
import { EditIcon, DeleteIcon } from "./icons";

type ExpenseTableProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  // "fixed": always shows exactly `limit` tiles, no more-loading affordance
  // (used on Home for the "latest 5" preview).
  // "lazy": starts at `limit` tiles and reveals `step` more at a time as the
  // sentinel below the list scrolls into view (used on Transactions).
  mode?: "fixed" | "lazy";
  limit?: number;
  step?: number;
};

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  mode = "lazy",
  limit = 5,
  step = 10,
}: ExpenseTableProps) {
  const [visibleCount, setVisibleCount] = useState(limit);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleExpenses =
    mode === "fixed"
      ? expenses.slice(0, limit)
      : expenses.slice(0, visibleCount);

  const hasMore = mode === "lazy" && visibleCount < expenses.length;

  // Subscribes to an IntersectionObserver watching the sentinel div; this is
  // the React-recommended "subscribe to an external system, call setState in
  // its callback" effect pattern, so it's fine under set-state-in-effect.
  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + step);
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, step]);

  if (expenses.length === 0) {
    return <p className="empty-state">No expenses found.</p>;
  }

  return (
    <>
      <div className="expense-tile-list">
        {visibleExpenses.map((expense) => (
          <div className="expense-tile" key={expense.id}>
            <div className="expense-tile-amount">₹{expense.amount}</div>

            <div className="expense-tile-middle">
              <div className="expense-tile-description">
                {expense.description}
              </div>
              <div className="expense-tile-meta">
                {expense.date} | {expense.category}
              </div>
            </div>

            <div className="expense-tile-actions">
              <button
                type="button"
                className="edit-button tile-icon-button"
                aria-label="Edit"
                onClick={() => onEdit(expense)}
              >
                <EditIcon />
              </button>

              <button
                type="button"
                className="delete-button tile-icon-button"
                aria-label="Delete"
                onClick={() => onDelete(expense.id)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="lazy-load-sentinel">
          Loading more…
        </div>
      )}
    </>
  );
}