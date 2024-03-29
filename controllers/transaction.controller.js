const CoopassPayment = require("../models/payment.models");
const PaypalPayment = require("../models/paypalPayment.models");
const EbirrPayment = require("../models/ebirrPayment.models");
const Merchant = require("../usermanagement/models/merchant.model");
const StripePayment = require("../models/stripePayment.models");
const CustomError = require("../utils/ErrorHandler");
exports.transaction = async (req, res, next) => {
  try {
    const payment = await CoopassPayment.findAll({
      where: {
        merchantMerchantId: req.merchant_id,
        status: "COMPLETED",
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.stripetransaction = async (req, res, next) => {
  try {
    const stripe = await StripePayment.findAll({
      where: {
        merchantMerchantId: req.merchant_id,
        status: "COMPLETED",
      },
    });
    if (stripe) {
      return res.status(200).json(stripe);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllTransaction = async (req, res, next) => {
  try {
    const payment = await CoopassPayment.findAll({
      where: {
        status: "COMPLETED",
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllStripeTransaction = async (req, res, next) => {
  try {
    const stripe = await StripePayment.findAll({
      where: {
        status: "COMPLETED",
      },
    });
    if (stripe) {
      return res.status(200).json(stripe);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.paypalTransaction = async (req, res, next) => {
  try {
    const payment = await PaypalPayment.findAll({
      where: {
        merchantMerchantId: req.merchant_id,
        status: "COMPLETED",
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.allPaypalTransaction = async (req, res, next) => {
  try {
    const payment = await PaypalPayment.findAll({
      where: {
        status: "COMPLETED",
      },
      include: {
        model: Merchant,
        as: "merchant",
        attributes: {
          exclude: [
            "password",
            "client_id",
            "secrate_key",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getEbirrTransactionById = async (req, res, next) => {
  try {
    const payment = await EbirrPayment.findAll({
      where: {
        merchantMerchantId: req.merchant_id,
        paymentStatus: "Approved",
      },
      include: {
        model: Merchant,
        as: "merchant",
        attributes: {
          exclude: [
            "password",
            "client_id",
            "secrate_key",
            "status",
            "role",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllEbirrTransactions = async (req, res, next) => {
  try {
    const payment = await EbirrPayment.findAll({
      where: {
        paymentStatus: "Approved",
      },
      include: {
        model: Merchant,
        as: "merchant",
        attributes: {
          exclude: [
            "password",
            "client_id",
            "secrate_key",
            "status",
            "role",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
