const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const SalesKyc = sequelize.define("sales_kyc", {
  kyc_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tin_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  valid_identification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    enum: ["Pending", "Approved", "Rejected"],
    defaultValue: "Pending",
  },
});

module.exports = SalesKyc;
