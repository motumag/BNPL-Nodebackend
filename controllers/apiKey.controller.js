const {
  generateNewApiKey,
  getGeneratedApiKey,
} = require("../middlewares/generateApiKey");
const ApiKey = require("../models/apiKeys.models");
const BankAccount = require("../models/bankAccount.models");
const Merchant = require(".././usermanagement/models/merchant.model");
exports.generateApiKey = async (req, res, next) => {
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
      return res.status(500).json({ message: "Error generating new API key" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "You Have No Primary Bank Account" });
  }
};

exports.gateApiKey = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  const apikey = await getGeneratedApiKey(id);
  console.log(apikey);
  if (apikey) {
    const client_id = apikey.client_id;
    const secrate_key = apikey.secrate_key;
    // console.log(bankaccount_id);
    try {
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
    } catch (error) {
      console.log(error.message);
    }
  } else {
    return res.status(404).json({ message: "Not Found" });
  }
};
