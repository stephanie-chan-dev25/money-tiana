import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/origin.middleware.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", categoryController.getCategories);

router.post(
  "/",
  requireTrustedOrigin,
  validateBody(createCategorySchema),
  categoryController.createCategory,
);

router.get(
  "/:id",
  validateParams(categoryIdSchema),
  categoryController.getCategory,
);

router.patch(
  "/:id",
  requireTrustedOrigin,
  validateParams(categoryIdSchema),
  validateBody(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  requireTrustedOrigin,
  validateParams(categoryIdSchema),
  categoryController.deleteCategory,
);

export default router;