import type { Expense } from "../types/expense";
import { exportToCSV } from "../utils/exportUtils";

type ExportButtonsProps = {
  expenses: Expense[];
  selectedMonth: string;
};

export function ExportButtons({ expenses, selectedMonth }: ExportButtonsProps) {
  const disabled = expenses.length === 0;

  return (
    <div className="export-buttons">
      <button
        type="button"
        className="export-button"
        disabled={disabled}
        onClick={() => exportToCSV(expenses, selectedMonth)}
      >
        Export CSV
      </button>
    </div>
  );
}