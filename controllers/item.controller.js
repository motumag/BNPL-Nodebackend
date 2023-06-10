const Items = require("../models/item.model");
const LoanConfig = require("../models/LoanConfig.models");
const ItemsLoan = require("../models/itemsLoan.model");
const Sales = require("../usermanagement/models/sales.model");
const ItemCategory = require("../models/itemCategory.models");
const Merchant = require("../usermanagement/models/merchant.model");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
exports.createNewItem = async (req, res) => {
  try {
    const {
      item_name,
      item_code,
      item_price,
      item_type,
      merchant_id,
      loan_limit,
    } = req.body;
    const { filename, path: filePath } = req.file;
    console.log(req.body, req.file);
    const item = await Items.create({
      item_code,
      item_name,
      item_price,
      merchant_id,
      item_pic: filename,
      item_type,
      loan_limit: loan_limit,
    });
    res.status(201).json({
      url: "http://localhost:5000/image/" + filename,
      message: "Created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.editItemById = async (req, res) => {
  try {
    const {
      item_name,
      item_code,
      item_price,
      item_type,
      merchant_id,
      loan_limit,
      item_id,
    } = req.body;
    console.log(req.body);
    const item = await Items.findOne({
      where: { item_id: item_id },
      include: { model: LoanConfig, as: "loanConfs" },
    });
    console.log(item);
    const loanItems = await ItemsLoan.findAll({
      where: { item_id: item.item_id },
    });
    console.log(loanItems);
    if (item) {
      item.item_type = item_type;
      item.item_name = item_name;
      item.item_price = item_price;
      item.merchant_id = merchant_id;
      item.loan_limit = loan_limit;
      if (req.file) {
        const { filename, path: filePath } = req.file;
        const cleaned_file_path = filePath.replace("uploads\\", "");
        item.item_pic = IMAGE_UPLOAD_BASE_URL + cleaned_file_path;
      }
      await item.save();
      res.status(201).json({ item: item, message: "updated" });
    } else {
      res.status(400).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
exports.editItemUpdateById = async (req, res) => {
  try {
    const {
      item_name,
      item_code,
      item_price,
      item_type,
      merchant_id,
      loan_limit,
      item_id,
    } = req.body;
    const item = await Items.findOne({
      where: { item_id: item_id },
      include: { model: LoanConfig, as: "loanConfs" },
    });
    const loanItems = await ItemsLoan.findAll({
      where: { item_id: item.item_id },
    });
    if (item) {
      item.item_type = item_type;
      item.item_name = item_name;
      item.item_price = item_price;
      item.merchant_id = merchant_id;
      item.loan_limit = loan_limit;
      if (req.file) {
        const { filename, path: filePath } = req.file;
        const cleaned_file_path = filePath.replace("uploads\\", "");
        item.item_pic = IMAGE_UPLOAD_BASE_URL + cleaned_file_path;
      }
      await item.save();
      const items = await Items.findOne({
        where: { item_id: item.item_id },
        include: { model: LoanConfig, as: "loanConfs" },
      });
      const itemsLoans = await ItemsLoan.findAll({
        where: { item_id: items.item_id },
      });
      console.log("loop Entry");
      for (const itemLoan of itemsLoans) {
        console.log("loop");
        const principal =
          (parseInt(items.loan_limit) / 100) * parseInt(items.item_price);
        for (const loanConf of items.loanConfs) {
          const loanDuration = parseInt(loanConf.duration);
          const interestRate = parseFloat(loanConf.interest_rate) / 100;
          const interestAmount = principal * interestRate;
          const totalAmount = principal + interestAmount;
          itemLoan.totalAmountWithInterest = totalAmount;
          await itemLoan.save();
        }
      }
      const itemResponse = await Items.findOne({
        where: { item_id: item.item_id },
        include: { model: LoanConfig, as: "loanConfs" },
      });

      return res.status(201).json({ item: itemResponse, message: "updated" });
    } else {
      res.status(400).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
exports.getAllItems = async (req, res) => {
  try {
    const { id } = req.query;
    const items = await Items.findAll({
      where: { merchant_id: id },
      include: [
        {
          model: Sales,
          as: "sales",
          attributes: [
            "sales_id",
            "email_address",
            "emailStatus",
            "phone_number",
            "status",
          ],
          through: { attributes: [] },
        },
        {
          model: LoanConfig,
          as: "loanConfs",
          attributes: ["interest_rate", "duration"],
          through: { attributes: ["totalAmountWithInterest", "id"] },
        },
      ],
    });
    console.log(items);
    res.status(200).json(items);
  } catch (error) {
    console.log("error", error);
  }
};
exports.getAllItemsBySalesId = async (req, res) => {
  try {
    const { sales_id } = req.query;
    const items = await Items.findAll({
      include: [
        {
          model: Sales,
          as: "sales",
          where: { sales_id: sales_id, status: "Approved" },
          attributes: [
            "sales_id",
            "email_address",
            "emailStatus",
            "phone_number",
            "status",
          ],
          through: { attributes: [] },
        },
        {
          model: LoanConfig,
          as: "loanConfs",
          attributes: ["interest_rate", "duration"],
          through: { attributes: ["totalAmountWithInterest"] },
        },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    console.log("error", error);
  }
};
exports.getItemsById = async (req, res) => {
  try {
    const { merchant_id, item_id } = req.query;
    const items = await Items.findOne({
      where: {
        merchant_id: merchant_id,
        item_id: item_id,
      },
    });
    if (!items) {
      res.status(404).json({ message: "Their is no item with these Id" });
    } else {
      res.status(200).json(items);
    }
  } catch (error) {}
};
exports.assignItemsToSales = async (req, res) => {
  try {
    const { item_id, merchant_id, sales_id } = req.body;
    const items = await Items.findByPk(item_id, {
      where: { merchant_id: merchant_id, itemStatus: "Available" },
      include: { model: Sales, as: "sales" },
    });
    const sales = await Sales.findOne({
      where: { sales_id: sales_id },
      include: { model: Items, as: "items" },
    });
    if (!items || !sales) {
      res.status(404).json({ message: "No Record Found" });
    } else {
      items.itemStatus = "Pending";
      await items.addSales(sales);
      await items.save();
      res.status(200).json({ status: "success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.assignItemsToSalesApprove = async (req, res) => {
  try {
    const { item_id, sales_id } = req.body;
    const items = await Items.findByPk(item_id, {
      where: { itemStatus: "Available" },
      include: { model: Sales, as: "sales", where: { sales_id: sales_id } },
    });
    console.log("Items", items);
    if (!items) {
      res.status(404).json({ message: "No Item Has Been Assigned To You" });
    } else {
      console.log(items);
      items.itemStatus = "Accepted";
      items.save();
      res.status(200).json({ status: "success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.configureLoanForitem = async (req, res) => {
  const { item_id, loan_conf_id } = req.body;
  try {
    const item = await Items.findOne({
      where: { item_id: item_id },
      include: { model: LoanConfig, as: "loanConfs" },
    });
    const loanConf = await LoanConfig.findOne({
      where: { loan_conf_id: loan_conf_id },
      include: { model: Items, as: "items" },
    });
    if (item && loanConf) {
      const principal =
        (parseInt(item.loan_limit) / 100) * parseInt(item.item_price);
      const interestRate = parseFloat(loanConf.interest_rate) / 100;
      const loanDuration = parseInt(loanConf.duration);
      const interestAmount = principal * interestRate;
      const totalAmount = principal + interestAmount;
      await item.addLoanConfs(loanConf, {
        through: { totalAmountWithInterest: totalAmount },
      });
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editItemStatus = async (req, res, next) => {
  try {
    const { item_id, merchant_id, status } = req.body;
    const item = await Items.findOne({
      where: { item_id: item_id, merchant_id: merchant_id },
    });
    if (!item) {
      return res.status(400).json({ message: "Not Found" });
    } else {
      item.status = status;
      await item.save();
      return res.status(201).json({ message: "updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.createItemCategory = async (req, res, next) => {
  try {
    const { type, merchant_id } = req.body;
    const merchant = await Merchant.findByPk(merchant_id);
    if (!merchant) {
      return res.status(400).json({ message: "Merchant Not Found" });
    }
    const category = await ItemCategory.findOne({
      where: { type: type, merchant_id: merchant_id },
    });
    if (!category) {
      const item_category = await ItemCategory.create({ type: type });
      await item_category.setMerchant(merchant);
      return res.status(201).json({ message: "Successfully created" });
    }
    return res.status(409).json({ message: "Item category already exists" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.assignItemToCategory = async (req, res, next) => {
  try {
    const { item_id, item_category_id } = req.body;
    const item = await Items.findByPk(item_id);
    const item_category = await ItemCategory.findByPk(item_category_id);
    if (!item || !item_category) {
      return res.status(400).json({ message: "Item Not Found" });
    }
    await item_category.setItem(item);
    return res.status(200).json({ item_category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const { merchant_id } = req.body;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id },
      include: { model: Items },
    });
    if (!category) {
      return res.status(400).json({ message: "Not Found" });
    }
    return res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getCategoryById = async (req, res, next) => {
  try {
    const { merchant_id, item_category_id } = req.body;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id, item_category_id: item_category_id },
      include: { model: Items },
    });
    if (!category) {
      return res.status(400).json({ message: "Not Found" });
    }
    return res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.editCategory = async (req, res, next) => {
  try {
    const { merchant_id, item_category_id, type } = req.body;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id, item_category_id: item_category_id },
    });
    if (!category) {
      return res.status(400).json({ message: "Not Found" });
    }
    category.type = type;
    await category.save();
    return res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const { merchant_id, item_category_id } = req.body;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id, item_category_id: item_category_id },
    });
    if (!category) {
      return res.status(400).json({ message: "Not Found" });
    }
    await category.destroy();
    return res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
