import type { QueryResultRow } from "pg";
import { pool } from "../config/database.js";
import type { CategoryType } from "../schemas/category.schema.js";

export interface Category extends QueryResultRow {
  id: number;
  name: string;
  type: CategoryType;
  user_id: number;
}

export async function findCategoriesByUserId(
  userId: number,
): Promise<Category[]> {
  const result = await pool.query<Category>(
    `SELECT id, name, type, user_id
     FROM categories
     WHERE user_id = $1
     ORDER BY id ASC`,
    [userId],
  );

  return result.rows;
}

export async function findCategoryById(
  userId: number,
  categoryId: number,
): Promise<Category | null> {
  const result = await pool.query<Category>(
    `SELECT id, name, type, user_id
     FROM categories
     WHERE user_id = $1 AND id = $2
     LIMIT 1`,
    [userId, categoryId],
  );

  return result.rows[0] ?? null;
}

export async function createCategory(
  userId: number,
  name: string,
  type: CategoryType,
): Promise<Category> {
  const result = await pool.query<Category>(
    `INSERT INTO categories (name, type, user_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, type, user_id`,
    [name, type, userId],
  );

  return result.rows[0]!;
}

export async function updateCategory(
  userId: number,
  categoryId: number,
  name: string,
  type: CategoryType,
): Promise<Category | null> {
  const result = await pool.query<Category>(
    `UPDATE categories
     SET name = $1, type = $2
     WHERE user_id = $3 AND id = $4
     RETURNING id, name, type, user_id`,
    [name, type, userId, categoryId],
  );

  return result.rows[0] ?? null;
}

export async function deleteCategory(
  userId: number,
  categoryId: number,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM categories
     WHERE user_id = $1 AND id = $2`,
    [userId, categoryId],
  );

  return result.rowCount !== null && result.rowCount > 0;
}