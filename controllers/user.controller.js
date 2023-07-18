const Merchant = require("../../BNPL-Nodebackend/usermanagement/models/merchant.model");
const Otp = require("../models/otp.models");
const axios = require("axios");
const utils = require("../utils/utils");
const CustomError = require("../utils/ErrorHandler");
exports.getProfile = async (req, res, next) => {
  console.log("Id Is", req.query);
  console.log(req.body);
  id = req.params.id;
  try {
    let merchant = await Merchant.findOne({
      where: {
        merchant_id: id,
      },
    });
    if (merchant) {
      res.status(200).send({ merchant });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const { phoneNumber } = req.body;
  try {
    const userInfo = axios
      .post(process.env.USER_INFO, {
        phoneNumber,
      })
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((erro) => {
        next(erro);
      });
  } catch (error) {
    next(error);
  }
};
exports.sendOtp = async (req, res, next) => {
  const { Mobile } = req.body;
  const Text = await utils.generateRandomNumber();
  try {
    const userInfo = await axios
      .post(process.env.OTP_ENDPOINT, {
        Mobile,
        Text,
      })
      .then((response) => {
        Otp.create({ Mobile: Mobile, text: Text });
        return res.status(200).json(response.data);
      });
  } catch (error) {
    next(error);
  }
};
exports.verifyOtp = async (req, res, next) => {
  const { Mobile, Text } = req.body;
  try {
    const verfiyOtp = await Otp.findOne({
      where: { Mobile: Mobile.toString(), text: Text },
    });
    if (verfiyOtp) {
      verfiyOtp.destroy();
      return res.status(200).send("ok");
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
