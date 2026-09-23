import { Router } from "express";
import redis from "../redis.js";

const router = Router();

router.get("/", async (req, res) => {
  const cacheKey = "products";

  // 1. Check Redis
  const cachedProducts = await redis.get(cacheKey);

  if (cachedProducts) {
    console.log("CACHE HIT");

    return res.json({
      source: "redis",
      data: JSON.parse(cachedProducts),
    });
  }

  console.log("CACHE MISS");

  // 2. Simulate a database query
  const products = [
    {
      id: 1,
      name: "MacBook Pro",
      price: 1999,
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 129,
    },
    {
      id: 3,
      name: "Wireless Mouse",
      price: 59,
    },
  ];

  // 3. Store the result in Redis
  await redis.setEx(
    cacheKey,
    60,
    JSON.stringify(products)
  );

  // 4. Return the data
  return res.json({
    source: "database",
    data: products,
  });
});

export default router;


