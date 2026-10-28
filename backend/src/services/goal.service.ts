import { AppError } from "../errors/app.error.js";
import {
  createGoal as insertGoal,
  deleteGoal as removeGoal,
  findGoalsByUserId,
  type Goal,
} from "../repositories/goal.repository.js";
import type { CreateGoalInput } from "../schemas/goal.schema.js";

function validateUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(401, "Authentification requise.");
  }
}

export async function getGoalsForUser(userId: number): Promise<Goal[]> {
  validateUserId(userId);
  return findGoalsByUserId(userId);
}

export async function createGoalForUser(
  userId: number,
  input: CreateGoalInput,
): Promise<Goal> {
  validateUserId(userId);
  return insertGoal(userId, input.name, input.target_amount);
}

export async function deleteGoalForUser(userId: number, goalId: number): Promise<void> {
  validateUserId(userId);
  if (!Number.isInteger(goalId) || goalId <= 0) {
    throw new AppError(400, "Identifiant d’objectif invalide.");
  }
  const deleted = await removeGoal(userId, goalId);
  if (!deleted) {
    throw new AppError(404, "Objectif introuvable.");
  }
}
