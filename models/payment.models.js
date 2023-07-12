const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const coopassPayment = sequelize.define("coopassPayment", {
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
    enum: ["ETB"],
    defaultValue: "ETB",
    validate: {
      isIn: ["ETB"],
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
    defaultValue: "PENDING",
    validate: {
      isIn: [["PENDING", "COMPLETED", "FAILED"]],
    },
  },
  payeePhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentServices: {
    type: DataTypes.STRING,
    defaultValue: "coopass",
    validate: {
      isIn: [["coopass"]],
    },
  },
});

module.exports = coopassPayment;
