import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { Expense } from "../types/expense";

export type ExpenseInput = {
  amount: number;
  category: string;
  description: string;
  date: string;
};

export function useExpenses(user: User | null) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadExpenses = async () => {
      setLoading(true);

      const expensesQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
      );

      const querySnapshot = await getDocs(expensesQuery);

      const loadedExpenses: Expense[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          userId: data.userId,
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date,
          // Expenses created before this field existed won't have it;
          // fall back to their expense date so they still sort sensibly
          // (below anything actually added/edited since this feature shipped).
          updatedAt: data.updatedAt ?? new Date(data.date).getTime(),
        };
      });

      setExpenses(loadedExpenses);
      setLoading(false);
    };

    loadExpenses();
  }, [user]);

  const addExpense = async (input: ExpenseInput) => {
    if (!user) return;

    const updatedAt = Date.now();

    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        ...input,
        updatedAt,
      });

      setExpenses((prev) => [
        ...prev,
        { id: docRef.id, userId: user.uid, ...input, updatedAt },
      ]);
      setError("");
    } catch {
      setError("Failed to save expense. Please try again.");
    }
  };

  const editExpense = async (id: string, input: ExpenseInput) => {
    const updatedAt = Date.now();

    try {
      await updateDoc(doc(db, "expenses", id), { ...input, updatedAt });

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, ...input, updatedAt } : expense,
        ),
      );
      setError("");
    } catch {
      setError("Failed to save expense. Please try again.");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      setError("");
    } catch {
      setError("Failed to delete expense. Please try again.");
    }
  };

  // Cascades a category rename onto every expense that used the old name,
  // so renaming "Food" to "Groceries" doesn't fragment reports/breakdowns
  // between the old and new labels.
  const renameCategoryEverywhere = async (oldName: string, newName: string) => {
    if (!user || oldName === newName) return;

    try {
      const matchingQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        where("category", "==", oldName),
      );

      const snapshot = await getDocs(matchingQuery);
      if (snapshot.empty) return;

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.update(doc(db, "expenses", docSnap.id), { category: newName });
      });
      await batch.commit();

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.category === oldName
            ? { ...expense, category: newName }
            : expense,
        ),
      );
      setError("");
    } catch {
      setError("Category renamed, but failed to update existing expenses.");
    }
  };

  return {
    expenses,
    loading,
    error,
    setError,
    addExpense,
    editExpense,
    deleteExpense,
    renameCategoryEverywhere,
  };
}