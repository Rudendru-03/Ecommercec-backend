const express = require("express");
const discountController = require("../controller/discountController");
const router = express.Router();

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later
router.post("/validate", discountController.validateDiscount);

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.post("/", discountController.createDiscount);
router.get("/", discountController.getAllDiscounts);
router.put("/:id", discountController.updateDiscount);
router.delete("/:id", discountController.deleteDiscount);

module.exports = router;
