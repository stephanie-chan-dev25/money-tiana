import { AppError } from "../errors/app.error.js";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new AppError(
      500,
      "La configuration du secret JWT est invalide.",
    );
  }

  return secret;
}