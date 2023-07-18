const {
  generateNewApiKey,
  getGeneratedApiKey,
} = require("../middlewares/generateApiKey");
const ApiKey = require("../models/apiKeys.models");
const BankAccount = require("../models/bankAccount.models");
const Merchant = require(".././usermanagement/models/merchant.model");
const CustomError = require("../utils/ErrorHandler");
exports.generateApiKey = async (req, res, next) => {
  try {
    let merchant = await Merchant.findOne({
      where: {
        merchant_id: req.body.merchant_id,
      },
      include: {
        model: BankAccount,
        as: "bankAccount",
        // as: "banckAccount",
        where: {
          account_level: "Primary",
        },
      },
    });
    if (merchant) {
      const newApiKey = await generateNewApiKey(
        req.body.merchant_id,
        req.body.expiryDate
      );
      if (newApiKey) {
        return res.json({ message: "Successfully generated" });
      } else {
        // return res
        //   .status(500)
        //   .json({ message: "Error generating new API key" });
        throw new CustomError("Error generating new API key", 500);
      }
    } else {
      // return res
      //   .status(404)
      //   .json({ message: "You Have No Primary Bank Account" });
      throw new CustomError("You Have No Primary Bank Account", 404);
    }
  } catch (error) {
    next(error);
  }
};

exports.gateApiKey = async (req, res, next) => {
  try {
    const { id } = req.query;
    const apikey = await getGeneratedApiKey(id);
    if (apikey) {
      const client_id = apikey.client_id;
      const secrate_key = apikey.secrate_key;
      // console.log(bankaccount_id);
      const apiKey = await ApiKey.findOne({
        where: {
          merchantMerchantId: apikey.merchant_id,
        },
      });
      const key = apiKey.key;
      return res.status(200).json({
        client_id,
        secrate_key,
        key,
      });
    } else {
      throw new CustomError("Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};
