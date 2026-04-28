const express = require("express");
const categoryController = require("../controller/categoryController");
const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", categoryController.getAllCategories);

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);

module.exports = router;
