import { Router } from "express";
import redis from "../redis.js";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cacheKey = "products";

    const cachedProducts = await redis.get(cacheKey);

    if (cachedProducts) {
      console.log("CACHE HIT");

      return res.json({
        source: "redis",
        data: JSON.parse(cachedProducts),
      });
    }

    console.log("CACHE MISS");

    const result = await pool.query(
      "SELECT id, name, price FROM products ORDER BY id"
    );

    await redis.setEx(
      cacheKey,
      60,
      JSON.stringify(result.rows)
    );

    return res.json({
      source: "postgres",
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;