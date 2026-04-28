const express = require("express");
const productController = require("../controller/productController");
const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/:id/reviews", productController.getProductReviews);

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later
router.post("/:id/reviews", productController.createProductReview);

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/:id/images", productController.uploadProductImages);

module.exports = router;
