const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const ChapaPayment = sequelize.define("chapaPayments", {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tx_ref: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  callback_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cheackoutUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  return_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  requestStatus: {
    type: DataTypes.STRING,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    defaultValue: "PENDING",
    validate: {
      isIn: [["PENDING", "COMPLETED", "FAILED"]],
    },
  },
  paymentStatus: {
    type: DataTypes.STRING,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    defaultValue: "PENDING",
    validate: {
      isIn: [["PENDING", "COMPLETED", "FAILED"]],
    },
  },
});

module.exports = ChapaPayment;
