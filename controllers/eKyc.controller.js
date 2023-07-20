const Ekyc = require("../models/eKyc.model");
const Merchant = require("../usermanagement/models/merchant.model");
const BankAccount = require("../models/bankAccount.models");
const { approveMerchants } = require("../middlewares/adminAuth");
const { v4: uuidv4 } = require("uuid");
const Services = require("../models/service.models");
const { where } = require("sequelize");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const CustomError = require("../utils/ErrorHandler");
exports.createNewEkyc = async (req, res, next) => {
  try {
    // console.log("The merchant_id req is: ", req.body.merchant_id);
    var {
      first_name,
      last_name,
      business_name,
      business_type,
      tin_number,
      business_address,
      website_url,
      legal_entity_type,
      date_of_establishment,
      compliance_aml,
      merchant_id,
    } = req.body;
    console.log(req.body);
    // first_name=first_name||"";
    // last_name=last_name||"";
    // business_name=business_name||"";
    // business_type=business_type||"";
    // tin_number=tin_number||"";
    // business_address=business_address||"";
    // website_url=website_url||"";
    // legal_entity_type=legal_entity_type||"";
    // date_of_establishment=date_of_establishment||"";
    // compliance_aml=compliance_aml||""
    // merchant_status=merchant_status||"";
    var agreament_doc_cleaned_path = "";
    var business_license_cleaned_path = "";
    var valid_identification_cleaned_path = "";
    console.log(req.files);
    if (req.files) {
      console.log("Files");
      var { agreement_doc, business_license, valid_identification } = req.files;
      const agreement_doc_path = agreement_doc[0].path;
      const business_license_path = business_license[0].path;
      const valid_identification_path = valid_identification[0].path;
      console.log("agreement_doc_path", agreement_doc_path);
      agreament_doc_cleaned_path = agreement_doc_path.replace(
        "uploads\\merchantKyc\\",
        ""
      );
      console.log("agreement doc cleaned path",agreament_doc_cleaned_path)
      business_license_cleaned_path = business_license_path.replace(
        "uploads\\merchantKyc\\",
        ""
      );
      valid_identification_cleaned_path = valid_identification_path.replace(
        "uploads\\merchantKyc\\",
        ""
      );

      //create the ekyc
      const existingKyc = await Ekyc.findOne({
        where: { merchant_id: merchant_id },
      });
      if (existingKyc) {
        return res.status(409).json({ error: "Ekyc already exists" });
      } else {
        const newEkyc = await Ekyc.create({
          first_name,
          last_name,
          business_name,
          business_type,
          tin_number,
          business_address,
          website_url,
          legal_entity_type,
          date_of_establishment,
          compliance_aml,
          agreement_doc:
            IMAGE_UPLOAD_BASE_URL + "merchantKyc/" + agreament_doc_cleaned_path, // Store the agreement_doc file path
          business_licnense:
            IMAGE_UPLOAD_BASE_URL +
            "merchantKyc/" +
            business_license_cleaned_path, // Store the business_license file path
          valid_identification:
            IMAGE_UPLOAD_BASE_URL +
            "merchantKyc/" +
            valid_identification_cleaned_path, // Store the valid_identification file path

          merchant_id: merchant_id,
        });
        return res.status(200).json(newEkyc);
      }
    } else {
      const existingKyc = await Ekyc.findOne({
        where: { merchant_id: merchant_id },
      });
      if (existingKyc) {
        throw new CustomError("Ekyc already exists", 409);
      } else {
        const newEkyc = await Ekyc.create({
          first_name,
          last_name,
          business_name,
          business_type,
          tin_number,
          business_address,
          website_url,
          legal_entity_type,
          date_of_establishment,
          compliance_aml,
          // Store the valid_identification file path
          // merchant_status,
          merchant_id: merchant_id,
        });
        return res.status(200).json(newEkyc);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getMerchantKyc = async function (req, res, next) {
  // console.log("The incomming req is: ", inc.compliance_aml);
  try {

    const merchant_kyc = await Ekyc.findOne({
      where: { merchant_id: req.merchant_id },

    });
    if (merchant_kyc) {
      res.status(200).json(merchant_kyc);
    } else {
      throw new CustomError("Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getAllMerchantEkyc = async (request, response, next) => {
  try {
    // const user = await getUserById(userId);
    const all_merchant = await Ekyc.findAll();

    if (all_merchant) {
      response.status(200).send(all_merchant);
    } else {
      throw new CustomError("Merchant dont have kyc", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.createBankAccount = async function (req, res, next) {
  // console.log("The incomming req is: ", inc.compliance_aml);
  try {
    const { account_number, phone_number } = req.body;
    const merchant_account_number = await BankAccount.findOne({
      where: { account_number: account_number },
    });
    if (merchant_account_number) {
      throw new CustomError("Account already Exists", 409);
    } else {
      const account_num = await BankAccount.create({
        account_number: account_number,
        phone_number: phone_number,
      });
      const merchant = await Merchant.findOne({
        where: { merchant_id: req.merchant_id },
      });
      await account_num.setMerchant(merchant);
      res
        .status(201)
        .json({ account_num, message: "Bank Account Created Successfully " });
    }
  } catch (error) {
    next(error);
  }
};
exports.setPrimaryAccount = async (req, res, next) => {
  try {
    const { bank_account_id } = req.body;
    const primary_account_number = await BankAccount.findAll({
      where: {
        merchant_id: req.merchant_id,
        // bank_account_id: bank_account_id,
        account_level: "Primary",
      },
    });

    if (primary_account_number) {
      console.log(primary_account_number);
      primary_account_number.forEach((bankAccount) => {
        bankAccount.account_level = "Secondary";
        bankAccount.save();
      });
    }
    const account_number = await BankAccount.findOne({
      where: {
        merchant_id: req.merchant_id,
        bank_account_id: bank_account_id,
        account_level: "Secondary",
      },
    });
    if (account_number) {
      account_number.account_level = "Primary";
      account_number.save();
      return res
        .status(201)
        .json({ message: "Primary Account Successfully Sated" });
    } else {
      throw new CustomError("You Have NO Bank Account", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getMerchantAccountNumber = async function (req, res, next) {
  try {
    const { merchant_id } = req.query;
    const account_number = await BankAccount.findAll({
      include: {
        model: Merchant,
        as: "merchant",
        attributes: ["merchant_id", "email_address"],
        where: { merchant_id: req.merchant_id },
      },
    });
    if (account_number) {
      return res.status(200).json({ account_number });
    } else {
      throw new CustomError("Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.approveMerchantsByAdmin = async (req, res, next) => {
  try {
    const { statusChange, merchantId, service_id } = req.body;
    const tokenWithPrefix = req.headers.authorization;
    const result = approveMerchants(tokenWithPrefix);
    const newId = uuidv4();
    console.log("who are you?", result);
    if (result == undefined) {
      throw new CustomError("You are not authorized to approve merchants", 403);
    }
    if (result == "Admin") {
      const merchantDetail = await Ekyc.findOne({
        where: { merchant_id: merchantId },
      });
      console.log(merchantDetail);
      if (merchantDetail) {
        if (merchantDetail.merchant_status == "Accepted") {
          throw new CustomError("Merchant is already approved", 409);
        }
        // const merchantKycStatus = merchantDetail.merchant_status;

        const ekycUpdate = await Ekyc.update(
          { merchant_status: statusChange }, // Provide the new status value here
          {
            where: { merchant_id: merchantId }, // Specify the merchant ID to update
          }
        );
        if (ekycUpdate) {
          var merchant = await Merchant.findOne({
            where: { merchant_id: merchantId },
          });
          merchant.secrate_key = newId;
          merchant.services_id = service_id;
          merchant.save();
          return res.status(200).json({ message: "approved Successfully" });
        } else {
          throw new CustomError("Not Approved", 500);
        }
      } else if (merchantDetail == null) {
        throw new CustomError("Not Found", 404);
      }
    } else {
      throw new CustomError(
        "You are not autorized to approve the merchant",
        404
      );
    }
  } catch (error) {
    next(error);
  }
};
