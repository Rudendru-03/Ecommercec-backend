const WishlistItem = require("../model/WishlistItem");
const Product = require("../model/Product");

const getWishlistItems = async (identifierObj) => {
  return await WishlistItem.findAll({
    where: identifierObj,
    include: [{ model: Product, as: "product" }]
  });
};

const checkItemExists = async (identifierObj, productId) => {
  return await WishlistItem.findOne({
    where: { ...identifierObj, product_id: productId }
  });
};

const addItem = async (identifierObj, productId) => {
  return await WishlistItem.create({
    ...identifierObj,
    product_id: productId
  });
};

const removeItem = async (identifierObj, productId) => {
  return await WishlistItem.destroy({
    where: { ...identifierObj, product_id: productId }
  });
};

module.exports = {
  getWishlistItems,
  checkItemExists,
  addItem,
  removeItem
};
