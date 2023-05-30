const { Sequelize, DataTypes } = require("sequelize");
const sequelize=require("../configs/db")
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
    itemStatus: {
      type: DataTypes.STRING,
      enum: ["Pending", "Accepted", "Available"],
      defaultValue: "Available",
    },
  });

module.exports=Items;
