const express = require("express");
const inventoryController = require("../controller/inventoryController");
const router = express.Router();

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.get("/", inventoryController.getAllInventory);
router.get("/low-stock", inventoryController.getLowStock);
router.put("/:productId", inventoryController.updateInventory);
router.get("/:productId/logs", inventoryController.getInventoryLogs);

module.exports = router;
