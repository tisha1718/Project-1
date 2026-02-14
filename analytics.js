const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// Top consumed components
router.get("/top-consumed", auth, async (req, res) => {
  const data = await pool.query(`
    SELECT components.name, SUM(consumption_logs.consumed_qty) AS total_consumed
    FROM consumption_logs
    JOIN components ON components.id = consumption_logs.component_id
    GROUP BY components.name
    ORDER BY total_consumed DESC
    LIMIT 5;
  `);

  res.json(data.rows);
});

// Low stock trigger (<20%)
router.get("/low-stock", auth, async (req, res) => {
  const data = await pool.query(`
    SELECT * FROM components
    WHERE stock < (monthly_required * 0.2)
    ORDER BY stock ASC;
  `);

  res.json(data.rows);
});

module.exports = router;
