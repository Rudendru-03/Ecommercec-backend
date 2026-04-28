exports.validateDiscount = async (req, res) => {
  res.status(200).json({ message: "Validate a discount code" });
};

exports.createDiscount = async (req, res) => {
  res.status(201).json({ message: "Create a new discount code (Admin)" });
};

exports.getAllDiscounts = async (req, res) => {
  res.status(200).json({ message: "Get all discount codes (Admin)" });
};

exports.updateDiscount = async (req, res) => {
  res.status(200).json({ message: `Update discount code ${req.params.id} (Admin)` });
};

exports.deleteDiscount = async (req, res) => {
  res.status(200).json({ message: `Delete discount code ${req.params.id} (Admin)` });
};
