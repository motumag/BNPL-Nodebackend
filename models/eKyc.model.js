const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Kyc = sequelize.define("merchant_ekyc", {
  kyc_id: {
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
  business_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  business_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tin_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  business_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  legal_entity_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_establishment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  valid_identification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  compliance_aml: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  business_licnense: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agreement_doc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  merchant_status: {
    type: DataTypes.STRING,
    enum: ["Pending", "Accepted", "Rejected"],
    defaultValue: "Pending",
  },
});

module.exports = Kyc;
