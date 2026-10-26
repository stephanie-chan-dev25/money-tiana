import { z } from "zod";

export const categoryTypeSchema = z.enum(["income", "expense"]);

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de la catégorie est obligatoire.")
    .max(100, "Le nom ne doit pas dépasser 100 caractères."),
  type: categoryTypeSchema,
});

export const updateCategorySchema = createCategorySchema;

export const categoryIdSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "L'identifiant doit être un entier positif."),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;