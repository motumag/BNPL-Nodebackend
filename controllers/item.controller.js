const Items = require("../models/item.model");
const LoanConfig = require("../models/LoanConfig.models");
const ItemsLoan = require("../models/itemsLoan.model");
const Sales = require("../usermanagement/models/sales.model");
const ItemCategory = require("../models/itemCategory.models");
const Merchant = require("../usermanagement/models/merchant.model");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const CustomError = require("../utils/ErrorHandler");
exports.createNewItem = async (req, res, next) => {
  try {
    const { item_name, item_code, item_price, item_type, loan_limit } =
      req.body;
    const { filename, path: filePath } = req.file;
    console.log(req.body, req.file);
    const item = await Items.create({
      item_code,
      item_name,
      item_price,
      merchant_id: req.merchant_id,
      item_pic: filename,
      item_type,
      loan_limit: loan_limit,
    });
    res.status(201).json({
      url: IMAGE_UPLOAD_BASE_URL + filename,
      message: "Created",
    });
  } catch (error) {
    next(error);
  }
};
exports.editItemById = async (req, res, next) => {
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
      throw new CustomError("Item not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.editItemUpdateById = async (req, res, next) => {
  try {
    const { item_name, item_code, item_price, item_type, loan_limit, item_id } =
      req.body;
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
      item.merchant_id = req.merchant_id;
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
      throw new CustomError("Item not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Items.findAll({
      where: { merchant_id: req.merchant_id },
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

    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
exports.getAllItemsBySalesId = async (req, res, next) => {
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
    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
exports.getItemsById = async (req, res, next) => {
  try {
    const { merchant_id, item_id } = req.query;
    const items = await Items.findOne({
      where: {
        merchant_id: merchant_id,
        item_id: item_id,
      },
    });
    if (!items) {
      throw new CustomError("Their is no item with these Id", 404);
    } else {
      return res.status(200).json(items);
    }
  } catch (error) {
    next(error);
  }
};
exports.assignItemsToSales = async (req, res, next) => {
  try {
    const { item_id, sales_id } = req.body;
    const items = await Items.findByPk(item_id, {
      where: { merchant_id: req.merchant_id, itemStatus: "Available" },

      include: { model: Sales, as: "sales" },
    });
    const sales = await Sales.findOne({
      where: { sales_id: sales_id },
      include: { model: Items, as: "items" },
    });
    if (!items || !sales) {
      throw new CustomError("Not Found", 404);
    } else {
      items.itemStatus = "Pending";
      await items.addSales(sales);
      await items.save();
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    next(error);
  }
};
exports.assignItemsToSalesApprove = async (req, res, next) => {
  try {
    const { item_id, sales_id } = req.body;
    const items = await Items.findByPk(item_id, {
      where: { itemStatus: "Available" },
      include: { model: Sales, as: "sales", where: { sales_id: sales_id } },
    });
    console.log("Items", items);
    if (!items) {
      throw new CustomError("Not Found", 404);
    } else {
      console.log(items);
      items.itemStatus = "Accepted";
      items.save();
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    next(error);
  }
};

exports.configureLoanForitem = async (req, res, next) => {
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
      return res.status(200).json(item);
    } else {
      throw new CustomError("Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};

exports.editItemStatus = async (req, res, next) => {
  try {
    const { item_id, merchant_id, status } = req.body;
    const item = await Items.findOne({
      where: { item_id: item_id, merchant_id: merchant_id },
    });
    if (!item) {
      throw new CustomError("Not Found", 404);
    } else {
      item.status = status;
      await item.save();
      return res.status(201).json({ message: "updated" });
    }
  } catch (error) {
    next(error);
  }
};
exports.createItemCategory = async (req, res, next) => {
  try {
    const { type } = req.body;
    const merchant = await Merchant.findByPk(req.merchant_id);
    if (!merchant) {
      return res.status(400).json({ message: "Merchant Not Found" });
    }
    const category = await ItemCategory.findOne({
      where: { type: type, merchant_id: req.merchant_id },
    });
    if (!category) {
      const item_category = await ItemCategory.create({ type: type });
      await item_category.setMerchant(merchant);
      return res.status(201).json({ message: "Successfully created" });
    }
    throw new CustomError("Item category already exists", 409);
  } catch (error) {
    next(error);
  }
};
exports.assignItemToCategory = async (req, res, next) => {
  try {
    const { item_id, item_category_id } = req.body;
    const item = await Items.findByPk(item_id);
    const item_category = await ItemCategory.findByPk(item_category_id);
    if (!item || !item_category) {
      throw new CustomError("Not Found", 404);
    }
    await item_category.setItems(item);
    return res.status(200).json({ item_category });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const category = await ItemCategory.findAll({
      where: { merchant_id: req.merchant_id },
      include: { model: Items },
    });
    if (!category) {
      throw new CustomError("Not Found", 404);
    }
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
exports.getCategoryById = async (req, res, next) => {
  try {
    const { merchant_id, item_category_id } = req.query;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id, item_category_id: item_category_id },
      include: { model: Items },
    });
    if (!category) {
      throw new CustomError("Not Found", 404);
    }
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
exports.editCategory = async (req, res, next) => {
  try {
    const { merchant_id, item_category_id, type } = req.body;
    const category = await ItemCategory.findAll({
      where: { merchant_id: merchant_id, item_category_id: item_category_id },
    });
    if (!category) {
      throw new CustomError("Not Found", 404);
    }
    category.type = type;
    category.save();
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const { item_category_id } = req.body;
    const category = await ItemCategory.findAll({
      where: {
        merchant_id: req.merchant_id,
        item_category_id: item_category_id,
      },
    });
    if (!category) {
      throw new CustomError("Not Found", 404);
    }
    await category.destroy();
    return res.status(200).json({ message: "deleted" });
  } catch (error) {
    next(error);
  }
};
