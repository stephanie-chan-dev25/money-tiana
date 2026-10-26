import {
  createTransaction as insertTransaction,
  deleteTransaction as removeTransaction,
  findTransactionById,
  findTransactionsByUserId,
  updateTransaction as updateTransactionInDatabase,
  type Transaction,
  type TransactionInput,
} from "../repositories/transaction.repository.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../schemas/transaction.schema.js";
import { AppError } from "../errors/app.error.js";

function validateUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(401, "Authentification requise.");
  }
}

function validateTransactionId(transactionId: number): void {
  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    throw new AppError(400, "Identifiant de transaction invalide.");
  }
}

export async function getTransactions(
  userId: number,
): Promise<Transaction[]> {
  validateUserId(userId);
  return findTransactionsByUserId(userId);
}

export async function getTransaction(
  userId: number,
  transactionId: number,
): Promise<Transaction> {
  validateUserId(userId);
  validateTransactionId(transactionId);

  const transaction = await findTransactionById(userId, transactionId);

  if (!transaction) {
    throw new AppError(404, "Transaction introuvable.");
  }

  return transaction;
}

export async function createTransactionForUser(
  userId: number,
  input: CreateTransactionInput,
): Promise<Transaction> {
  validateUserId(userId);

  const transaction = await insertTransaction(
    userId,
    input as TransactionInput,
  );

  if (!transaction) {
    throw new AppError(
      400,
      "Le portefeuille ou la catégorie n'existe pas ou ne vous appartient pas.",
    );
  }

  return transaction;
}

export async function updateTransactionForUser(
  userId: number,
  transactionId: number,
  input: UpdateTransactionInput,
): Promise<Transaction> {
  validateUserId(userId);
  validateTransactionId(transactionId);

  const transaction = await updateTransactionInDatabase(
    userId,
    transactionId,
    input as TransactionInput,
  );

  if (!transaction) {
    throw new AppError(
      404,
      "Transaction introuvable, ou portefeuille/catégorie invalide pour cet utilisateur.",
    );
  }

  return transaction;
}

export async function deleteTransactionForUser(
  userId: number,
  transactionId: number,
): Promise<void> {
  validateUserId(userId);
  validateTransactionId(transactionId);

  const deleted = await removeTransaction(userId, transactionId);

  if (!deleted) {
    throw new AppError(404, "Transaction introuvable.");
  }
}