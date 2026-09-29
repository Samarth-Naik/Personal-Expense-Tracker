import "./styles/index.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useExpenses } from "./hooks/useExpenses";
import { useCategories } from "./hooks/useCategories";
import {
  filterByMonth,
  getTotal,
  getCategoryTotals,
  sortByLatestUpdated,
} from "./utils/expenseCalculations";
import { Header } from "./components/Header";
import { ExpensesPage } from "./pages/ExpensesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import type { Expense } from "./types/expense";

function App() {
  const { user, authLoading, loginWithGoogle, logout } = useAuth();
  const {
    expenses,
    loading,
    error,
    addExpense,
    editExpense,
    deleteExpense,
    renameCategoryEverywhere,
  } = useExpenses(user);
  const {
    categories,
    error: categoryError,
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories(user);

  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleDeleteExpense = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );
    if (confirmed) deleteExpense(id);
  };

  const monthlyExpenses = filterByMonth(expenses, selectedMonth);
  const totalExpenses = getTotal(monthlyExpenses);
  const categoryTotals = getCategoryTotals(monthlyExpenses);
  const tableExpenses = sortByLatestUpdated(monthlyExpenses);

  return (
    <BrowserRouter>
      {user && <Header user={user} onLogout={logout} />}

      <main className="app-content">
        <div>
          {!user && (
            <div className="signin-view">
              <button onClick={loginWithGoogle}>Sign in with Google</button>
            </div>
          )}

          {user &&
            (loading ? (
              <p>Loading expenses...</p>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <ExpensesPage
                      editingExpense={editingExpense}
                      categories={categories}
                      onSubmitExpense={(input) => {
                        if (editingExpense) {
                          editExpense(editingExpense.id, input);
                          setEditingExpense(null);
                        } else {
                          addExpense(input);
                        }
                      }}
                      onCancelEdit={() => setEditingExpense(null)}
                      error={error}
                      selectedMonth={selectedMonth}
                      onSelectedMonthChange={setSelectedMonth}
                      tableExpenses={tableExpenses}
                      onEditExpense={setEditingExpense}
                      onDeleteExpense={handleDeleteExpense}
                    />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardPage
                      selectedMonth={selectedMonth}
                      onSelectedMonthChange={setSelectedMonth}
                      totalExpenses={totalExpenses}
                      expenseCount={monthlyExpenses.length}
                      categoryTotals={categoryTotals}
                    />
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <CategoriesPage
                      categories={categories}
                      error={categoryError}
                      onAdd={addCategory}
                      onRename={(category, newName) => {
                        renameCategory(category.id, newName);
                        renameCategoryEverywhere(category.name, newName);
                      }}
                      onDelete={deleteCategory}
                      onReorder={reorderCategories}
                    />
                  }
                />
              </Routes>
            ))}
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;