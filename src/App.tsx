import "./styles/index.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useExpenses } from "./hooks/useExpenses";
import { useCategories } from "./hooks/useCategories";
import {
  filterByMonth,
  getTotal,
  getCategoryTotals,
  sortByLatestUpdated,
  getCurrentMonth,
} from "./utils/expenseCalculations";
import { Header } from "./components/Header";
import { ExpensesPage } from "./pages/ExpensesPage";
import { TransactionsPage } from "./pages/Transactionspage";
import { DashboardPage } from "./pages/DashboardPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import type { Expense } from "./types/expense";

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

// Holds all app state/logic and renders the routed pages. Split out from
// App so it can call useNavigate() — that hook only works inside a
// component rendered beneath <BrowserRouter>, not in the component that
// returns <BrowserRouter> itself.
function AppShell() {
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

  const [dashboardMonth, setDashboardMonth] = useState(getCurrentMonth);
  const [transactionsMonth, setTransactionsMonth] = useState(getCurrentMonth);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const navigate = useNavigate();

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

  // Used from the Transactions page: the edit form only lives on Home, so
  // editing from Transactions sets the expense to edit and navigates back.
  const editFromTransactions = (expense: Expense) => {
    setEditingExpense(expense);
    navigate("/");
  };

  const dashboardMonthlyExpenses = filterByMonth(expenses, dashboardMonth);
  const totalExpenses = getTotal(dashboardMonthlyExpenses);
  const categoryTotals = getCategoryTotals(dashboardMonthlyExpenses);

  const transactionsMonthlyExpenses = filterByMonth(expenses, transactionsMonth);
  const tableExpenses = sortByLatestUpdated(transactionsMonthlyExpenses);

  const latestExpenses = sortByLatestUpdated(expenses);

  return (
    <>
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
                      latestExpenses={latestExpenses}
                      onEditExpense={setEditingExpense}
                      onDeleteExpense={handleDeleteExpense}
                    />
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <TransactionsPage
                      selectedMonth={transactionsMonth}
                      onSelectedMonthChange={setTransactionsMonth}
                      tableExpenses={tableExpenses}
                      onEditExpense={editFromTransactions}
                      onDeleteExpense={handleDeleteExpense}
                    />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardPage
                      selectedMonth={dashboardMonth}
                      onSelectedMonthChange={setDashboardMonth}
                      totalExpenses={totalExpenses}
                      expenseCount={dashboardMonthlyExpenses.length}
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
    </>
  );
}

export default App;