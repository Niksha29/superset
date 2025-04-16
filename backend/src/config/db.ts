import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,         // Your PostgreSQL username
  host: process.env.DB_HOST,         // Database host (usually localhost)
  database: process.env.DB_NAME,     // Database name
  password: process.env.DB_PASSWORD, // Your PostgreSQL password
  port: Number(process.env.DB_PORT), // Default PostgreSQL port is 5432
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL "))
  .catch((err: Error) => console.error("PostgreSQL Connection Error", err));
