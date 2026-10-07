import type { Expense } from "../types/expense";
import { exportToCSV } from "../utils/exportUtils";
import { ExcelIcon } from "./icons";

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
        className="export-icon-button"
        disabled={disabled}
        aria-label="Export CSV"
        title="Export CSV"
        onClick={() => exportToCSV(expenses, selectedMonth)}
      >
        <ExcelIcon />
      </button>
    </div>
  );
}