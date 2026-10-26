import type { Request, RequestHandler } from "express";
import * as categoryService from "../services/category.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema.js";
import { AppError } from "../errors/app.error.js";

function getAuthenticatedUserId(req: Request): number {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentification requise.");
  }

  return userId;
}

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(
      getAuthenticatedUserId(req),
    );

    res.status(200).json({ categories });
  } catch (error: unknown) {
    next(error);
  }
};

export const getCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await categoryService.getCategory(
      getAuthenticatedUserId(req),
      Number(req.params.id),
    );

    res.status(200).json({ category });
  } catch (error: unknown) {
    next(error);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await categoryService.createCategoryForUser(
      getAuthenticatedUserId(req),
      req.body as CreateCategoryInput,
    );

    res.status(201).json({ category });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategoryForUser(
      getAuthenticatedUserId(req),
      Number(req.params.id),
      req.body as UpdateCategoryInput,
    );

    res.status(200).json({ category });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    await categoryService.deleteCategoryForUser(
      getAuthenticatedUserId(req),
      Number(req.params.id),
    );

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};