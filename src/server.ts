import express from "express";
import dotenv from "dotenv";
import { connectRedis } from "./redis.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || "unknown";

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    instance: INSTANCE_ID,
  });
});

async function startServer() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

startServer();