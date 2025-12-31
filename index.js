import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

/* GET ALL TOURS */
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* GET SINGLE TOUR */
app.get("/tours/:id", (req, res) => {
  connection.query(
    "SELECT * FROM tours WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Tour not found" });
      }

      res.json(result[0]);
    }
  );
});

/* SAVE BOOKING */
app.post("/bookings", (req, res) => {
  const { tourId, name, email, phone, travelDate } = req.body;

  connection.query(
    "INSERT INTO bookings (tour_id, name, email, phone, travel_date) VALUES (?, ?, ?, ?, ?)",
    [tourId, name, email, phone, travelDate],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        bookingId: result.insertId,
      });
    }
  );
});

/* ✅ ADMIN: VIEW ALL BOOKINGS */
app.get("/admin/bookings", (req, res) => {
  connection.query(
    "SELECT * FROM bookings ORDER BY created_at DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});