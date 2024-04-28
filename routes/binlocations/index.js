const { router, getDatabaseInstance } = require("../requires");

// GET: Read all item locations
router.get("/item_locations", (req, res) => {
  const { orgId } = req.query;
  const db = getDatabaseInstance(orgId);
  db.all("SELECT * FROM item_locations", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// POST: Create a new item location
router.post("/item_locations", (req, res) => {
  const { orgId, item_id, warehouse_id, bin_location } = req.body;
  const db = getDatabaseInstance(orgId);
  const sql = "INSERT INTO item_locations (item_id, warehouse_id, bin_location) VALUES (?, ?, ?)";
  const params = [item_id, warehouse_id, bin_location];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      id: this.lastID,
    });
  });
});

// PUT: Update an item location
router.put("/item_locations", (req, res) => {
  const { orgId, item_id, warehouse_id, bin_location } = req.body;
  const db = getDatabaseInstance(orgId);
  const sql = `
    UPDATE item_locations
    SET bin_location = ?
    WHERE item_id = ? AND warehouse_id = ?
  `;
  const params = [bin_location, item_id, warehouse_id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "updated",
      changes: this.changes,
    });
  });
});

// DELETE: Delete an item location
router.delete("/item_locations", (req, res) => {
  const { orgId, item_id, warehouse_id, bin_location } = req.query;
  const db = getDatabaseInstance(orgId);
  db.run(
    "DELETE FROM item_locations WHERE item_id = ? AND warehouse_id = ? AND bin_location = ?",
    [item_id, warehouse_id, bin_location],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", rows: this.changes });
    }
  );
});

module.exports = router;
