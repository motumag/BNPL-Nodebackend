const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Merchant = sequelize.define("merchants", {
    merchant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailStatus: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
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
      default: "merchant",
      allowNull: false,
    },
  });
  return Merchant;
};
