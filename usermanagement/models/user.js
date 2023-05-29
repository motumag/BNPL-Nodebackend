const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../../configs/db")
const User = sequelize.define("users", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    role: {
      type: DataTypes.STRING,
      default: "user",
      allowNull: false,
    },
  });
//   User.hasMany(BankAccount, { as: 'bankAccounts', foreignKey: 'user_id' });
  module.exports=User