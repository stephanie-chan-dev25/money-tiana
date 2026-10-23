import type { RequestHandler } from "express";

import * as authService from "../services/auth.service.js";
import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";

const COOKIE_NAME = "money_tiana_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const register: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const result = await authService.register(
      req.body as RegisterInput,
    );

    res.cookie(COOKIE_NAME, result.token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const result = await authService.login(
      req.body as LoginInput,
    );

    res.cookie(COOKIE_NAME, result.token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  res.status(200).json({
    message: "Déconnexion réussie.",
  });
};

export const me: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      next(new Error("L'identifiant utilisateur est absent."));
      return;
    }

    const user = await authService.getCurrentUser(userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};