import { SummaryCards } from "../components/SummaryCards";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { CategoryPieChart } from "../components/CategoryPieChart";

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
      <CategoryBreakdown categoryTotals={categoryTotals} />
    </>
  );
}