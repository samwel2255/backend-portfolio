const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get about content (returns first row)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about ORDER BY id LIMIT 1');
    res.json(result.rows[0] || { content: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update or create about content
router.put('/', async (req, res) => {
  try {
    const { content } = req.body;
    const existing = await pool.query('SELECT id FROM about ORDER BY id LIMIT 1');
    if (existing.rows.length) {
      const id = existing.rows[0].id;
      const result = await pool.query('UPDATE about SET content=$1 WHERE id=$2 RETURNING *', [content, id]);
      return res.json(result.rows[0]);
    }
    const result = await pool.query('INSERT INTO about (content) VALUES ($1) RETURNING *', [content]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
