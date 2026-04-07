import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import transactionRoutes from "./routes/transaction.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;