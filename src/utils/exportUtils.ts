import type { Expense } from "../types/expense";

const EXPORT_HEADERS = ["Date", "Category", "Description", "Amount"] as const;

function toExportRows(expenses: Expense[]) {
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  return sorted.map((expense) => ({
    Date: expense.date,
    Category: expense.category,
    Description: expense.description,
    Amount: expense.amount,
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string | number) {
  const stringValue = String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportToCSV(expenses: Expense[], selectedMonth: string) {
  const rows = toExportRows(expenses);

  const csvLines = [
    EXPORT_HEADERS.join(","),
    ...rows.map((row) =>
      [row.Date, row.Category, row.Description, row.Amount]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];

  const blob = new Blob([csvLines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  downloadBlob(blob, `expenses-${selectedMonth}.csv`);
}