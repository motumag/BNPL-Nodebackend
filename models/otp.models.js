const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../configs/db")
const Otp = sequelize.define("otp", {
    otp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text: {
      type: DataTypes.INTEGER,
    allowNull:false
    },
  });
module.exports=Otp;

