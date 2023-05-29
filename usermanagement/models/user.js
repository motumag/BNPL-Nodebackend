const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../config/db")
const BankAccount=require("./BankAccount")
const User = sequelize.define("users", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secrate_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      default: "user",
      allowNull: false,
    },
  });
  User.hasMany(BankAccount, { as: 'bankAccounts', foreignKey: 'user_id' });
  module.exports=User