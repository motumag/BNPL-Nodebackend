const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const StripePayment = sequelize.define("StripePayments", {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripe_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "USD",
    validate: {
      isIn: [["USD"]], // Define the valid options for the attribute
    },
  },
  endPointIdentifier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditAccount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  callBackUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  returnUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDING",
    validate: {
      isIn: [["PENDING", "COMPLETED", "FAILED"]], // Define the valid options for the attribute
    },
  },
  payeePhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentService: {
    type: DataTypes.STRING,
    defaultValue: "stripe",
    validate: {
      isIn: ["stripe"],
    },
  },
});

module.exports = StripePayment;
