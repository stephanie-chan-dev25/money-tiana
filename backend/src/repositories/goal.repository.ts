import { pool } from "../config/database.js";

export interface Goal {
  id: number;
  name: string;
  target_amount: string;
}

export async function findGoalsByUserId(userId: number): Promise<Goal[]> {
  const result = await pool.query<Goal>(
    `SELECT id, name, target_amount
     FROM goals
     WHERE user_id = $1
     ORDER BY id ASC`,
    [userId],
  );
  return result.rows;
}

export async function createGoal(
  userId: number,
  name: string,
  targetAmount: number,
): Promise<Goal> {
  const result = await pool.query<Goal>(
    `INSERT INTO goals (name, target_amount, user_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, target_amount`,
    [name, targetAmount, userId],
  );
  return result.rows[0]!;
}

export async function deleteGoal(userId: number, goalId: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM goals
     WHERE id = $1 AND user_id = $2`,
    [goalId, userId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}
