// const BankAccount = require("../models/BankAccount")
const Merchant = require("../models/merchant.model");
const Sales = require("../models/sales.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../../utils/utils");
// const {getAllUser,getUserById}=require("../dal/user")

exports.registerMerchant = async (req, res) => {
  try {
    const { username, password } = req.body;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    // Check if the email is already registered for a manager
    if (isEmail) {
      const existingUser = await Merchant.findOne({
        where: { email_address: username },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already registered for a merchant" });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the manager
      const merchant = await Merchant.create({
        email_address: username,
        password: hashedPassword,
      });
      const jsontoken = jwt.sign(
        {
          id: merchant.merchant_id,
          email_address: merchant.email_address,
          role: merchant.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24hr",
        }
      );
      req.session.jwt = jsontoken;
      utils.sendEmail(merchant.merchant_id, merchant.email_address, "merchant");
      res.status(201).json({ jsontoken });
    } else if (isPhone) {
      const existingmerchant = await Merchant.findOne({
        where: { phone_number: username },
      });
      if (existingmerchant) {
        return res
          .status(400)
          .json({ message: "Phone already registered for a user" });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the manager
      const merchant = await Merchant.create({
        phone_number: username,
        password: hashedPassword,
      });
      console.log("Merchant", merchant);
      const jsontoken = jwt.sign(
        {
          id: merchant.merchant_id,
          phone_number: merchant.phone_number,
          role: merchant.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24hr",
        }
      );
      req.session.jwt = jsontoken;

      res.status(201).json({ jsontoken });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Merchant registration failed" });
  }
};
exports.loginMerchant = async (req, res) => {
  const { username, password } = req.body;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const isEmail = emailRegex.test(username);
  const isPhone = phoneRegex.test(username);
  try {
    if (isEmail) {
      const merchant = await Merchant.findOne({
        where: {
          email_address: username,
        },
      });
      if (merchant) {
        if (merchant.emailStatus == "Pending") {
          res.status(403).json({ message: "In active Account" });
        } else if (merchant.emailStatus == "Inactive") {
          res.status(403).json({ message: "Account Is InActive" });
        } else {
          const passwordMatch = bcrypt.compare(password, merchant.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                merchant_id: merchant.merchant_id,
                email_address: merchant.email_address,
                role: merchant.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            req.session.jwt = token;
            res.status(200).send({ token: token });
          } else {
            res.status(401).send({ message: "Invalid Credentials" });
          }
        }
      } else {
        res.status(400).send({ message: "Invalid Credentials" });
      }
    } else if (isPhone) {
      const merchant = await Merchant.findOne({
        where: {
          phone_number: username,
        },
      });
      if (merchant) {
        if (merchant.emailStatus == "Pending") {
          res.status(403).json({ message: "In active Account" });
        } else if (merchant.emailStatus == "Inactive") {
          res.status(403).json({ message: "Account Is InActive" });
        } else {
          const passwordMatch = bcrypt.compare(password, merchant.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                merchant_id: merchant.user_id,
                phone_number: merchant.phone_number,
                role: merchant.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            req.session.jwt = token;
            res.status(200).send({ token: token });
          } else {
            res.status(401).send({ message: "Invalid Credentials" });
          }
        }
      } else {
        res.status(405).json({ message: "Merchant Not Found" });
      }
    } else {
      res.status(422).json({ message: "Validation Error" });
    }
  } catch (error) {
    console.error(error);
  }
};
exports.loginSales = async (req, res) => {
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
          res.status(403).json({ message: "In active Account" });
        } else if (sales.emailStatus == "Inactive") {
          res.status(403).json({ message: "Account Is InActive" });
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
            res.status(401).send({ message: "Invalid Credentials" });
          }
        }
      } else {
        res.status(400).send({ message: "Invalid Credentials" });
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
          res.status(403).json({ message: "In active Account" });
        } else if (sales.emailStatus == "Inactive") {
          res.status(403).json({ message: "Account Is InActive" });
        } else {
          const passwordMatch = bcrypt.compare(password, sales.password);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                sales_id: sales.user_id,
                phone_number: sales.phone_number,
                role: sales.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            req.session.jwt = token;
            res.status(200).send({ token: token });
          } else {
            res.status(401).send({ message: "Invalid Credentials" });
          }
        }
      } else {
        res.status(401).send({ message: "Invalid Credentials" });
      }
    } else {
      res.status(422).send({ message: "Validation Error" });
    }
  } catch (error) {
    console.error(error);
  }
};
exports.registerSales = async (req, res, next) => {
  try {
    const { username, merchant_id } = req.body;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    // Check if the email is already registered for a manager
    if (isEmail) {
      const existingMerchant = await Merchant.findByPk(merchant_id);
      if (!existingMerchant) {
        return res
          .status(400)
          .json({ message: "Merchant With This Id Is Not Found" });
      }
      const sales = await Sales.findOne({ where: { email_address: username } });
      if (sales) {
        res.status(409).json({ message: "Sales Already exist" });
      } else {
        // Generate Random Password
        const password = utils.generateRandomPassword();
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the manager
        const registeredSales = await Sales.create({
          email_address: username,
          password: hashedPassword,
          merchant_id: existingMerchant.merchant_id,
        });
        utils.sendEmail(
          registeredSales.sales_id,
          registeredSales.email_address
        );
        res.status(201).json({ status: "success", password });
      }
    } else if (isPhone) {
      const existingmerchant = await Merchant.findByPk(merchant_id);
      if (!existingmerchant) {
        return res.status(400).json({ message: "Merchant Not Found" });
      }
      const sales = await Sales.findOne({ where: { phone_number: username } });
      if (sales) {
        res.status(409).json({ message: "Sales Already exist" });
      } else {
        // Generate Random Password
        const password = utils.generateRandomPassword();
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the manager
        const registeredSales = await Sales.create({
          phone_number: username,
          password: hashedPassword,
          merchant_id: existingmerchant.merchant_id,
        });
        utils.sendMessage(
          registeredSales.sales_id,
          registeredSales.phone_number
        );
        res.status(201).json({ status: "success", password });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Merchant registration failed" });
  }
};
exports.activateAccount = async (req, res) => {
  const { id, type } = req.query;
  try {
    if (type == "merchant") {
      const merchant = await Merchant.findByPk(id);
      if (merchant) {
        merchant.emailStatus = "Active";
        merchant.save();
        res.status(200).json({ message: "activated" });
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } else {
      const sales = await Sales.findByPk(id);
      if (sales) {
        sales.emailStatus = "Active";
        sales.save();
        res.status(200).json({ message: "activated" });
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserById = async (request, response) => {
  // Inside an async function or a route handler

  const userId = request.params.id;
  // Replace with the actual ID you want to find
  try {
    const user = await getUserById(userId);
    if (user) {
      response.status(200).send(user);
    } else {
      response.status(400).json("User Not Found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};
exports.createAccount = (req, res, next) => {
  const { accountNumber } = req.body;
  const { user_id } = req.user_id;
  res.status(200).send("Create Your Bank Account");
};
exports.setPrimaryAccount = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.generateApiKey = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.sendBussinessRequest = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getPrimaryAccount = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getAllAccount = async (req, res, next) => {
  try {
    const userId = req.params.id; // Replace with the actual ID you want to find
    const user = await User.findByPk(userId, { include: "bankAccounts" });
    if (user) {
      res.status(200).send({ accounts: user.bankAccounts });
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getAllKey = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getManager = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getAgent = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.createNedajStation = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
exports.getNedajStation = (req, res, next) => {
  res.status(200).send("Set Your Bank Account Primary");
};
