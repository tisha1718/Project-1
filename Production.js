const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// Production entry
router.post("/produce", auth, async (req, res) => {
  const { pcb_id, pcb_quantity } = req.body;

  try {
    // Fetch BOM mapping for PCB
    const bom = await pool.query(
      "SELECT * FROM bom_mapping WHERE pcb_id=$1",
      [pcb_id]
    );

    if (bom.rows.length === 0)
      return res.status(400).json({ msg: "No BOM mapping found!" });

    // Stock validation
    for (let item of bom.rows) {
      const comp = await pool.query(
        "SELECT * FROM components WHERE id=$1",
        [item.component_id]
      );

      const required = item.quantity_required * pcb_quantity;

      if (comp.rows[0].stock < required) {
        return res.status(400).json({
          msg: `Insufficient stock for component ID ${item.component_id}`
        });
      }
    }

    // Deduct stock + log consumption
    for (let item of bom.rows) {
      const required = item.quantity_required * pcb_quantity;

      await pool.query(
        "UPDATE components SET stock = stock - $1 WHERE id=$2",
        [required, item.component_id]
      );

      await pool.query(
        "INSERT INTO consumption_logs (component_id, consumed_qty) VALUES ($1,$2)",
        [item.component_id, required]
      );
    }

    // Log production entry
    await pool.query(
      "INSERT INTO production_logs (pcb_id, pcb_quantity) VALUES ($1,$2)",
      [pcb_id, pcb_quantity]
    );

    res.json({ msg: "Production entry successful & stock updated!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
