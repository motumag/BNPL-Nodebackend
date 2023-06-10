const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Items = require("../models/item.model");
const ItemCategory = sequelize.define("item_category", {
  item_category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

ItemCategory.hasMany(Items, { foreignKey: "item_category_id" });
Items.belongsTo(ItemCategory, { foreignKey: "item_category_id" });

module.exports = ItemCategory;
