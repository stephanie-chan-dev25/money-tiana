import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .refine(
    (password) => new TextEncoder().encode(password).length <= 72,
    "Le mot de passe ne doit pas dépasser 72 octets.",
  );

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("L'adresse e-mail est invalide.")
    .max(255, "L'adresse e-mail est trop longue.")
    .transform((email) => email.toLowerCase()),

  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("L'adresse e-mail est invalide.")
    .max(255, "L'adresse e-mail est trop longue.")
    .transform((email) => email.toLowerCase()),

  password: z.string().min(1, "Le mot de passe est obligatoire."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;