import type { Expense } from "../types/expense";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExportButtons } from "../components/ExportButtons";

type TransactionsPageProps = {
  selectedMonth: string;
  onSelectedMonthChange: (month: string) => void;
  tableExpenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
};

export function TransactionsPage({
  selectedMonth,
  onSelectedMonthChange,
  tableExpenses,
  onEditExpense,
  onDeleteExpense,
}: TransactionsPageProps) {
  return (
    <>
      <div className="month-filter">
        <label htmlFor="transactions-month">Select Month</label>
        <input
          id="transactions-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => onSelectedMonthChange(e.target.value)}
        />
        <ExportButtons expenses={tableExpenses} selectedMonth={selectedMonth} />
      </div>

      <section className="exp expense-table">
        <h2>Expenses</h2>

        <ExpenseTable
          expenses={tableExpenses}
          onEdit={onEditExpense}
          onDelete={onDeleteExpense}
          mode="lazy"
        />
      </section>
    </>
  );
}