import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* TEST */
app.get("/", (req, res) => {
  res.send("Travel Backend Running");
});

/* GET ALL TOURS */
app.get("/api/tours", (req, res) => {
  db.query("SELECT * FROM tours", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* GET TOUR BY ID */
app.get("/api/tours/:id", (req, res) => {
  db.query(
    "SELECT * FROM tours WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
});

/* BOOK TOUR */
app.post("/api/bookings", (req, res) => {
  const { name, email, phone, tour_id, travel_date } = req.body;

  db.query(
    "INSERT INTO bookings (name,email,phone,tour_id,travel_date) VALUES (?,?,?,?,?)",
    [name, email, phone, tour_id, travel_date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Booking successful" });
    }
  );
});

app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});