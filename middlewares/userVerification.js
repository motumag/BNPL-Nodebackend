const jwt = require("jsonwebtoken");
const Merchant = require(".././usermanagement/models/merchant.model");
const PaymentService = require("../models/paymentServices.models");
const BankAccount = require("../models/bankAccount.models");
const ApiKey = require("../models/apiKeys.models");
const MerchantPaymentServices = require("../models/MerchantPaymentServices .model");
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
            console.log(user.role);
            if (user.role == "merchant") {
              console.log("merchant_id", user.merchant_id);
              req.merchant_id = user.merchant_id;
              next();
            } else {
              next();
            }
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
  console.log("helooooooooo");
  return async (req, res, next) => {
    console.log("payment.........................", payment);
    const payment_service = await PaymentService.findOne({
      where: {
        payment_service_name: payment[0],
        status: true,
      },
    });
    if (payment_service) {
      req.payment_service_id = payment_service.payment_service_id;
      next();
    } else {
      return res.status(400).json({ message: "Payment service not found" });
    }
  };
};
const verifyKeys = async (req, res, next) => {
  console.log("he;;;;;;;;;;;;;;;;;;;;;;");
  try {
    const { clientId, secrateKey, apiKey } = req.body;
    var merchant = await Merchant.findOne({
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
    // console.log(
    //   "merchant_payment Services",
    //   await merchant.getPaymentServices(),
    //   merchant.merchant_id
    // );
    if (merchant) {
      const merchant_payment_service = await MerchantPaymentServices.findOne({
        where: {
          merchant_id: merchant.merchant_id,
          payment_service_id: req.payment_service_id,
          enabled: true,
        },
      });
      if (merchant_payment_service) {
        req.merchant_id = merchant.merchant_id;
        req.merchant = merchant;
        next();
      } else {
        return res.status(401).send("Unauthorised");
      }
    } else {
      return res.status(401).send("Unauthorised");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  grantAccess,
  verifyKeys,
  paymentServices,
};
