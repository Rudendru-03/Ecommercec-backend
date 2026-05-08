const express = require("express");
const categoryController = require("../controller/categoryController");
const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", categoryController.getAllCategories);

// --- ADMIN ROUTES (auth + admin role required) ---
router.post("/seed", categoryController.seedInitialCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
