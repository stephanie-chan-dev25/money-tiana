import "dotenv/config";

import app from "./app.js";
import { pool } from "./config/database.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Money Tiana API running on http://localhost:${PORT}`);
      console.log("PostgreSQL connection successful");
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
    await pool.end();
    process.exitCode = 1;
  }
}

startServer();