import { useState } from "react";
import type { Expense } from "../types/expense";

type ExpenseTableProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

const INITIAL_VISIBLE = 5;
const LOAD_MORE_STEP = 10;

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleExpenses = expenses.slice(0, visibleCount);
  const hasMore = visibleCount < expenses.length;

  return (
    <section className="card expense-table">
      <h2>Expenses</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No expenses found for this month.
                </td>
              </tr>
            ) : (
              visibleExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button
            type="button"
            className="load-more-button"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}