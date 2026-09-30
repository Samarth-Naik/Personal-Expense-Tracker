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
import type { Category } from "../types/category";
import { DEFAULT_CATEGORIES } from "../types/category";

export function useCategories(user: User | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const categoriesQuery = query(
        collection(db, "categories"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(categoriesQuery);

      if (snapshot.empty) {
        // First time for this user: seed their category list with the
        // previous hardcoded defaults so nothing changes for existing users.
        const batch = writeBatch(db);
        const seeded: Category[] = [];

        DEFAULT_CATEGORIES.forEach((name, index) => {
          const ref = doc(collection(db, "categories"));
          batch.set(ref, { userId: user.uid, name, order: index });
          seeded.push({ id: ref.id, userId: user.uid, name, order: index });
        });

        await batch.commit();
        setCategories(seeded);
      } else {
        const loaded: Category[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          userId: docSnap.data().userId,
          name: docSnap.data().name,
          // Categories created before drag-and-drop ordering existed won't
          // have this field yet; fall back to 0 so they still sort (stably,
          // in their existing relative order) rather than break.
          order: docSnap.data().order ?? 0,
        }));

        loaded.sort((a, b) => a.order - b.order);
        setCategories(loaded);
      }

      setLoading(false);
    };

    loadCategories();
  }, [user]);

  const addCategory = async (name: string) => {
    if (!user) return;

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Category name can't be empty.");
      return;
    }

    if (
      categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("That category already exists.");
      return;
    }

    const nextOrder = categories.length
      ? Math.max(...categories.map((c) => c.order)) + 1
      : 0;

    try {
      const docRef = await addDoc(collection(db, "categories"), {
        userId: user.uid,
        name: trimmed,
        order: nextOrder,
      });

      setCategories((prev) => [
        ...prev,
        { id: docRef.id, userId: user.uid, name: trimmed, order: nextOrder },
      ]);
      setError("");
    } catch {
      setError("Failed to add category. Please try again.");
    }
  };

  const renameCategory = async (id: string, name: string) => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Category name can't be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, "categories", id), { name: trimmed });

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
      );
      setError("");
    } catch {
      setError("Failed to update category. Please try again.");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setError("");
    } catch {
      setError("Failed to delete category. Please try again.");
    }
  };

  // Persists a full reordered list (e.g. after a drag-and-drop) by writing
  // each category's new index as its order field.
  const reorderCategories = async (reordered: Category[]) => {
    const previous = categories;
    const withNewOrder = reordered.map((c, index) => ({ ...c, order: index }));

    // Update local state immediately so the drag feels instant.
    setCategories(withNewOrder);

    try {
      const batch = writeBatch(db);
      withNewOrder.forEach((c) => {
        batch.update(doc(db, "categories", c.id), { order: c.order });
      });
      await batch.commit();
      setError("");
    } catch {
      setCategories(previous);
      setError("Failed to save the new category order. Please try again.");
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
  };
}