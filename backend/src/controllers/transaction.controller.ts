import type { Request, RequestHandler } from "express";
import * as transactionService from "../services/transaction.service.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../schemas/transaction.schema.js";
import { AppError } from "../errors/app.error.js";

function getAuthenticatedUserId(req: Request): number {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentification requise.");
  }

  return userId;
}

export const getTransactions: RequestHandler = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(
      getAuthenticatedUserId(req),
    );

    res.status(200).json({ transactions });
  } catch (error: unknown) {
    next(error);
  }
};

export const getTransaction: RequestHandler = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransaction(
      getAuthenticatedUserId(req),
      Number(req.params.id),
    );

    res.status(200).json({ transaction });
  } catch (error: unknown) {
    next(error);
  }
};

export const createTransaction: RequestHandler = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransactionForUser(
      getAuthenticatedUserId(req),
      req.body as CreateTransactionInput,
    );

    res.status(201).json({ transaction });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateTransaction: RequestHandler = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransactionForUser(
      getAuthenticatedUserId(req),
      Number(req.params.id),
      req.body as UpdateTransactionInput,
    );

    res.status(200).json({ transaction });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteTransaction: RequestHandler = async (req, res, next) => {
  try {
    await transactionService.deleteTransactionForUser(
      getAuthenticatedUserId(req),
      Number(req.params.id),
    );

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};