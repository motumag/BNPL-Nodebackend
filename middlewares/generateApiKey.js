const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const BankAccount = require("../models/bankAccount.models");
const Merchant = require(".././usermanagement/models/merchant.model");
const ApiKey = require("../models/apiKeys.models");

exports.generateNewApiKey = async (merchantId, expiryDate) => {
  try {
    // console.log(req.body);
    let merchant = await Merchant.findOne({
      where: {
        merchant_id: merchantId,
      },
    });
    if (!merchant)
      throw new Error("You Have No Account with This Account Number");

    let apiKey = await ApiKey.findOne({
      where: { merchantMerchantId: merchantId },
    });
    if (apiKey) await apiKey.destroy();
    // let resetToken = crypto.randomBytes(32).toString("hex");
    // const hash = await bcrypt.hash(resetToken, Number(10));
    const newId = uuidv4();
    await ApiKey.create({
      merchantMerchantId: merchant.merchant_id,
      key: newId,
      createdAt: Date.now() + expiryDate * 24 * 60 * 60 * 1000,
    });

    return ApiKey;
  } catch (error) {
    console.log(error);
  }
};

exports.getGeneratedApiKey = async (merchant_id) => {
  try {
    console.log("merchant_id: " + merchant_id);
    let merchant = await Merchant.findOne({
      where: {
        merchant_id: merchant_id,
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

    return merchant;
  } catch (error) {
    return error;
  }
};
