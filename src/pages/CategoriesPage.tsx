import type { Category } from "../types/category";
import { CategoryManager } from "../components/CategoryManager";

type CategoriesPageProps = {
  categories: Category[];
  error: string;
  onAdd: (name: string) => void;
  onRename: (category: Category, newName: string) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: Category[]) => void;
};

export function CategoriesPage({
  categories,
  error,
  onAdd,
  onRename,
  onDelete,
  onReorder,
}: CategoriesPageProps) {
  return (
    <>
      <CategoryManager
        categories={categories}
        error={error}
        onAdd={onAdd}
        onRename={onRename}
        onDelete={onDelete}
        onReorder={onReorder}
      />
    </>
  );
}