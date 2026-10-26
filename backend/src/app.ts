import transactionRoutes from "./routes/transaction.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("La variable FRONTEND_URL est obligatoire.");
}

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Money Tiana API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
// Ce middleware doit rester après les routes.
app.use(errorMiddleware);

export default app;