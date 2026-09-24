import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export async function connectDatabase() {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("Connected to PostgreSQL");
  } finally {
    client.release();
  }
}

export default pool;