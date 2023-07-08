const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Services = sequelize.define(
  "Services",
  {
    services_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    service_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    service_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Services;
