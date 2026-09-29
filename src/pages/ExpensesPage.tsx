import type { Expense } from "../types/expense";
import type { Category } from "../types/category";
import type { ExpenseInput } from "../hooks/useExpenses";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExportButtons } from "../components/ExportButtons";

type ExpensesPageProps = {
  editingExpense: Expense | null;
  categories: Category[];
  onSubmitExpense: (input: ExpenseInput) => void;
  onCancelEdit: () => void;
  error: string;
  selectedMonth: string;
  onSelectedMonthChange: (month: string) => void;
  tableExpenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
};

export function ExpensesPage({
  editingExpense,
  categories,
  onSubmitExpense,
  onCancelEdit,
  error,
  selectedMonth,
  onSelectedMonthChange,
  tableExpenses,
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

      <div className="month-filter">
        <label htmlFor="month">Select Month</label>
        <input
          id="month"
          type="month"
          value={selectedMonth}
          onChange={(e) => onSelectedMonthChange(e.target.value)}
        />
        <ExportButtons expenses={tableExpenses} selectedMonth={selectedMonth} />
      </div>

      <ExpenseTable
        key={selectedMonth}
        expenses={tableExpenses}
        onEdit={onEditExpense}
        onDelete={onDeleteExpense}
      />
    </>
  );
}