import {
  createCategory as insertCategory,
  deleteCategory as removeCategory,
  findCategoriesByUserId,
  findCategoryById,
  updateCategory as updateCategoryInDatabase,
  type Category,
} from "../repositories/category.repository.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema.js";
import { AppError } from "../errors/app.error.js";

function validateUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(401, "Authentification requise.");
  }
}

export async function getCategories(userId: number): Promise<Category[]> {
  validateUserId(userId);
  return findCategoriesByUserId(userId);
}

export async function getCategory(
  userId: number,
  categoryId: number,
): Promise<Category> {
  validateUserId(userId);

  const category = await findCategoryById(userId, categoryId);

  if (!category) {
    throw new AppError(404, "Catégorie introuvable.");
  }

  return category;
}

export async function createCategoryForUser(
  userId: number,
  input: CreateCategoryInput,
): Promise<Category> {
  validateUserId(userId);
  return insertCategory(userId, input.name, input.type);
}

export async function updateCategoryForUser(
  userId: number,
  categoryId: number,
  input: UpdateCategoryInput,
): Promise<Category> {
  validateUserId(userId);

  const category = await updateCategoryInDatabase(
    userId,
    categoryId,
    input.name,
    input.type,
  );

  if (!category) {
    throw new AppError(404, "Catégorie introuvable.");
  }

  return category;
}

export async function deleteCategoryForUser(
  userId: number,
  categoryId: number,
): Promise<void> {
  validateUserId(userId);

  try {
    const deleted = await removeCategory(userId, categoryId);

    if (!deleted) {
      throw new AppError(404, "Catégorie introuvable.");
    }
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23503"
    ) {
      throw new AppError(
        409,
        "Cette catégorie est utilisée par des transactions et ne peut pas être supprimée.",
      );
    }

    throw error;
  }
}