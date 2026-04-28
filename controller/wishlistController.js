exports.getWishlist = async (req, res) => {
  res.status(200).json({ message: "Get user's wishlist" });
};

exports.addToWishlist = async (req, res) => {
  res.status(201).json({ message: "Add item to wishlist" });
};

exports.removeFromWishlist = async (req, res) => {
  res.status(200).json({ message: `Remove product ${req.params.productId} from wishlist` });
};
