import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/origin.middleware.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  createTransactionSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", transactionController.getTransactions);

router.post(
  "/",
  requireTrustedOrigin,
  validateBody(createTransactionSchema),
  transactionController.createTransaction,
);

router.get(
  "/:id",
  validateParams(transactionIdSchema),
  transactionController.getTransaction,
);

router.patch(
  "/:id",
  requireTrustedOrigin,
  validateParams(transactionIdSchema),
  validateBody(updateTransactionSchema),
  transactionController.updateTransaction,
);

router.delete(
  "/:id",
  requireTrustedOrigin,
  validateParams(transactionIdSchema),
  transactionController.deleteTransaction,
);

export default router;