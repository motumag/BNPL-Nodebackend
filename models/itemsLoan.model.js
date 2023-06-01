const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../configs/db")
const ItemsLoan  = sequelize.define("items_loan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  loan_conf_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalAmountWithInterest: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  });


module.exports=ItemsLoan;
