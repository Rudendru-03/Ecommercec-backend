const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./Order");
const DiscountCode = require("./DiscountCode");

const OrderDiscountUsage = sequelize.define(
  "OrderDiscountUsage",
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
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DiscountCodes",
        key: "id",
      },
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "OrderDiscountUsages",
    timestamps: false,
  },
);

// Set up associations
OrderDiscountUsage.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(OrderDiscountUsage, { foreignKey: "order_id", as: "discountUsages" });

OrderDiscountUsage.belongsTo(DiscountCode, { foreignKey: "discount_id", as: "discountCode" });
DiscountCode.hasMany(OrderDiscountUsage, { foreignKey: "discount_id", as: "discountUsages" });

module.exports = OrderDiscountUsage;
