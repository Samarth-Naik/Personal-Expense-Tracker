type SummaryCardsProps = {
  total: number;
  count: number;
};

export function SummaryCards({ total, count }: SummaryCardsProps) {
  return (
    <div className="summary-grid">
      <div className="card summary-card">
        <h3>Total Spent</h3>
        <p>₹{total}</p>
      </div>

      <div className="card summary-card">
        <h3>Total Expenses</h3>
        <p>{count}</p>
      </div>
    </div>
  );
}