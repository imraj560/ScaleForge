import express from "express";
import dotenv from "dotenv";
import { connectRedis } from "./redis.js";
import productsRoutes from "./routes/products.routes.js"
import { rateLimiter } from "./middleware/rateLimiter.js";
import { connectDatabase } from "./db.js";
import { metricsMiddleware } from "./middleware/metrics.middleware.js";
import { register } from "./metrics.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(metricsMiddleware);

const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || "unknown";

app.use("/api", rateLimiter);

app.use("/api/products", productsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    instance: INSTANCE_ID,
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

async function startServer() {
  await connectRedis();
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

startServer();