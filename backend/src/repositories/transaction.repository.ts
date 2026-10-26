import type { QueryResultRow } from "pg";
import { pool } from "../config/database.js";

export interface Transaction extends QueryResultRow {
  id: number;
  amount: string;
  date: string;
  description: string | null;
  category_id: number;
  wallet_id: number;
  category_name: string;
  category_type: "income" | "expense";
}

export interface TransactionInput {
  amount: number;
  date: string;
  description?: string | null;
  category_id: number;
  wallet_id: number;
}

const transactionSelect = `
  SELECT
    t.id,
    t.amount,
    TO_CHAR(t.date, 'YYYY-MM-DD') AS date,
    t.description,
    t.category_id,
    t.wallet_id,
    c.name AS category_name,
    c.type AS category_type
  FROM transactions t
  INNER JOIN categories c ON c.id = t.category_id
  INNER JOIN wallets w ON w.id = t.wallet_id
`;

export async function findTransactionsByUserId(
  userId: number,
): Promise<Transaction[]> {
  const result = await pool.query<Transaction>(
    `${transactionSelect}
     WHERE w.user_id = $1
       AND c.user_id = $1
     ORDER BY t.date DESC, t.id DESC`,
    [userId],
  );

  return result.rows;
}

export async function findTransactionById(
  userId: number,
  transactionId: number,
): Promise<Transaction | null> {
  const result = await pool.query<Transaction>(
    `${transactionSelect}
     WHERE w.user_id = $1
       AND c.user_id = $1
       AND t.id = $2
     LIMIT 1`,
    [userId, transactionId],
  );

  return result.rows[0] ?? null;
}

export async function createTransaction(
  userId: number,
  input: TransactionInput,
): Promise<Transaction | null> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ownership = await client.query(
      `SELECT w.id AS wallet_id, c.id AS category_id
       FROM wallets w
       CROSS JOIN categories c
       WHERE w.id = $1
         AND w.user_id = $3
         AND c.id = $2
         AND c.user_id = $3
       FOR UPDATE OF w, c`,
      [input.wallet_id, input.category_id, userId],
    );

    if (ownership.rowCount !== 1) {
      await client.query("ROLLBACK");
      return null;
    }

    const inserted = await client.query<{ id: number } & QueryResultRow>(
      `INSERT INTO transactions
         (amount, date, description, category_id, wallet_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        input.amount,
        input.date,
        input.description ?? null,
        input.category_id,
        input.wallet_id,
      ],
    );

    const transaction = await client.query<Transaction>(
      `${transactionSelect}
       WHERE t.id = $1
         AND w.user_id = $2
         AND c.user_id = $2`,
      [inserted.rows[0]!.id, userId],
    );

    await client.query("COMMIT");
    return transaction.rows[0] ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateTransaction(
  userId: number,
  transactionId: number,
  input: TransactionInput,
): Promise<Transaction | null> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT t.id
       FROM transactions t
       INNER JOIN wallets w ON w.id = t.wallet_id
       INNER JOIN categories c ON c.id = t.category_id
       WHERE t.id = $1
         AND w.user_id = $2
         AND c.user_id = $2
       FOR UPDATE OF t`,
      [transactionId, userId],
    );

    if (existing.rowCount !== 1) {
      await client.query("ROLLBACK");
      return null;
    }

    const ownership = await client.query(
      `SELECT w.id AS wallet_id, c.id AS category_id
       FROM wallets w
       CROSS JOIN categories c
       WHERE w.id = $1
         AND w.user_id = $3
         AND c.id = $2
         AND c.user_id = $3
       FOR UPDATE OF w, c`,
      [input.wallet_id, input.category_id, userId],
    );

    if (ownership.rowCount !== 1) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `UPDATE transactions
       SET amount = $1,
           date = $2,
           description = $3,
           category_id = $4,
           wallet_id = $5
       WHERE id = $6`,
      [
        input.amount,
        input.date,
        input.description ?? null,
        input.category_id,
        input.wallet_id,
        transactionId,
      ],
    );

    const updated = await client.query<Transaction>(
      `${transactionSelect}
       WHERE t.id = $1
         AND w.user_id = $2
         AND c.user_id = $2`,
      [transactionId, userId],
    );

    await client.query("COMMIT");
    return updated.rows[0] ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteTransaction(
  userId: number,
  transactionId: number,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM transactions t
     USING wallets w, categories c
     WHERE t.wallet_id = w.id
       AND t.category_id = c.id
       AND t.id = $1
       AND w.user_id = $2
       AND c.user_id = $2`,
    [transactionId, userId],
  );

  return result.rowCount !== null && result.rowCount > 0;
}