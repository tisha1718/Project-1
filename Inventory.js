const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// Add component
router.post("/add", auth, async (req, res) => {
  const { name, stock, monthly_required } = req.body;

  const newComp = await pool.query(
    "INSERT INTO components (name, stock, monthly_required) VALUES ($1,$2,$3) RETURNING *",
    [name, stock, monthly_required]
  );

  res.json(newComp.rows[0]);
});

// Get all components
router.get("/", auth, async (req, res) => {
  const comps = await pool.query("SELECT * FROM components ORDER BY id ASC");
  res.json(comps.rows);
});

module.exports = router;
