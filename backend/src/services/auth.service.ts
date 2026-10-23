import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
  findUserById,
  type PublicUser,
} from "../repositories/auth.repository.js";

import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";

import { AppError } from "../errors/app.error.js";
import { getJwtSecret } from "../config/jwt.js";

export interface AuthResult {
  user: PublicUser;
  token: string;
}

function createToken(user: PublicUser): string {
  return jwt.sign(
    { email: user.email },
    getJwtSecret(),
    {
      subject: String(user.id),
      expiresIn: "1h",
      issuer: "money-tiana-api",
      audience: "money-tiana-frontend",
    },
  );
}

export async function register(
  input: RegisterInput,
): Promise<AuthResult> {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError(
      409,
      "Un compte utilise déjà cette adresse e-mail.",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  let user: PublicUser;

  try {
    user = await createUser(input.email, passwordHash);
  } catch (error) {
    // L'index UNIQUE de PostgreSQL protège également contre
    // deux inscriptions simultanées avec la même adresse.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new AppError(
        409,
        "Un compte utilise déjà cette adresse e-mail.",
      );
    }

    throw error;
  }

  return {
    user,
    token: createToken(user),
  };
}

export async function login(
  input: LoginInput,
): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError(
      401,
      "Adresse e-mail ou mot de passe incorrect.",
    );
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password,
  );

  if (!passwordMatches) {
    throw new AppError(
      401,
      "Adresse e-mail ou mot de passe incorrect.",
    );
  }

  const publicUser: PublicUser = {
    id: user.id,
    email: user.email,
  };

  return {
    user: publicUser,
    token: createToken(publicUser),
  };
}

export async function getCurrentUser(
  id: number,
): Promise<PublicUser> {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError(401, "Compte introuvable ou non authentifié.");
  }

  return user;
}