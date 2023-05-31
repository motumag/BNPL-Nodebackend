const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const LoanConf = sequelize.define("loan_category_one", {
  loan_category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = LoanConf;
