const { where } = require("sequelize");
const Items = require("../models/item.model");
const Sales = require("../usermanagement/models/sales.model");
const Merchant = require("../usermanagement/models/merchant.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../utils/utils");
const SalesKyc = require("../models/salesKyc.models");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const CustomError = require("../utils/ErrorHandler");
exports.getAllSales = async (req, res, next) => {
  try {
    const { id } = req.query;
    const sales = await Sales.findAll({
      where: {
        merchant_id: id,
      },
      attributes: [
        "sales_id",
        "email_address",
        "emailStatus",
        "phone_number",
        "firstName",
        "lastName",
      ],
    });
    return res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};
exports.getSalesById = async (req, res, next) => {
  try {
    const { sales_id, merchant_id } = req.query;

    const sales = await Sales.findOne({
      where: {
        sales_id: sales_id,
        merchant_id: merchant_id,
      },
      attributes: ["sales_id", "email_address", "emailStatus", "phone_number"],
    });
    if (!sales) {
      throw new CustomError("not found", 404);
    } else {
      return res.status(200).json(sales);
    }
  } catch (error) {
    next(error);
  }
};
exports.loginSales = async (req, res, next) => {
  const { username, password } = req.body;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const isEmail = emailRegex.test(username);
  const isPhone = phoneRegex.test(username);
  try {
    if (isEmail) {
      const sales = await Sales.findOne({
        where: {
          email_address: username,
        },
      });
      if (sales) {
        if (sales.emailStatus == "Pending") {
          throw new CustomError("In active Account", 403);
        } else if (sales.emailStatus == "Inactive") {
          throw new CustomError("Account Is InActivet", 403);
        } else {
          const passwordMatch = bcrypt.compare(password, sales.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                sales_id: sales.sales_id,
                email_address: sales.email_address,
                role: sales.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            req.session.jwt = token;
            res.status(200).send({ token: token });
          } else {
            throw new CustomError("Invalid Credentials", 401);
          }
        }
      } else {
        throw new CustomError("Invalid Credentials", 400);
      }
    } else if (isPhone) {
      const sales = await Sales.findOne({
        where: {
          phone_number: username,
        },
      });
      console.log(sales);
      if (sales) {
        if (sales.emailStatus == "Pending") {
          throw new CustomError("In active Account", 403);
        } else if (sales.emailStatus == "Inactive") {
          throw new CustomError("Account Is InActive", 403);
        } else {
          const passwordMatch = bcrypt.compare(password, sales.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                sales_id: sales.sales_id,
                phone_number: sales.phone_number,
                role: sales.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            req.session.jwt = token;
            res.status(200).send({ token: token });
          } else {
            throw new CustomError("Invalid Credentials", 401);
          }
        }
      } else {
        throw new CustomError("Invalid Credentials", 401);
      }
    } else {
      throw new CustomError("Validation Error", 422);
    }
  } catch (error) {
    next(error);
  }
};
exports.registerSales = async (req, res, next) => {
  try {
    const { username, merchant_id, firstName, lastName } = req.body;
    console.log(req.body);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    // Check if the email is already registered for a manager
    if (isEmail) {
      const existingMerchant = await Merchant.findByPk(merchant_id);
      if (!existingMerchant) {
        throw new CustomError("Not Found", 404);
      }
      const sales = await Sales.findOne({ where: { email_address: username } });
      if (sales) {
        throw new CustomError("Already Exists", 409);
      } else {
        // Generate Random Password
        const password = utils.generateRandomPassword();
        // Hash the password
        utils.sendSalesEmail({ email_address: username, password: password });
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the manager
        const registeredSales = await Sales.create({
          emailStatus: "Approved",
          firstName: firstName,
          lastName: lastName,
          email_address: username,
          password: hashedPassword,
          merchant_id: existingMerchant.merchant_id,
          status: "Approved",
        });

        return res.status(201).json({ status: "success", password });
      }
    } else if (isPhone) {
      const existingmerchant = await Merchant.findByPk(merchant_id);
      if (!existingmerchant) {
        throw new CustomError("Not Found", 404);
      }
      const sales = await Sales.findOne({ where: { phone_number: username } });
      if (sales) {
        throw new CustomError("Already Exists", 409);
      } else {
        // Generate Random Password
        const password = utils.generateRandomPassword();
        utils.sendMessage({ phone_number: username, password: password });
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the manager
        const registeredSales = await Sales.create({
          emailStatus: "Approved",
          firstName: firstName,
          lastName: lastName,
          phone_number: username,
          password: hashedPassword,
          merchant_id: existingmerchant.merchant_id,
          status: "Approved",
        });

        res.status(201).json({ status: "success", password });
      }
    } else {
      throw new CustomError("Validation Error", 422);
    }
  } catch (error) {
    next(error);
  }
};
exports.sendRequestForApproval = async (req, res, next) => {
  try {
    const { first_name, last_name, tin_number, sales_id } = req.body;
    const { filename, path: filePath } = req.file;
    const valid_identification_path = filePath;
    const valid_identification = valid_identification_path.replace(
      "uploads\\",
      ""
    );
    const sales = await Sales.findOne({ where: { sales_id } });
    const salesKyc = await SalesKyc.findOne({ where: { sales_id } });
    if (!sales) {
      return res.status(400).json({ message: "Sales Not Found" });
    } else {
      if (salesKyc) {
        return res.status(409).json({ message: "Sales Kyc Already Exist" });
      } else {
        await SalesKyc.create({
          sales_id,
          first_name,
          last_name,
          tin_number,
          valid_identification: IMAGE_UPLOAD_BASE_URL + valid_identification,
        });
        res.status(201).json({ message: "Sales Kyc Created" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAllSalesKyc = async (req, res, next) => {
  try {
    const { merchant_id } = req.query;
    console.log(merchant_id);
    const salesKyc = await SalesKyc.findAll({
      include: {
        model: Sales,
        as: "sales",
        where: { merchant_id: merchant_id },
        attributes: ["email_address", "phone_number", "status"],
      },
    });
    res.status(200).json(salesKyc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.approveSalesKyc = async (req, res, next) => {
  try {
    const { sales_kyc_id, merchant_id } = req.body;
    const salesKyc = await SalesKyc.findOne({
      where: { kyc_id: sales_kyc_id },
      include: {
        model: Sales,
        as: "sales",
        where: { merchant_id: merchant_id },
      },
    });
    if (!salesKyc) {
      return res.status(400).json({ message: "Sales Kyc Not Found" });
    } else {
      if (salesKyc.status == "Approved") {
        res.status(200).json({ message: "already approved" });
      } else {
        await salesKyc.update({ status: "Approved" });
        res.status(200).json({ message: "Sales Kyc Approved" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.rejectSalesKyc = async (req, res, next) => {
  try {
    const { sales_kyc_id, merchant_id } = req.body;
    const salesKyc = await SalesKyc.findOne({
      where: { kyc_id: sales_kyc_id },
      include: {
        model: Sales,
        as: "sales",
        where: { merchant_id: merchant_id },
      },
    });
    if (!salesKyc) {
      return res.status(400).json({ message: "Sales Kyc Not Found" });
    } else {
      if (salesKyc.status == "Rejected") {
        res.status(200).json({ message: "already rejected" });
      } else {
        await salesKyc.update({ status: "Rejected" });
        res.status(200).json({ message: "Sales Kyc Rejected" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
