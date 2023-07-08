const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const ApiKey = sequelize.define(
  "ApiKey",
  {
    apiKeyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    keyExpires: {
      type: Sequelize.DATE,
      defaultValue: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);

module.exports = ApiKey;
