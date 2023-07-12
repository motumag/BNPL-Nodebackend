const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Merchant = require("../usermanagement/models/merchant.model");
const ApiKey = require("./apiKeys.models");
const BankAccount = sequelize.define("bankAccount", {
  bank_account_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  account_level: {
    type: DataTypes.STRING,
    enum: ["Primary", "Secondary"],
    defaultValue: "Secondary",
  },
});
Merchant.hasMany(BankAccount, { as: "bankAccount", foreignKey: "merchant_id" });
BankAccount.hasOne(ApiKey, { as: "apiKey", foreignKey: "bank_account_id" });
ApiKey.belongsTo(BankAccount, {
  as: "bankAccount",
  foreignKey: "bank_account_id",
});
BankAccount.belongsTo(Merchant, { as: "merchant", foreignKey: "merchant_id" });

module.exports = BankAccount;
