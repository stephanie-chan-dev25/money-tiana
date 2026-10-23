import { Router } from "express";

import * as authController from "../controllers/auth.controller.js";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/origin.middleware.js";

const router = Router();

router.post(
  "/register",
  requireTrustedOrigin,
  validateBody(registerSchema),
  authController.register,
);

router.post(
  "/login",
  requireTrustedOrigin,
  validateBody(loginSchema),
  authController.login,
);

router.post(
  "/logout",
  requireTrustedOrigin,
  requireAuth,
  authController.logout,
);

router.get(
  "/me",
  requireAuth,
  authController.me,
);

export default router;