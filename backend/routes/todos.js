const express = require("express");
const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query("SELECT * FROM todos ORDER BY id ASC");
    res.json(Array.isArray(result.rows) ? result.rows : []); 
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json([]); 
  }
});

// GET a specific todo based on ID
router.get("/:id", async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query("SELECT * FROM todos WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo does not exist!" });
    }
    res.json(result.rows[0]); // Return single object instead of array wrapper
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new todo
router.post("/", async (req, res) => {
  const db = req.app.get('db');
  const { title, description, is_complete, due_date } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO todos (title, description, is_complete, due_date) VALUES ($1, $2, $3, $4) RETURNING *", 
      [title, description, is_complete || false, due_date || new Date()]
    );
    res.status(201).json(result.rows[0]); // FIX: Return single object row match
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH / UPDATE a todo
router.patch("/:id", async (req, res) => {
  const db = req.app.get('db');
  const { title, description, is_complete, due_date } = req.body;
  try {
    const result = await db.query(
      `UPDATE todos 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           is_complete = COALESCE($3, is_complete), 
           due_date = COALESCE($4, due_date) 
       WHERE id = $5 RETURNING *`,
      [title, description, is_complete, due_date, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo does not exist!" });
    }
    res.json(result.rows[0]); // FIX: Return single object row match
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query("DELETE FROM todos WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo does not exist!" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
