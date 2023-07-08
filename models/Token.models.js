const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Token = sequelize.define(
  "token",
  {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tokenExpires: {
      type: Sequelize.DATE,
      defaultValue: Date.now() + 36000,
    },
  },
  { timestamps: true }
);
module.exports = Token;
