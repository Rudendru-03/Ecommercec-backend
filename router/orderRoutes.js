const express = require("express");
const orderController = require("../controller/orderController");
const router = express.Router();

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.get("/all", orderController.getAllOrders);
router.put("/:id/status", orderController.updateOrderStatus);

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later
router.post("/", orderController.createOrder);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.post("/:id/cancel", orderController.cancelOrder);
router.get("/:id/tracking", orderController.getOrderTracking);

module.exports = router;
