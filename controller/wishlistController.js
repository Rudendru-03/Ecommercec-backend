const wishlistRepo = require("../repository/wishlistRepository");

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.user ? null : req.sessionID;
    const identifier = userId ? { user_id: userId } : { session_id: sessionId };

    const items = await wishlistRepo.getWishlistItems(identifier);
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ success: false, message: "product_id is required" });

    const userId = req.user ? req.user.id : null;
    const sessionId = req.user ? null : req.sessionID;
    const identifier = userId ? { user_id: userId } : { session_id: sessionId };

    const exists = await wishlistRepo.checkItemExists(identifier, product_id);
    if (exists) {
      return res.status(409).json({ success: false, message: "Product already in wishlist" });
    }

    const item = await wishlistRepo.addItem(identifier, product_id);
    res.status(201).json({ success: true, message: "Added to wishlist", item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const userId = req.user ? req.user.id : null;
    const sessionId = req.user ? null : req.sessionID;
    const identifier = userId ? { user_id: userId } : { session_id: sessionId };

    await wishlistRepo.removeItem(identifier, productId);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
