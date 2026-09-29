export type Category = {
  id: string;
  userId: string;
  name: string;
  order: number;
};

export const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
] as const;