import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();

/* =========================
   CORS – FINAL & CORRECT
========================= */
app.use(
  cors({
    origin: "*", // allow all (OK for now)
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// VERY IMPORTANT
app.options("*", cors());

app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   TOURS ROUTE
========================= */
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(result);
  });
});

/* =========================
   BOOKINGS ROUTE (POST)
========================= */
app.post("/bookings", (req, res) => {
  const { name, phone, email, tour_name, persons, message } = req.body;

  if (!name || !phone || !tour_name) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const sql = `
    INSERT INTO bookings (name, phone, email, tour_name, persons, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, phone, email, tour_name, persons, message],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

/* =========================
   START SERVER (RENDER)
========================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});