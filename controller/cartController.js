exports.getCart = async (req, res) => {
  res.status(200).json({ message: "Get user's cart" });
};

exports.addToCart = async (req, res) => {
  res.status(201).json({ message: "Add item to cart" });
};

exports.updateCartItem = async (req, res) => {
  res.status(200).json({ message: `Update cart item ${req.params.itemId}` });
};

exports.removeCartItem = async (req, res) => {
  res.status(200).json({ message: `Remove item ${req.params.itemId} from cart` });
};

exports.clearCart = async (req, res) => {
  res.status(200).json({ message: "Clear entire cart" });
};
