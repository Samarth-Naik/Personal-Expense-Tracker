import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Category } from "../types/category";

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

type CategoryManagerProps = {
  categories: Category[];
  error: string;
  onAdd: (name: string) => void;
  onRename: (category: Category, newName: string) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: Category[]) => void;
};

export function CategoryManager({
  categories,
  error,
  onAdd,
  onRename,
  onDelete,
  onReorder,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    onAdd(newCategory);
    setNewCategory("");
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingName("");
  };

  const saveEdit = () => {
    if (!editingCategory || !editingName.trim()) return;
    onRename(editingCategory, editingName);
    cancelEdit();
  };

  const handleDelete = (category: Category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Existing expenses keep this label, but it won't be selectable for new or edited ones.`,
    );
    if (confirmed) onDelete(category.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(categories, oldIndex, newIndex));
  };

  return (
    <section className="card category-manager">
      <h2>Manage Categories</h2>

      <div className="category-manager-add">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New category name"
        />
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>

      {error && <p className="category-manager-error">{error}</p>}

      <p className="category-manager-hint">Drag the handle to reorder.</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="category-manager-list">
            {categories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                isEditing={editingCategory?.id === category.id}
                editingName={editingName}
                onEditingNameChange={setEditingName}
                onStartEdit={() => startEdit(category)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={() => handleDelete(category)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}

type SortableCategoryItemProps = {
  category: Category;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

function SortableCategoryItem({
  category,
  isEditing,
  editingName,
  onEditingNameChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`category-manager-item${isDragging ? " is-dragging" : ""}`}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            autoFocus
          />
          <div className="category-manager-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Save"
              onClick={onSaveEdit}
            >
              <span className="button-icon">
                <SaveIcon />
              </span>
              <span className="button-label">Save</span>
            </button>
            <button
              type="button"
              className="cancel-button icon-button"
              aria-label="Cancel"
              onClick={onCancelEdit}
            >
              <span className="button-icon">
                <CancelIcon />
              </span>
              <span className="button-label">Cancel</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="category-manager-label">
            <span
              className="drag-handle"
              aria-label="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              ⠿
            </span>
            {category.name}
          </span>
          <div className="category-manager-actions">
            <button
              type="button"
              className="edit-button icon-button"
              aria-label="Edit"
              onClick={onStartEdit}
            >
              <span className="button-icon">
                <EditIcon />
              </span>
              <span className="button-label">Edit</span>
            </button>
            <button
              type="button"
              className="delete-button icon-button"
              aria-label="Delete"
              onClick={onDelete}
            >
              <span className="button-icon">
                <DeleteIcon />
              </span>
              <span className="button-label">Delete</span>
            </button>
          </div>
        </>
      )}
    </li>
  );
}