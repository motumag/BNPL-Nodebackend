const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../configs/db");
const Sales = require("./sales.model");
const Items = require("../../models/item.model");
const LoanConf = require("../../models/LoanConfig.models");
const kyc = require("../../models/eKyc.model");
const Merchant = sequelize.define("merchants", {
  merchant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailStatus: {
    type: DataTypes.STRING,
    enum: ["Pending", "Active", "Inactive"],
    defaultValue: "Pending",
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "merchant",
    allowNull: false,
  },
});
Merchant.hasMany(Sales, { foreignKey: "merchant_id" });
Sales.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasMany(Items, { foreignKey: "merchant_id" });
Items.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasMany(LoanConf, { foreignKey: "merchant_id" });
LoanConf.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasOne(kyc,{foreignKey:"merchant_id", as:"merchantKyc"})
kyc.belongsTo(Merchant,{foreignKey:"merchant_id", as:"merchantkyc"})
module.exports = Merchant;
