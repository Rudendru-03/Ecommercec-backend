const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./Order");

const Payment = sequelize.define(
  "Payment",
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
    stripe_intent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.ENUM("pending", "succeeded", "failed", "refunded"),
      defaultValue: "pending",
    },
    failure_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Payments",
    timestamps: true,
    createdAt: "paid_at",
    updatedAt: false,
  },
);

// Set up associations
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(Payment, { foreignKey: "order_id", as: "payments" });

module.exports = Payment;
