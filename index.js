import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express(); // ✅ FIXED HERE

// ===============================
// CORS
// ===============================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ===============================
// TOURS ROUTE
// ===============================
app.get("/tours", (req, res) => {
  console.log("👉 /tours hit");

  connection.query("SELECT * FROM tours", (err, results) => {
    if (err) {
      console.error("❌ Tours error:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// ===============================
// BOOKINGS ROUTE
// ===============================
app.post("/bookings", (req, res) => {
  const { name, phone, email, tour_name, persons, message } = req.body;

  const sql = `
    INSERT INTO bookings (name, phone, email, tour_name, persons, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, phone, email, tour_name, persons, message],
    (err) => {
      if (err) {
        console.error("❌ Booking error:", err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});