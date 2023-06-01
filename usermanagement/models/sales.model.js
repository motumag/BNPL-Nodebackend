const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../../configs/db")
const Items = require("../../models/item.model");
const SalesKyc = require("../../models/salesKyc.models")
const Sales = sequelize.define("sales", {
    sales_id: {
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
      defaultValue: "sales",
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      enum: ["Pending", "Approved", "Declained"],
      defaultValue: "Pending",
    },
  });
Sales.hasMany(Items,{foreignKey:"sales_id"})
Items.belongsTo(Sales,{foreignKey:"sales_id"})
Sales.hasOne(SalesKyc,{foreignKey:"sales_id", as:"salesKyc"})
SalesKyc.belongsTo(Sales,{foreignKey:"sales_id", as:"sales"})
module.exports=Sales;
