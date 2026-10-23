import type {
  ErrorRequestHandler,
} from "express";

import { AppError } from "../errors/app.error.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });

    return;
  }

  console.error("Unexpected server error:", error);

  res.status(500).json({
    error: {
      message: "Une erreur interne est survenue.",
    },
  });
};