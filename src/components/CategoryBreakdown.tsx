type CategoryBreakdownProps = {
  categoryTotals: Record<string, number>;
};

export function CategoryBreakdown({ categoryTotals }: CategoryBreakdownProps) {
  return (
    <section className="card category-breakdown">
      <h2>Category Breakdown</h2>

      <div className="category-list">
        {Object.entries(categoryTotals).length === 0 ? (
          <p className="empty-state">No expenses found for this month.</p>
        ) : (
          Object.entries(categoryTotals).map(([category, total]) => (
            <div className="category-item" key={category}>
              <span>{category}</span>
              <strong>₹{total}</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}