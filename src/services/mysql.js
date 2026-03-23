import mysql from "mysql2/promise";

// Next.js runs multiple instances in development; cache the pool on the global object to avoid
// creating too many connections.
const pool = globalThis.__mysqlPool ?? mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

if (!globalThis.__mysqlPool) {
  globalThis.__mysqlPool = pool;
}

export async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}
