const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const EbirrPayment = sequelize.define("ebirrPayments", {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  referenceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requestId: {
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
  callBackUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  invoiceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentService: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  issuerTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    enum: ["Pending", "Approved", "Failed"],
    defaultValue: "Pending",
    validate: {
      isIn: [["Pending", "Approved", "Failed"]],
    },
  },
});

module.exports = EbirrPayment;
