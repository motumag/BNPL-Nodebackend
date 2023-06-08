const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Sales = require(".././usermanagement/models/sales.model");
const Items = require(".././models/item.model");

const customerLoanReq = sequelize.define("customerLoanReq", {
  loan_req_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  national_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interest_rate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    enum: ["Pending", "Accepted", "Rejected", "Available"],
    defaultValue: "Available",
  },
  agreement_doc: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "agreement_doc",
  },
  signed_agreement_doc: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "agreement_doc",
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalAmountWithInterest: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cumulative_interest: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
Sales.hasMany(customerLoanReq, { foreignKey: "sales_id" });
customerLoanReq.belongsTo(Sales, { foreignKey: "sales_id" });
// Loan Process - Items association
Items.hasMany(customerLoanReq, { foreignKey: "item_id" });
customerLoanReq.belongsTo(Items, { foreignKey: "item_id" });
module.exports = customerLoanReq;
