const express = require("express");
const adminController = require("../controller/adminController");
const router = express.Router();

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later

// Analytics
router.get("/analytics/sales", adminController.getSalesAnalytics);
router.get("/analytics/revenue", adminController.getRevenueAnalytics);
router.get("/analytics/top-products", adminController.getTopProductsAnalytics);
router.get("/analytics/customers", adminController.getCustomersAnalytics);

// Dashboard
router.get("/dashboard/summary", adminController.getDashboardSummary);

module.exports = router;
