exports.getAllInventory = async (req, res) => {
  res.status(200).json({ message: "Get all inventory levels (Admin)" });
};

exports.updateInventory = async (req, res) => {
  res.status(200).json({ message: `Update inventory for product ${req.params.productId} (Admin)` });
};

exports.getLowStock = async (req, res) => {
  res.status(200).json({ message: "Get low stock products (Admin)" });
};

exports.getInventoryLogs = async (req, res) => {
  res.status(200).json({ message: `Get inventory logs for product ${req.params.productId} (Admin)` });
};
