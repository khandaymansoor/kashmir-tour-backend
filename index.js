import dotenv from "dotenv";
dotenv.config(); // ✅ Must be before anything else
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "LOADED" : "NOT LOADED");
import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();

// ===============================
// CORS SETUP
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      "https://kashmir-tour-frontend.vercel.app" // your deployed frontend
    ],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-token"],
  })
);

app.options("*", cors());
app.use(express.json());
// ===============================
// ADMIN: GET ALL BOOKINGS (SECURE)
// ===============================
app.get("/admin/bookings", (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  connection.query("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// ===============================
// TOURS ROUTE (GET)
// ===============================
app.get("/tours", (req, res) => {
  console.log("👉 /tours API hit");

  const sql = "SELECT * FROM tours";

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Tours SQL Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(rows);
  });
});

// ===============================
// BOOKINGS ROUTE (POST)
// ===============================
app.post("/bookings", (req, res) => {
  console.log("📥 Incoming booking:", req.body);

  const { name, phone, email, tour_name, persons, message } = req.body;

  if (!name || !phone || !tour_name) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  const sql = `
    INSERT INTO bookings 
    (name, phone, email, tour_name, persons, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, phone, email || null, tour_name, persons || 1, message || null],
    (err, result) => {
      if (err) {
        console.error("❌ Booking SQL Error:", err);
        return res.status(500).json({
          success: false,
          mysqlError: err.message,
        });
      }

      res.json({
        success: true,
        bookingId: result.insertId,
      });
    }
  );
});

// ===============================
// ADMIN: GET ALL BOOKINGS (FIXED)
// ===============================
app.get("/admin/bookings", (req, res) => {
  connection.query("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});