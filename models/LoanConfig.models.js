const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const LoanConf = sequelize.define("loanconf", {
  loan_conf_id: {
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
