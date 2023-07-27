// Modify the join table definition
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const MerchantPaymentServices = sequelize.define("MerchantPaymentServices", {
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Set the default value to true for enabled
  },
});

module.exports = MerchantPaymentServices;
