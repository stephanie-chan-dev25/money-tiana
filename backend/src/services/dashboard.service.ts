import { AppError } from "../errors/app.error.js";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "../repositories/dashboard.repository.js";

export async function getDashboard(
  userId: number,
): Promise<DashboardSummary> {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AppError(401, "Authentification requise.");
  }

  return getDashboardSummary(userId);
}