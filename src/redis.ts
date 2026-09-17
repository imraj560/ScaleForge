import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL,
})

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

export async function connectRedis() {
  await redis.connect();
  console.log("Connected to Redis");
}

export default redis;