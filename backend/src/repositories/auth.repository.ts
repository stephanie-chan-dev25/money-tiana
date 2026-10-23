import { pool } from "../config/database.js";

export interface UserRecord {
  id: number;
  email: string;
  password: string;
}

export interface PublicUser {
  id: number;
  email: string;
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const result = await pool.query<UserRecord>(
    `
      SELECT id, email, password
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<PublicUser> {
  const result = await pool.query<PublicUser>(
    `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email
    `,
    [email, passwordHash],
  );

  return result.rows[0];
}

export async function findUserById(
  id: number,
): Promise<PublicUser | null> {
  const result = await pool.query<PublicUser>(
    `
      SELECT id, email
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}