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
    const { content, extra } = req.body;
    const existing = await pool.query('SELECT id FROM about ORDER BY id LIMIT 1');
    if (existing.rows.length) {
      const id = existing.rows[0].id;
      const result = await pool.query('UPDATE about SET content=$1, extra=$2 WHERE id=$3 RETURNING *', [content, extra, id]);
      return res.json(result.rows[0]);
    }
    const result = await pool.query('INSERT INTO about (content, extra) VALUES ($1, $2) RETURNING *', [content, extra]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
