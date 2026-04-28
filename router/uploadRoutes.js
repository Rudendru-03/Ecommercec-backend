const express = require("express");
const uploadController = require("../controller/uploadController");
const router = express.Router();

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.post("/product-image", uploadController.uploadProductImage);

module.exports = router;
