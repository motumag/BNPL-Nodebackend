const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Sales = require("../usermanagement/models/sales.model");
const LoanRequest = sequelize.define("sales_loan_request", {
  loan_req_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employment_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monthly_income: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loan_amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loan_purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repayment_term: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interest_rate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cumulative_interest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_repayment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loan_purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  merchant_customer_contract_PDF: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  merchant_bank_contract_doc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loan_status: {
    type: DataTypes.ENUM("national_number", "passport", "driver_license"),
  },
  loan_status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
});
module.exports = LoanRequest;

Sales.hasMany(LoanRequest, { foreignKey: "loan_req_id" });
