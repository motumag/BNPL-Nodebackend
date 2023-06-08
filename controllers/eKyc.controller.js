const Ekyc = require("../models/eKyc.model");
const Merchant = require("../usermanagement/models/merchant.model");
const BankAccount = require("../models/bankAccount.models");
const { approveMerchants } = require("../middlewares/adminAuth");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
exports.createNewEkyc = async (req, res) => {
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
      merchant_status,
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
          merchant_status,
          merchant_id: merchant_id,
        });
        return res.status(200).json(newEkyc);
      }
    } else {
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
          // Store the valid_identification file path
          merchant_status,
          merchant_id: merchant_id,
        });
        return res.status(200).json(newEkyc);
      }
    }
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ error: "Failed to create business" });
  }
};

exports.getMerchantKyc = async function (req, res, next) {
  // console.log("The incomming req is: ", inc.compliance_aml);
  const { merchant_id } = req.query;
  const merchant_kyc = await Ekyc.findOne({
    where: { merchant_id: merchant_id },
  });
  if (merchant_kyc) {
    res.status(200).json(merchant_kyc);
  } else {
    res.status(400).json({ message: "Not Found" });
  }
};
exports.getAllMerchantEkyc = async (request, response) => {
  try {
    // const user = await getUserById(userId);
    const all_merchant = await Ekyc.findAll();

    if (all_merchant) {
      response.status(200).send(all_merchant);
    } else {
      response.status(400).json("Merchant dont have kyc");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};
exports.createBankAccount = async function (req, res, next) {
  // console.log("The incomming req is: ", inc.compliance_aml);
  try {
    const { merchant_id, account_number } = req.body;
    const merchant_account_number = await BankAccount.findOne({
      where: { account_number: account_number },
    });
    if (merchant_account_number) {
      res.status(409).json({ message: "Account already Exists" });
    } else {
      const account_num = await BankAccount.create({
        account_number: account_number,
      });
      const merchant = await Merchant.findOne({
        where: { merchant_id: merchant_id },
      });
      await account_num.setMerchant(merchant);
      res
        .status(201)
        .json({ account_num, message: "Bank Account Created Successfully " });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating" });
  }
};
exports.getMerchantAccountNumber = async function (req, res) {
  const { merchant_id } = req.query;
  try {
    const account_number = await BankAccount.findAll({
      include: {
        model: Merchant,
        as: "merchant",
        attributes: ["merchant_id", "email_address"],
        where: { merchant_id: merchant_id },
      },
    });
    if (account_number) {
      return res.status(200).json({ account_number });
    } else {
      return res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.approveMerchantsByAdmin = async (req, res) => {
  const { statusChange, merchantId } = req.body;
  const tokenWithPrefix = req.headers.authorization;
  const result = approveMerchants(tokenWithPrefix);
  console.log("who are you?", result);
  if (result == undefined) {
    return res
      .status(403)
      .json({ message: "You are not authorized to approve merchants" });
  }
  if (result == "Admin") {
    const merchantDetail = await Ekyc.findOne({
      where: { merchant_id: merchantId },
    });
    if (merchantDetail) {
      if (merchantDetail.merchant_status == "Accepted") {
        return res
          .status(409)
          .json({ message: "Merchant is already approved" });
      }
      // const merchantKycStatus = merchantDetail.merchant_status;
      Ekyc.update(
        { merchant_status: statusChange }, // Provide the new status value here
        {
          where: { merchant_id: merchantId }, // Specify the merchant ID to update
        }
      )
        .then((resultUpdated) => {
          // The update operation was successful
          console.log("Merchant status updated successfully.");
          return res.status(200).json({
            message: "Merchant status updated successfully.",
            resultUpdated,
          });
        })
        .catch((error) => {
          // Handle any errors that occur during the update operation
          console.error("Error updating merchant status:", error);
          return res
            .status(500)
            .json({ message: "Merchant status updated successfully." });
        });
    }
  } else {
    return res
      .status(400)
      .json({ message: "You are not autorized to approve the merchantr" });
  }
};
