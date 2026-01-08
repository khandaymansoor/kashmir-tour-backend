import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();

// ===============================
// CORS SETUP
// ===============================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

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