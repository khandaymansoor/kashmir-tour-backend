import dotenv from "dotenv";
dotenv.config();

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "LOADED" : "NOT LOADED");

import express from "express";
import cors from "cors";
import connection from "./db/connection.js"; // ✅ ONLY ONCE

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/tours/:id", (req, res) => {
  connection.query(
    "SELECT * FROM tours WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

app.post("/bookings", (req, res) => {
  const { tourId, name, phone, travelDate } = req.body;

  connection.query(
    "INSERT INTO bookings (tour_id, name, phone, travel_date) VALUES (?, ?, ?, ?)",
    [tourId, name, phone, travelDate],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Booking saved ✅" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});