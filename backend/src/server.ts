import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Money Tiana API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Money Tiana API is running on http://localhost:${PORT}`);
});