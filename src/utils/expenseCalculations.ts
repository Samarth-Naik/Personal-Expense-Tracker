import type { Expense } from "../types/expense";

export function filterByMonth(expenses: Expense[], selectedMonth: string) {
  return expenses.filter((expense) => expense.date.startsWith(selectedMonth));
}

export function getTotal(expenses: Expense[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getCategoryTotals(expenses: Expense[]) {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  return categoryTotals;
}

export function formatMonth(selectedMonth: string) {
  return new Date(`${selectedMonth}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function sortByLatestUpdated(expenses: Expense[]) {
  return [...expenses].sort((a, b) => b.updatedAt - a.updatedAt);
}