import { Request, Response, NextFunction } from "express";
import redis from "../redis.js";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 10;

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip || "unknown";

  const key = `rate-limit:${ip}`;

  const requestCount = await redis.incr(key);

  if (requestCount === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  if (requestCount > MAX_REQUESTS) {
    const ttl = await redis.ttl(key);

    return res.status(429).json({
      error: "Too many requests",
      retryAfter: ttl,
    });
  }

  next();
}