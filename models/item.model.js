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
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  // Items.addHook('afterUpdate', async (items) => {
  //   const loanItems = await ItemsLoan.findAll({ where: { item_id: items.item_id }, include:{LoanConf, as:"loanConfs"} });
  
  //   for (const loanItem of loanItems) {
  //       const principal = (parseInt(items.loan_limit)/100)*parseInt(items.item_price)
  //       const interestRate=parseFloat(loanItem.loanConfs.interest_rate)/100
  //       const loanDuration = parseInt(loanItem.loanConfs.duration)
  //       const interestAmount = principal*interestRate
  //       const totalAmount=principal+interestAmount
  //     loanItem.totalAmountWithInterest = totalAmount; // Update the quantity based on the edited item
  //     await loanItem.save();
  //   }
  // });

  // Items.afterUpdate(async (items, options) => {
  //   const itemsLoans = await ItemsLoan.findAll({
  //     where: { item_id: items.item_id },
  //     include: {
  //       model: LoanConf,
  //       as: "loanConfs",
  //     },
  //   });
  //   const promises = itemsLoans.map(async (itemLoan) => {
  //     const principal = (parseInt(items.loan_limit) / 100) * parseInt(items.item_price);
  //     const interestRate = parseFloat(itemLoan.loanConfs.interest_rate) / 100;
  //     const loanDuration = parseInt(itemLoan.loanConfs.duration);
  //     const interestAmount = principal * interestRate;
  //     const totalAmount = principal + interestAmount;
  
  //     itemLoan.totalAmountWithInterest = totalAmount;
  //     await itemLoan.save({ transaction: options.transaction });
  //   });
  
  //   await Promise.all(promises);
  // });
  
module.exports=Items;
