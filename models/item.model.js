const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../configs/db")
const LoanConf = require("./LoanConfig.models")
const ItemsLoan = require("./itemsLoan.model")
const Items = sequelize.define("items", {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    item_price: {
      type: DataTypes.STRING,
        allowNull:false
    },
    item_name: {
      type: DataTypes.STRING,
    allowNull:false
    },
    item_type: {
      type: DataTypes.STRING,
       allowNull:false
    },
    item_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loan_limit:{
      type: DataTypes.STRING,
      allowNull:false
    },
    itemStatus: {
      type: DataTypes.STRING,
      enum: ["Pending", "Accepted", "Available"],
      defaultValue: "Available",
    },
  });

  Items.belongsToMany(LoanConf, {
    through: ItemsLoan,
    foreignKey: 'item_id', // replaces `productId`
    otherKey: 'loan_conf_id', // replaces `categoryId`
    as: 'loanConfs' 
  });
  LoanConf.belongsToMany(Items, {
    through: ItemsLoan,
    foreignKey: 'loan_conf_id', // replaces `categoryId`
    otherKey: 'item_id', // replaces `productId`
    as: 'items'
  });
module.exports=Items;
