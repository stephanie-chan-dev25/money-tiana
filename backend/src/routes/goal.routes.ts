import { Router } from "express";

import * as goalController from "../controllers/goal.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/origin.middleware.js";
import { validateBody, validateParams } from "../middlewares/validate.middleware.js";
import { createGoalSchema, goalIdSchema } from "../schemas/goal.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", goalController.getGoals);
router.post(
  "/",
  requireTrustedOrigin,
  validateBody(createGoalSchema),
  goalController.createGoal,
);
router.delete(
  "/:id",
  requireTrustedOrigin,
  validateParams(goalIdSchema),
  goalController.deleteGoal,
);

export default router;
