const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../configs/db")
const ItemsLoan  = sequelize.define("items_loan", {
    items_loan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalAmountWithInterest: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
    }
  });
module.exports=ItemsLoan;
