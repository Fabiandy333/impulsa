import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
console.log("URL BD:", process.env.DATABASE_URL);

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;

