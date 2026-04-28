const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Product = require("./Product");

const InventoryLog = sequelize.define(
  "InventoryLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    quantity_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM(
        "purchase",
        "sale",
        "return",
        "adjustment",
        "damage"
      ),
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "InventoryLogs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Set up associations
InventoryLog.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(InventoryLog, { foreignKey: "product_id", as: "inventoryLogs" });

module.exports = InventoryLog;
