const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../../configs/db")

const Merchant = sequelize.define("merchants", {
    merchant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailStatus: {
      type: DataTypes.STRING,
      enum: ["Pending", "Active", "Inactive"],
      defaultValue: "Pending",
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "merchant",
      allowNull: false,
    }
  });

module.exports=Merchant;
