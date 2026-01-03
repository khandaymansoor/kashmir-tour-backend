import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();

/* ✅ CORS – FINAL */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   BOOKINGS ROUTE
========================= */
app.post("/bookings", (req, res) => {
  const { name, phone, email, tour_name, persons, message } = req.body;

  if (!name || !phone || !tour_name) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const sql = `
    INSERT INTO bookings (name, phone, email, tour_name, persons, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, phone, email, tour_name, persons, message],
    (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3001;
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", (err, results) => {
    if (err) {
      console.error("Tours error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});