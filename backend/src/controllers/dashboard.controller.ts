import type { RequestHandler } from "express";
import * as dashboardService from "../services/dashboard.service.js";
import { AppError } from "../errors/app.error.js";

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, "Authentification requise.");
    }

    const dashboard = await dashboardService.getDashboard(userId);

    res.status(200).json({ dashboard });
  } catch (error: unknown) {
    next(error);
  }
};