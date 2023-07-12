// const BankAccount = require("../models/BankAccount")
const Merchant = require("../models/merchant.model");
const Sales = require("../models/sales.model");
const Sarvices = require("../../models/service.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../../utils/utils");
const axios = require("axios");
const Otp = require("../../models/otp.models");
const usernameVerification = require("../../middlewares/usernameVerification");
const http = require("http");
const { Console } = require("console");
const { v4: uuidv4 } = require("uuid");

const {
  requestPasswordReset,
  resetPassword,
} = require("../../middlewares/passwordReset");
// const {getAllUser,getUserById}=require("../dal/user")

exports.registerMerchant = async (req, res) => {
  try {
    const { username, password } = req.body;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    const newId = uuidv4();
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
        client_id: newId,
      });
      utils.sendEmail(merchant.merchant_id, merchant.email_address, "merchant");
      res.status(201).json({ message: "Created Successfully" });
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
        client_id: newId,
      });
      // utils.sendMessage(
      //   merchant.merchant_id,
      //   merchant.phone_number,
      //   "merchant"
      // );
      res.status(201).json({ message: "Created Successfully" });
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
        include: {
          model: Sarvices,
          as: "services",
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
                service_name: merchant.services
                  ? merchant.services.service_name
                  : "",
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
        include: {
          model: Sarvices,
          as: "services",
        },
      });
      console.log(merchant);
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
                phone_number: merchant.phone_number,
                role: merchant.role,
                service_name: merchant.services
                  ? merchant.services.service_name
                  : "",
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
    // Check if the email is alreclsady registered for a manager
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
        console.log(password);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the manager
        const registeredSales = await Sales.create({
          email_address: username,
          password: hashedPassword,
          merchant_id: existingMerchant.merchant_id,
        });
        console.log("password", password);
        utils.sendSalesEmail(
          registeredSales.email_address,
          (password = password)
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
        // Create the manager
        console.log("password: " + password);
        // utils.sendMessage(
        //   registeredSales.sales_id,
        //   registeredSales.phone_number,
        //   password
        // );
        const hashedPassword = await bcrypt.hash(password, 10);
        const registeredSales = await Sales.create({
          phone_number: username,
          password: hashedPassword,
          merchant_id: existingmerchant.merchant_id,
          status: "Approved",
        });
        return res.status(201).json({ status: "success", password });
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
exports.getUserInfo = async (req, res) => {
  // try {
  // const {phoneNumber} = req.query
  //   const response = axios.post(process.env.USER_INFO,{
  //     phoneNumber
  //   })
  //   if (response.statusCode === 200) {
  //   return response.status(200).json(response.data)

  //   }

  // } catch (error) {
  //   console.error(error)
  //   return res.status(500).json({message: error.message})
  // }

  const { phoneNumber } = req.query;
  const postData = JSON.stringify({ phoneNumber: phoneNumber });
  const options = {
    hostname: process.env.HOST_NAME,
    port: process.env.USER_INFO_PORT, // or the appropriate port number
    path: "/userInfo?phoneNumber=" + encodeURIComponent(phoneNumber),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const request = http.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", () => {
      console.log(response.statusCode);
      if (response.statusCode == 404) {
        res.status(response.statusCode).json(JSON.parse(data));
      } else {
        res.status(response.statusCode).json(JSON.parse(data));
      }
      console.log("End Of Response", data);
    });
  });
  request.on("error", (error) => {
    console.error("Error", error.message);
  });
  request.write(postData);
  request.end();
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
exports.sendOtp = async (req, res) => {
  const { Mobile } = req.body;
  const Text = "345678";
  try {
    var data = "";
    axios
      .post(process.env.OTP_ENDPOINT, {
        Mobile,
        Text,
      })
      .then((response) => {
        const otp = Otp.create({ Mobile: Mobile, text: Text });
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { Mobile, Text } = req.body;
  console.log(req.body);
  try {
    const verfiyOtp = await Otp.findOne({
      where: { Mobile: Mobile.toString(), text: Text },
    });
    if (verfiyOtp) {
      res.status(200).send("ok");
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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

exports.getAllMerchants = async (request, response) => {
  try {
    // const user = await getUserById(userId);
    const all_merchant = await Merchant.findAll();

    if (all_merchant) {
      response.status(200).send(all_merchant);
    } else {
      response.status(400).json("Merchant Not Found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};

exports.getAllMerchantsByPage = async (req, res) => {
  try {
    const { count, rows } = await Merchant.findAndCountAll({
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    console.log("the count is", count);

    const totalPages = Math.ceil(count / perPage);
    console.log("Total page", totalPages);
    res.json({
      users: rows,
      page,
      perPage,
      totalCount: count,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching merchants:", error);
    res.status(500).json({ error: "Error fetching merchants" });
  }
};

exports.resetPasswordRequestController = async (req, res, next) => {
  console.log(req.body);
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};
exports.resetPasswordController = async (req, res, next) => {
  console.log(req.body);
  const resetPasswordService = await resetPassword(
    req.query.id,
    req.query.token,
    req.body.password
  );
  if (resetPasswordService) {
    return res.json("Your Password is successfully reseted");
  }
};
exports.changePassword = async (req, res, next) => {
  const changePasswordService = await changePasswordServices(
    req.body.phone_number,
    req.body.old_password,
    req.body.new_password
  );
  if (changePasswordService.code == 0) {
    return res.status(404).json(changePasswordService.message);
  } else if (changePasswordService.code == 1) {
    return res.status(401).json(changePasswordService.message);
  } else {
    return res.status(200).json(changePasswordService.message);
  }
};
