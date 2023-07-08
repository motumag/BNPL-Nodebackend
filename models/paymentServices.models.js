const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const PaymentService = sequelize.define("PaymentServices", {
  payment_service_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  payment_service_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "COOPASS",
    validate: {
      isIn: [["COOPASS", "CHAPA", "EBIRR", "STRIPE", "PAYPAL"]], // Define the valid options for the attribute
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
module.exports = PaymentService;
