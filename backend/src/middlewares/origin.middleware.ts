import type { RequestHandler } from "express";
import { AppError } from "../errors/app.error.js";

export const requireTrustedOrigin: RequestHandler = (
  req,
  _res,
  next,
) => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    next(
      new AppError(
        500,
        "La configuration du frontend est manquante.",
      ),
    );

    return;
  }

  const origin = req.get("Origin");

  if (!origin) {
    next(new AppError(403, "Origine de la requête absente."));
    return;
  }

  try {
    const trustedOrigin = new URL(frontendUrl).origin;
    const requestOrigin = new URL(origin).origin;

    if (requestOrigin !== trustedOrigin) {
      next(new AppError(403, "Origine de la requête non autorisée."));
      return;
    }
  } catch {
    next(new AppError(403, "Origine de la requête invalide."));
    return;
  }

  next();
};