import express from "express";
import cors from "cors";
import connection from "./db/connection.js";

const app = express();

// ✅ CORS FIX
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://kashmir-tour-frontend-git-main-mansoor-ahmad-khanday-s-projects.vercel.app"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// BOOKINGS ROUTE
app.post("/bookings", (req, res) => {
  const { name, phone, email, tour_name, persons, message } = req.body;

  const sql = `
    INSERT INTO bookings (name, phone, email, tour_name, persons, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, phone, email, tour_name, persons, message],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});