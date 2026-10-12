import { SummaryCards } from "../components/SummaryCards";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { CategoryPieChart } from "../components/CategoryPieChart";
import type { Expense } from "../types/expense";

type DashboardPageProps = {
  selectedMonth: string;
  onSelectedMonthChange: (month: string) => void;
  totalExpenses: number;
  expenseCount: number;
  categoryTotals: Record<string, number>;
  monthlyExpenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
};

export function DashboardPage({
  selectedMonth,
  onSelectedMonthChange,
  totalExpenses,
  expenseCount,
  categoryTotals,
  monthlyExpenses,
  onEditExpense,
  onDeleteExpense,
}: DashboardPageProps) {
  return (
    <>
      <div className="month-filter">
        <label htmlFor="dashboard-month">Select Month</label>
        <input
          id="dashboard-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => onSelectedMonthChange(e.target.value)}
        />
      </div>

      <SummaryCards total={totalExpenses} count={expenseCount} />
      <CategoryPieChart categoryTotals={categoryTotals} />
      <CategoryBreakdown
        categoryTotals={categoryTotals}
        expenses={monthlyExpenses}
        onEdit={onEditExpense}
        onDelete={onDeleteExpense}
      />
    </>
  );
}
