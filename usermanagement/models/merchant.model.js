const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../configs/db");
const Sales = require("./sales.model");
const Items = require("../../models/item.model");
const LoanConf = require("../../models/LoanConfig.models");
const kyc = require("../../models/eKyc.model");
const ItemCategory = require("../../models/itemCategory.models");
const Apikey = require("../../models/apiKeys.models");
const Service = require("../../models/service.models");
const Token = require("../../models/Token.models");
const coopassPayment = require("../../models/payment.models");
const paypalPayment = require("../../models/paypalPayment.models");
const stripePayment = require("../../models/stripePayment.models");
const chapaPayment = require("../../models/chapaPayment.models");
const ebirrPayment = require("../../models/ebirrPayment.models");
const PaymentSevice = require("../../models/paymentServices.models");
const MerchantPaymentServices = require("../../models/MerchantPaymentServices .model");
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
  client_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secrate_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    enum: ["merchant", "Admin", "supperAdmin"],
    defaultValue: "merchant",
  },
});
Merchant.hasMany(Sales, { foreignKey: "merchant_id" });
Sales.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasMany(Items, { foreignKey: "merchant_id" });
Items.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasMany(LoanConf, { foreignKey: "merchant_id" });
LoanConf.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasOne(kyc, { foreignKey: "merchant_id", as: "merchantKyc" });
kyc.belongsTo(Merchant, { foreignKey: "merchant_id", as: "merchantkyc" });
Merchant.hasMany(ItemCategory, { foreignKey: "merchant_id" });
ItemCategory.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.hasOne(Apikey);
Apikey.belongsTo(Merchant, { foreignKey: "merchant_id" });
Merchant.belongsTo(Service, { as: "services", foreignKey: "services_id" });
Service.hasMany(Merchant, { as: "merchant", foreignKey: "merchant_id" });
Merchant.hasOne(Token, { as: "token", foreignKey: "token_id" });
Token.belongsTo(Merchant, { as: "merchant", foreignKey: "merchant_id" });
Merchant.hasMany(coopassPayment, { as: "coopasspayment" });
coopassPayment.belongsTo(Merchant, { as: "merchant" });
Merchant.hasMany(paypalPayment, { as: "paypalPayment" });
paypalPayment.belongsTo(Merchant, { as: "merchant" });
Merchant.hasMany(stripePayment, { as: "stripePayment" });
stripePayment.belongsTo(Merchant, { as: "merchant" });
Merchant.hasMany(chapaPayment, { as: "chapaPayment" });
chapaPayment.belongsTo(Merchant, { as: "merchant" });
Merchant.hasMany(ebirrPayment, { as: "EbirrPayment" });
ebirrPayment.belongsTo(Merchant, { as: "merchant" });
Merchant.belongsToMany(PaymentSevice, {
  through: MerchantPaymentServices,
  foreignKey: "merchant_id",
  unique: "merchantPaymentServiceCompositeIndex",
});
PaymentSevice.belongsToMany(Merchant, {
  through: MerchantPaymentServices,
  foreignKey: "payment_service_id",
  unique: "merchantPaymentServiceCompositeIndex",
});
module.exports = Merchant;
