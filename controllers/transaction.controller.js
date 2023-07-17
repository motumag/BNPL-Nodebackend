const CoopassPayment = require("../models/payment.models");
const PaypalPayment = require("../models/paypalPayment.models");
const EbirrPayment = require("../models/ebirrPayment.models");
const Merchant = require("../usermanagement/models/merchant.model");
const StripePayment = require("../models/stripePayment.models");
exports.transaction = async (req, res, next) => {
  try {
    const { merchant_id } = req.query;
    const payment = await CoopassPayment.findAll({
      where: {
        merchantMerchantId: merchant_id,
        status: "COMPLETED",
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.stripetransaction = async (req, res, next) => {
  try {
    const { merchant_id } = req.query;
    console.log(user_id);
    const stripe = await StripePayment.findAll({
      where: {
        merchantMerchantId: merchant_id,
        status: "COMPLETED",
      },
    });
    if (stripe) {
      return res.status(200).json(stripe);
    } else {
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.paypalTransaction = async (req, res, next) => {
  try {
    const { merchant_id } = req.query;
    const payment = await PaypalPayment.findAll({
      where: {
        merchantMerchantId: merchant_id,
        status: "COMPLETED",
      },
    });
    if (payment) {
      return res.status(200).json(payment);
    } else {
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getEbirrTransactionById = async (req, res, next) => {
  try {
    const { merchant_id } = req.query;
    const payment = await EbirrPayment.findAll({
      where: {
        merchantMerchantId: merchant_id,
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
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
