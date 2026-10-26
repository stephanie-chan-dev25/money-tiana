import {
  createWallet as insertWallet,
  findWalletById,
  findWalletsByUserId,
  updateWalletName,
  deleteWallet,
  type Wallet,
} from "../repositories/wallet.repository.js";

import type {
  CreateWalletInput,
  UpdateWalletInput,
} from "../schemas/wallet.schema.js";

import { AppError } from "../errors/app.error.js";

function validateUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(401, "Authentification requise.");
  }
}

export async function getWallets(
  userId: number,
): Promise<Wallet[]> {
  validateUserId(userId);

  return findWalletsByUserId(userId);
}

export async function getWallet(
  userId: number,
  walletId: number,
): Promise<Wallet> {
  validateUserId(userId);

  const wallet = await findWalletById(userId, walletId);

  if (!wallet) {
    throw new AppError(404, "Portefeuille introuvable.");
  }

  return wallet;
}

export async function createWalletForUser(
  userId: number,
  input: CreateWalletInput,
): Promise<Wallet> {
  validateUserId(userId);

  return insertWallet(userId, input.name);
}

export async function updateWalletForUser(
  userId: number,
  walletId: number,
  input: UpdateWalletInput,
): Promise<Wallet> {
  validateUserId(userId);

  const wallet = await updateWalletName(
    userId,
    walletId,
    input.name,
  );

  if (!wallet) {
    throw new AppError(404, "Portefeuille introuvable.");
  }

  return wallet;
}

export async function deleteWalletForUser(
  userId: number,
  walletId: number,
): Promise<void> {
  validateUserId(userId);

  try {
    const deleted = await deleteWallet(userId, walletId);

    if (!deleted) {
      throw new AppError(404, "Portefeuille introuvable.");
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23503"
    ) {
      throw new AppError(
        409,
        "Ce portefeuille possède des transactions et ne peut pas être supprimé.",
      );
    }

    throw error;
  }
}