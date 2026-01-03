app.get("/tours", (req, res) => {
  console.log("👉 /tours route hit");

  connection.query("SELECT * FROM tours", (err, results) => {
    if (err) {
      console.error("❌ TOURS QUERY ERROR:", err);
      return res.status(500).json({
        message: "Tours query failed",
        error: err.message,
      });
    }

    console.log("✅ Tours fetched:", results.length);
    res.json(results);
  });
});