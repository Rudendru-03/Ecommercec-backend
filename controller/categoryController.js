exports.getAllCategories = async (req, res) => {
  res.status(200).json({ message: "Get all categories" });
};

exports.createCategory = async (req, res) => {
  res.status(201).json({ message: "Create a new category" });
};

exports.updateCategory = async (req, res) => {
  res.status(200).json({ message: `Update category ${req.params.id}` });
};
