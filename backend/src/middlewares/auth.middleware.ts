import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { getJwtSecret } from "../config/jwt.js";
import { AppError } from "../errors/app.error.js";

interface TokenPayload {
  sub: string;
  email: string;
  iss: string;
  aud: string;
}

export const requireAuth: RequestHandler = (
  req,
  _res,
  next,
) => {
  const token = req.cookies?.money_tiana_token;

  if (!token) {
    next(new AppError(401, "Authentification requise."));
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      issuer: "money-tiana-api",
      audience: "money-tiana-frontend",
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    ) {
      next(new AppError(401, "Jeton d'authentification invalide."));
      return;
    }

    req.user = {
      id: Number(payload.sub),
    };

    next();
  } catch {
    next(
      new AppError(
        401,
        "Jeton d'authentification invalide ou expiré.",
      ),
    );
  }
};