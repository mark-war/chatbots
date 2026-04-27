import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import chatRouter from "./routes/chat.js";
import uploadRouter from "./routes/upload.js";
import portfolioRouter from "./routes/portfolio.js";
import portfolioUploadRouter from "./routes/portfolio-upload.js";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

// === CONNECT DB WITH AWAIT ===
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected SUCCESSFULLY");
  } catch (err) {
    console.error("MongoDB CONNECTION FAILED:", err);
    process.exit(1); // Stop server if DB fails
  }

  // Routes
  app.use("/api", uploadRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/portfolio", portfolioRouter);
  app.use("/api/portfolio", portfolioUploadRouter);

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Backend: http://localhost:${PORT}`);
  });
})();
