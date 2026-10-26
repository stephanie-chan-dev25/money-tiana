import { z } from "zod";

export const createWalletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom du portefeuille est obligatoire.")
    .max(100, "Le nom ne doit pas dépasser 100 caractères."),
});

export const updateWalletSchema = createWalletSchema;

export const walletIdSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "L'identifiant doit être un entier positif."),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
