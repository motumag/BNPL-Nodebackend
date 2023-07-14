const jwt = require("jsonwebtoken");
const Merchant = require(".././usermanagement/models/merchant.model");
const PaymentService = require("../models/paymentServices.models");
const BankAccount = require("../models/bankAccount.models");
const ApiKey = require("../models/apiKeys.models");
const grantAccess = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    // Check if the user's role is allowed
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.status(403).send("Forbidde");
        } else {
          if (roles.includes(user.role)) {
            next();
          } else {
            res.status(403).send("Forbidden");
          }
        }
      });
    } else {
      res.status(401).send("Unauthorised");
    }
  };
};
const paymentServices = (payment) => {
  return async (req, res, next) => {
    console.log("payment.........................", payment);
    const payment_service = await PaymentService.findOne({
      where: {
        payment_service_name: payment[0],
        status: true,
      },
    });
    if (payment_service) {
      next();
    } else {
      return res.status(400).json({ message: "Payment service not found" });
    }
  };
};

const verifyKeys = async (req, res, next) => {
  try {
    const { clientId, secrateKey, apiKey } = req.body;
    let merchant = await Merchant.findOne({
      where: {
        client_id: clientId,
        secrate_key: secrateKey,
        // apiKey: apiKey,
      },
      include: [
        {
          model: BankAccount,
          as: "bankAccount",
          where: {
            account_level: "Primary",
          },
        },
        {
          model: ApiKey,
          where: {
            key: apiKey,
          },
        },
      ],
    });
    if (merchant) {
      req.merchant_id = merchant.merchant_id;
      req.merchant = merchant;
      next();
    } else {
      return res.status(401).send("Unauthorised");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { grantAccess, verifyKeys, paymentServices };
