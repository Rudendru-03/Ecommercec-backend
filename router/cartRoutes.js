const express = require("express");
const cartController = require("../controller/cartController");
const router = express.Router();

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/:itemId", cartController.updateCartItem);
router.delete("/:itemId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

module.exports = router;
