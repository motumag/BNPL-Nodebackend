const LoanConfiguration = require("../models/LoanConfig.models");
const LoanRequest = require("../models/customerLoan.models");
const Merchant = require("../usermanagement/models/merchant.model");
const axios = require("axios");
const CustLoanReq = require("../models/customerLoan.models");
const Sales = require("../usermanagement/models/sales.model");
const Items = require(".././models/item.model");
const generatePdf = require("../middlewares/generateLoanAgreement");
const CustomError = require("../utils/ErrorHandler");
exports.createNewLoanConfiguration = async (req, res) => {
  try {

    const { interest_rate, duration } = req.body;
    const loanConf = LoanConfiguration.create({
      interest_rate,
      duration,
      merchant_id: req.merchant_id,

    });
    res.status(201).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};
exports.getLoanConfiguration = async (req, res) => {
  try {
    const { id } = req.query;
    const merchant = await Merchant.findByPk(id, {
      include: LoanConfiguration,
    });
    if (merchant) {
      const loans = merchant.loanconfs;
      return res.status(200).json(loans);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.createNewLoan = async (req, res) => {
  try {
    const { id } = req.query;
    const merchant = await Merchant.findByPk(id, {
      include: LoanConfiguration,
    });
    if (merchant) {
      const loans = merchant.loanconfs;
      return res.status(200).json(loans);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllLoan = async (req, res) => {
  try {
    const { id } = req.query;
    const merchant = await Merchant.findByPk(id, {
      include: LoanConfiguration,
    });
    if (merchant) {
      const loans = merchant.loanconfs;
      return res.status(200).json(loans);
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};

exports.editLoanConfiguration = async (req, res, next) => {
  try {
    const { loan_conf_id, duration, interest_rate } = req.body;
    const loanConfiguration = await LoanConfiguration.findOne({
      where: { merchant_id: req.merchant_id, loan_conf_id: loan_conf_id },
    });
    console.log(loanConfiguration);
    if (!loanConfiguration) {
      throw new CustomError("not found", 404);
    } else {
      loanConfiguration.duration = duration;
      loanConfiguration.interest_rate = interest_rate;
      loanConfiguration.save();
      return res.status(200).json({ loanConfiguration });
    }
  } catch (error) {
    next(error);
  }
};
exports.getLoanRequest = async (req, res, next) => {
  try {


    axios.get(process.env.LOAN_ADMIN_ENDPOINT).then((response) => {
      return res.status(200).json(response.data);
    });
  } catch (error) {
    next(error);
  }
};
