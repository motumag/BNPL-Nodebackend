const Merchant = require("../../BNPL-Nodebackend/usermanagement/models/merchant.model");
const Otp = require("../models/otp.models");
const axios = require("axios");
const utils = require("../utils/utils");
exports.getProfile = async (req, res) => {
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
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getUserInfo = async (req, res) => {
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
        return res.status(500).send({ message: erro.message });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.sendOtp = async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.verifyOtp = async (req, res) => {
  const { Mobile, Text } = req.body;
  try {
    const verfiyOtp = await Otp.findOne({
      where: { Mobile: Mobile.toString(), text: Text },
    });
    if (verfiyOtp) {
      verfiyOtp.destroy();
      res.status(200).send("ok");
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
