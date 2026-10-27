import api from "./api";
import type { Category, CategoryPayload } from "../types/category.types";

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get<{ categories: Category[] }>("/categories");
    return data.categories;
  },
  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await api.post<{ category: Category }>("/categories", payload);
    return data.category;
  },
  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await api.patch<{ category: Category }>(`/categories/${id}`, payload);
    return data.category;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
