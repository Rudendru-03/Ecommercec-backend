const express = require("express");
const paymentController = require("../controller/paymentController");
const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/webhook", paymentController.handleWebhook);

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later
router.post("/intent", paymentController.createPaymentIntent);
router.post("/confirm", paymentController.confirmPayment);

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.post("/:id/refund", paymentController.refundPayment);

module.exports = router;
