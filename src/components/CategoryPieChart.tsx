
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CategoryPieChartProps = {
  categoryTotals: Record<string, number>;
};

const COLORS = [
  "#30364F",
  "#68758A",
  "#ACBAC4",
  "#C4B995",
  "#E1D9BC",
  "#8B9B8D",
  "#A85C5C",
];

export function CategoryPieChart({
  categoryTotals,
}: CategoryPieChartProps) {
  const data = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .filter((item) => Number.isFinite(item.amount) && item.amount > 0);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="card category-pie-chart">
      <h2>Expense Distribution</h2>

      {data.length === 0 ? (
        <p className="empty-state">
          No expenses found for this month.
        </p>
      ) : (
        <>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="pie-chart-total">
            Total: ₹{total.toLocaleString("en-IN")}
          </p>
        </>
      )}
    </section>
  );
}