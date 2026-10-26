import { pool } from "../config/database.js";

export interface WalletBalance {
  id: number;
  name: string;
  balance: string;
}

export interface CategoryTotal {
  category_id: number;
  category_name: string;
  total: string;
}

export interface DashboardSummary {
  totalBalance: string;
  wallets: WalletBalance[];
  monthlyIncome: string;
  incomeByCategory: CategoryTotal[];
  monthlyExpenses: string;
  expensesByCategory: CategoryTotal[];
  monthlySavings: string;
}

export async function getDashboardSummary(
  userId: number,
): Promise<DashboardSummary> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN READ ONLY");

    const walletsResult = await client.query<WalletBalance>(
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
        )::numeric(12, 2)::text AS balance
      FROM wallets w
      LEFT JOIN transactions t ON t.wallet_id = w.id
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE w.user_id = $1
      GROUP BY w.id, w.name
      ORDER BY w.id
      `,
      [userId],
    );

    const totalBalanceResult = await client.query<{ total: string }>(
      `
      SELECT COALESCE(SUM(balance), 0)::numeric(12, 2)::text AS total
      FROM (
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN c.type = 'income' THEN t.amount
                WHEN c.type = 'expense' THEN -t.amount
                ELSE 0
              END
            ),
            0
          ) AS balance
        FROM wallets w
        LEFT JOIN transactions t ON t.wallet_id = w.id
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE w.user_id = $1
        GROUP BY w.id
      ) AS wallet_balances
      `,
      [userId],
    );

    const incomeResult = await client.query<{ total: string }>(
      `
      SELECT COALESCE(SUM(t.amount), 0)::numeric(12, 2)::text AS total
      FROM transactions t
      INNER JOIN categories c ON c.id = t.category_id
      INNER JOIN wallets w ON w.id = t.wallet_id
      WHERE w.user_id = $1
        AND c.user_id = $1
        AND c.type = 'income'
        AND t.date >= date_trunc('month', CURRENT_DATE)::date
        AND t.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
      `,
      [userId],
    );

    const incomeByCategoryResult = await client.query<CategoryTotal>(
      `
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        SUM(t.amount)::numeric(12, 2)::text AS total
      FROM transactions t
      INNER JOIN categories c ON c.id = t.category_id
      INNER JOIN wallets w ON w.id = t.wallet_id
      WHERE w.user_id = $1
        AND c.user_id = $1
        AND c.type = 'income'
        AND t.date >= date_trunc('month', CURRENT_DATE)::date
        AND t.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
      GROUP BY c.id, c.name
      ORDER BY SUM(t.amount) DESC, c.name
      `,
      [userId],
    );

    const expensesResult = await client.query<{ total: string }>(
      `
      SELECT COALESCE(SUM(t.amount), 0)::numeric(12, 2)::text AS total
      FROM transactions t
      INNER JOIN categories c ON c.id = t.category_id
      INNER JOIN wallets w ON w.id = t.wallet_id
      WHERE w.user_id = $1
        AND c.user_id = $1
        AND c.type = 'expense'
        AND t.date >= date_trunc('month', CURRENT_DATE)::date
        AND t.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
      `,
      [userId],
    );

    const expensesByCategoryResult = await client.query<CategoryTotal>(
      `
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        SUM(t.amount)::numeric(12, 2)::text AS total
      FROM transactions t
      INNER JOIN categories c ON c.id = t.category_id
      INNER JOIN wallets w ON w.id = t.wallet_id
      WHERE w.user_id = $1
        AND c.user_id = $1
        AND c.type = 'expense'
        AND t.date >= date_trunc('month', CURRENT_DATE)::date
        AND t.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
      GROUP BY c.id, c.name
      ORDER BY SUM(t.amount) DESC, c.name
      `,
      [userId],
    );

    const monthlyIncome = incomeResult.rows[0]?.total ?? "0.00";
    const monthlyExpenses = expensesResult.rows[0]?.total ?? "0.00";

    const savingsResult = await client.query<{ total: string }>(
      `
      SELECT (
        COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'income'), 0)
        -
        COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'expense'), 0)
      )::numeric(12, 2)::text AS total
      FROM transactions t
      INNER JOIN categories c ON c.id = t.category_id
      INNER JOIN wallets w ON w.id = t.wallet_id
      WHERE w.user_id = $1
        AND c.user_id = $1
        AND t.date >= date_trunc('month', CURRENT_DATE)::date
        AND t.date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
      `,
      [userId],
    );

    await client.query("COMMIT");

    return {
      totalBalance: totalBalanceResult.rows[0]?.total ?? "0.00",
      wallets: walletsResult.rows,
      monthlyIncome,
      incomeByCategory: incomeByCategoryResult.rows,
      monthlyExpenses,
      expensesByCategory: expensesByCategoryResult.rows,
      monthlySavings: savingsResult.rows[0]?.total ?? "0.00",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}