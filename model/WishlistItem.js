const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
  },
  {
    tableName: "WishlistItems",
    timestamps: true,
    createdAt: "added_at",
    updatedAt: false,
  },
);

// Set up associations
WishlistItem.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(WishlistItem, { foreignKey: "user_id", as: "wishlistItems" });

WishlistItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(WishlistItem, { foreignKey: "product_id", as: "wishlistItems" });

module.exports = WishlistItem;
