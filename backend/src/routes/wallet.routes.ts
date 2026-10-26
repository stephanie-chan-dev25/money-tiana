import { Router } from "express";

import * as walletController from "../controllers/wallet.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/origin.middleware.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";

import {
  createWalletSchema,
  updateWalletSchema,
  walletIdSchema,
} from "../schemas/wallet.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", walletController.getWallets);

router.post(
  "/",
  requireTrustedOrigin,
  validateBody(createWalletSchema),
  walletController.createWallet,
);

router.get(
  "/:id",
  validateParams(walletIdSchema),
  walletController.getWallet,
);

router.patch(
  "/:id",
  requireTrustedOrigin,
  validateParams(walletIdSchema),
  validateBody(updateWalletSchema),
  walletController.updateWallet,
);

router.delete(
  "/:id",
  requireTrustedOrigin,
  validateParams(walletIdSchema),
  walletController.deleteWallet,
);

export default router;