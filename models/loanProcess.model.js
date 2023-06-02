const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Sales = require("../usermanagement/models/sales.model");
const Customers = require("../models/customer_eKyc.model");
const Items = require("../models/item.model");
const LoanProcess = sequelize.define("loan_process", {
  loan_processId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  national_id_number: {
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
  //   merchant_customer_contract_PDF: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  //   merchant_bank_contract_doc: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  //   customer_id_url: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  //   merchant_id_url: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  loan_status: {
    type: DataTypes.ENUM(
      "None",
      "Approved",
      "Rejected",
      "Underpayment",
      "Completed"
    ),
    defaultValue: "None",
  },
});
Sales.hasMany(LoanProcess, { foreignKey: "sales_id" });
LoanProcess.belongsTo(Sales, { foreignKey: "sales_id" });

// Customers - Loan Process association
Customers.hasMany(LoanProcess, { foreignKey: "customer_id" });
LoanProcess.belongsTo(Customers, { foreignKey: "customer_id" });

// Loan Process - Items association
LoanProcess.belongsToMany(Items, { through: "LoanProcessItems" });
Items.belongsToMany(LoanProcess, { through: "LoanProcessItems" });

module.exports = LoanProcess;
