import type { RequestHandler } from "express";

import * as walletService from "../services/wallet.service.js";

import type {
  CreateWalletInput,
  UpdateWalletInput,
} from "../schemas/wallet.schema.js";

import { AppError } from "../errors/app.error.js";

function getAuthenticatedUserId(req: Parameters<RequestHandler>[0]): number {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentification requise.");
  }

  return userId;
}

export const getWallets: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const wallets = await walletService.getWallets(userId);

    res.status(200).json({ wallets });
  } catch (error) {
    next(error);
  }
};

export const getWallet: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const walletId = Number(req.params.id);

    const wallet = await walletService.getWallet(
      userId,
      walletId,
    );

    res.status(200).json({ wallet });
  } catch (error) {
    next(error);
  }
};

export const createWallet: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    const wallet = await walletService.createWalletForUser(
      userId,
      req.body as CreateWalletInput,
    );

    res.status(201).json({ wallet });
  } catch (error) {
    next(error);
  }
};

export const updateWallet: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const walletId = Number(req.params.id);

    const wallet = await walletService.updateWalletForUser(
      userId,
      walletId,
      req.body as UpdateWalletInput,
    );

    res.status(200).json({ wallet });
  } catch (error) {
    next(error);
  }
};

export const deleteWallet: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const walletId = Number(req.params.id);

    await walletService.deleteWalletForUser(userId, walletId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};