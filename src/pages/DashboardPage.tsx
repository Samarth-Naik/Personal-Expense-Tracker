import { Link } from "react-router-dom";
import { SummaryCards } from "../components/SummaryCards";
import { CategoryBreakdown } from "../components/CategoryBreakdown";

type DashboardPageProps = {
  selectedMonth: string;
  onSelectedMonthChange: (month: string) => void;
  totalExpenses: number;
  expenseCount: number;
  categoryTotals: Record<string, number>;
};

export function DashboardPage({
  selectedMonth,
  onSelectedMonthChange,
  totalExpenses,
  expenseCount,
  categoryTotals,
}: DashboardPageProps) {
  return (
    <>
      <Link to="/" className="back-link">
        ← Back to Expenses
      </Link>

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

      <CategoryBreakdown categoryTotals={categoryTotals} />
    </>
  );
}