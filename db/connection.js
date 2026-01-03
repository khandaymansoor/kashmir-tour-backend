import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,          // crossover.proxy.rlwy.net
  port: Number(process.env.DB_PORT),  // 21261
  user: process.env.DB_USER,          // root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 15000,
});

console.log("✅ MySQL connected successfully");

export default connection;