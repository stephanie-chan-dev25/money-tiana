import { pool } from "../config/database.js";

export interface Wallet {
  id: number;
  name: string;
  balance: string;
}

export async function findWalletsByUserId(
  userId: number,
): Promise<Wallet[]> {
  const result = await pool.query<Wallet>(
    `
      SELECT
        w.id,
        w.name,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'income' THEN t.amount
              WHEN c.type = 'expense' THEN -t.amount
              ELSE 0
            END
          ),
          0
        )::numeric(12, 2) AS balance
      FROM wallets w
      LEFT JOIN transactions t
        ON t.wallet_id = w.id
      LEFT JOIN categories c
        ON c.id = t.category_id
      WHERE w.user_id = $1
      GROUP BY w.id, w.name
      ORDER BY w.id ASC
    `,
    [userId],
  );

  return result.rows;
}

export async function findWalletById(
  userId: number,
  walletId: number,
): Promise<Wallet | null> {
  const result = await pool.query<Wallet>(
    `
      SELECT
        w.id,
        w.name,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'income' THEN t.amount
              WHEN c.type = 'expense' THEN -t.amount
              ELSE 0
            END
          ),
          0
        )::numeric(12, 2) AS balance
      FROM wallets w
      LEFT JOIN transactions t
        ON t.wallet_id = w.id
      LEFT JOIN categories c
        ON c.id = t.category_id
      WHERE w.user_id = $1
        AND w.id = $2
      GROUP BY w.id, w.name
      LIMIT 1
    `,
    [userId, walletId],
  );

  return result.rows[0] ?? null;
}

export async function createWallet(
  userId: number,
  name: string,
): Promise<Wallet> {
  const result = await pool.query<Wallet>(
    `
      INSERT INTO wallets (name, user_id)
      VALUES ($1, $2)
      RETURNING id, name
    `,
    [name, userId],
  );

  const wallet = result.rows[0];

  return {
    ...wallet,
    balance: "0.00",
  };
}

export async function updateWalletName(
  userId: number,
  walletId: number,
  name: string,
): Promise<Wallet | null> {
  const result = await pool.query<{ id: number }>(
    `
      UPDATE wallets
      SET name = $1
      WHERE id = $2
        AND user_id = $3
      RETURNING id
    `,
    [name, walletId, userId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return findWalletById(userId, walletId);
}

export async function deleteWallet(
  userId: number,
  walletId: number,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM wallets
      WHERE id = $1
        AND user_id = $2
    `,
    [walletId, userId],
  );

  return result.rowCount !== null && result.rowCount > 0;
}