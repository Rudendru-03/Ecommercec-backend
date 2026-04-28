const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./Order");

const OrderTracking = sequelize.define(
  "OrderTracking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "OrderTracking",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Set up associations
OrderTracking.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(OrderTracking, { foreignKey: "order_id", as: "trackingHistory" });

module.exports = OrderTracking;
