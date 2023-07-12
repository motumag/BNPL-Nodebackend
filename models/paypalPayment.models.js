const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const PaypalPayment = sequelize.define("PaypalPayments", {
  paypal_payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paypalOrderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
    validate: {
      isIn: [["PENDING", "COMPLETED", "FAILED"]], // Define the valid options for the attribute
    },
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
    validate: {
      isIn: ["USD"], // Define the valid options for the attribute
    },
  },
  currencyCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payeeEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payeeMerchant_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payerGiven_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payerEmailAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payerCountry_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endPointIdentifier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditAccount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  callBackUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  returnUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payeePhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentService: {
    type: DataTypes.STRING,
    defaultValue: "paypal",
    validate: {
      isIn: ["paypal"],
    },
  },
});

module.exports = PaypalPayment;
