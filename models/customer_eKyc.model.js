const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Sales = require("../usermanagement/models/sales.model");
const CustomerEyc = sequelize.define("customer_eKyc", {
  customer_id: {
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
  national_id_doc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  national_id_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  driving_license: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  loan_status: {
    type: DataTypes.ENUM("None", "underpayment", "paid"),
    defaultValue: "None",
  },
  pre_loan_record: {
    type: DataTypes.ENUM("Inactive", "Active", "paid"),
    defaultValue: "Inactive",
  },
});
// Sales.hasMany(CustomerEyc, { foreignKey: "customer_id" });
// CustomerEyc.belongsTo(Sales, { foreignKey: "customer_id" });
Sales.hasMany(CustomerEyc, { foreignKey: "sales_id" });
CustomerEyc.belongsTo(Sales, { foreignKey: "sales_id" }); // Establishing the association: Task belongs to a User

module.exports = CustomerEyc;
