import { z } from "zod";

const positiveIntegerString = z
  .string()
  .regex(/^[1-9]\d*$/, "L'identifiant doit être un entier positif.");

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit respecter le format YYYY-MM-DD.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value;
  }, "La date fournie est invalide.");

const amountSchema = z
  .number()
  .finite("Le montant doit être un nombre valide.")
  .positive("Le montant doit être strictement positif.")
  .refine(
    (value) => Math.round(value * 100) === value * 100,
    "Le montant ne doit pas dépasser deux décimales.",
  )
  .refine(
    (value) => value < 1_000_000_000_000,
    "Le montant dépasse la limite autorisée.",
  );

export const createTransactionSchema = z.object({
  amount: amountSchema,
  date: dateSchema,
  description: z
    .string()
    .trim()
    .nullable()
    .optional(),
  category_id: z.number().int().positive(),
  wallet_id: z.number().int().positive(),
});

export const updateTransactionSchema = createTransactionSchema;

export const transactionIdSchema = z.object({
  id: positiveIntegerString,
});

export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>;

export type UpdateTransactionInput = z.infer<
  typeof updateTransactionSchema
>;