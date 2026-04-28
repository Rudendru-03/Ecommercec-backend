const express = require("express");
const wishlistController = require("../controller/wishlistController");
const router = express.Router();

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addToWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

module.exports = router;
