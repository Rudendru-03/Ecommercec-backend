exports.getAllProducts = async (req, res) => {
  res.status(200).json({ message: "Get all products" });
};

exports.getProductById = async (req, res) => {
  res.status(200).json({ message: `Get product ${req.params.id}` });
};

exports.getProductReviews = async (req, res) => {
  res.status(200).json({ message: `Get reviews for product ${req.params.id}` });
};

exports.createProductReview = async (req, res) => {
  res.status(201).json({ message: `Create review for product ${req.params.id}` });
};

exports.createProduct = async (req, res) => {
  res.status(201).json({ message: "Create a new product" });
};

exports.updateProduct = async (req, res) => {
  res.status(200).json({ message: `Update product ${req.params.id}` });
};

exports.deleteProduct = async (req, res) => {
  res.status(200).json({ message: `Delete product ${req.params.id}` });
};

exports.uploadProductImages = async (req, res) => {
  res.status(200).json({ message: `Upload images for product ${req.params.id}` });
};
