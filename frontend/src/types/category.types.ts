export type CategoryType = "income" | "expense";
export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  user_id: number;
}
export interface CategoryPayload {
  name: string;
  type: CategoryType;
}
