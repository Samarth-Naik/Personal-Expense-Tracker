import { Link } from "react-router-dom";
import type { Expense } from "../types/expense";
import type { Category } from "../types/category";
import type { ExpenseInput } from "../hooks/useExpenses";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseTable } from "../components/ExpenseTable";

type ExpensesPageProps = {
  editingExpense: Expense | null;
  categories: Category[];
  onSubmitExpense: (input: ExpenseInput) => void;
  onCancelEdit: () => void;
  error: string;
  latestExpenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
};

export function ExpensesPage({
  editingExpense,
  categories,
  onSubmitExpense,
  onCancelEdit,
  error,
  latestExpenses,
  onEditExpense,
  onDeleteExpense,
}: ExpensesPageProps) {
  return (
    <>
      <ExpenseForm
        editingExpense={editingExpense}
        categories={categories}
        onSubmit={onSubmitExpense}
        onCancelEdit={onCancelEdit}
      />

      {error && <p>{error}</p>}

      <section className=" exp expense-table">
        <div className="section-header">
          <h2>Expenses</h2>
          <Link to="/transactions" className="see-all-link">
            See all →
          </Link>
        </div>

        <ExpenseTable
          expenses={latestExpenses}
          onEdit={onEditExpense}
          onDelete={onDeleteExpense}
          mode="fixed"
          limit={5}
        />
      </section>
    </>
  );
}