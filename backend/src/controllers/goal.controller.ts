import type { RequestHandler } from "express";

import { AppError } from "../errors/app.error.js";
import type { CreateGoalInput } from "../schemas/goal.schema.js";
import * as goalService from "../services/goal.service.js";

function getAuthenticatedUserId(req: Parameters<RequestHandler>[0]): number {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError(401, "Authentification requise.");
  }
  return userId;
}

export const getGoals: RequestHandler = async (req, res, next) => {
  try {
    const goals = await goalService.getGoalsForUser(getAuthenticatedUserId(req));
    res.status(200).json({ goals });
  } catch (error) {
    next(error);
  }
};

export const createGoal: RequestHandler = async (req, res, next) => {
  try {
    const goal = await goalService.createGoalForUser(
      getAuthenticatedUserId(req),
      req.body as CreateGoalInput,
    );
    res.status(201).json({ goal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal: RequestHandler = async (req, res, next) => {
  try {
    await goalService.deleteGoalForUser(
      getAuthenticatedUserId(req),
      Number(req.params.id),
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
