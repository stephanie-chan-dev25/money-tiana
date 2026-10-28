import { z } from "zod";

export const createGoalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de l’objectif est obligatoire.")
    .max(100, "Le nom ne doit pas dépasser 100 caractères."),
  target_amount: z.coerce
    .number()
    .finite("Le montant cible doit être un nombre valide.")
    .positive("Le montant cible doit être supérieur à zéro."),
});

export const goalIdSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "L’identifiant doit être un entier positif."),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;