import mysql from "mysql2";

// Debug: log the actual values being passed
console.log("Connecting to MySQL with:");
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("PASSWORD:", process.env.DB_PASSWORD ? "LOADED" : "NOT LOADED");
console.log("DB:", process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "KhandayZahoor@123",
  database: process.env.DB_NAME || "travel_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

export default connection;