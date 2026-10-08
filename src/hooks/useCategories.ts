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
  runTransaction,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { Category } from "../types/category";
import { DEFAULT_CATEGORIES } from "../types/category";

// Atomically seeds the default categories exactly once per user, even if
// this gets called more than once concurrently (e.g. an effect firing
// twice). A marker doc at categorySeeds/{uid} is created inside the same
// Firestore transaction as the seed writes: if two calls race, Firestore
// detects the conflict on the marker doc and retries the loser, which then
// sees the marker already exists and does nothing. This is what the old
// plain "if (snapshot.empty)" check was missing — that check-then-write
// wasn't atomic, which is what caused duplicate categories to pile up.
async function seedDefaultCategoriesOnce(user: User) {
  const markerRef = doc(db, "categorySeeds", user.uid);

  await runTransaction(db, async (transaction) => {
    const markerSnap = await transaction.get(markerRef);
    if (markerSnap.exists()) return;

    transaction.set(markerRef, { seededAt: Date.now() });

    DEFAULT_CATEGORIES.forEach((name, index) => {
      const ref = doc(collection(db, "categories"));
      transaction.set(ref, { userId: user.uid, name, order: index });
    });
  });
}

// Cleans up any categories that share the same name (case-insensitive) —
// the legacy symptom of the race above. Keeps the one with the lowest
// `order` per name, deletes the rest, and re-sequences `order` so there
// are no gaps left behind. Only ever touches the categories collection —
// expenses reference a category by its name string, never by id, so this
// can't orphan or delete any expense.
async function dedupeCategories(
  snapshot: QuerySnapshot<DocumentData>,
): Promise<Category[]> {
  const all: Category[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      name: data.name,
      order: data.order ?? 0,
    };
  });

  const byName = new Map<string, Category[]>();
  all.forEach((category) => {
    const key = category.name.trim().toLowerCase();
    byName.set(key, [...(byName.get(key) ?? []), category]);
  });

  const toDelete: string[] = [];
  const kept: Category[] = [];

  byName.forEach((group) => {
    if (group.length === 1) {
      kept.push(group[0]);
      return;
    }

    const sorted = [...group].sort((a, b) =>
      a.order !== b.order ? a.order - b.order : a.id.localeCompare(b.id),
    );

    kept.push(sorted[0]);
    sorted.slice(1).forEach((dup) => toDelete.push(dup.id));
  });

  if (toDelete.length === 0) {
    all.sort((a, b) => a.order - b.order);
    return all;
  }

  kept.sort((a, b) => a.order - b.order);
  const reindexed = kept.map((category, index) => ({ ...category, order: index }));

  const batch = writeBatch(db);
  toDelete.forEach((id) => batch.delete(doc(db, "categories", id)));
  reindexed.forEach((category) =>
    batch.update(doc(db, "categories", category.id), { order: category.order }),
  );
  await batch.commit();

  return reindexed;
}

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

      let snapshot = await getDocs(categoriesQuery);

      if (snapshot.empty) {
        await seedDefaultCategoriesOnce(user);
        snapshot = await getDocs(categoriesQuery);
      }

      const deduped = await dedupeCategories(snapshot);
      setCategories(deduped);
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