const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// ✅ Create a new tour
router.post('/', (req, res) => {
  const { title, price, image } = req.body;

  // Basic validation
  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  const sql = 'INSERT INTO tours (title, price, image) VALUES (?, ?, ?)';
  connection.query(sql, [title, price, image || null], (err, result) => {
    if (err) {
      console.error('Error creating tour:', err);
      return res.status(500).json({ error: 'Failed to create tour' });
    }

    res.status(201).json({
      id: result.insertId,
      title,
      price,
      image: image || null,
    });
  });
});

module.exports = router;