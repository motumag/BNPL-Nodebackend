const CustomeEkyc = require("../models/customer_eKyc.model");
// const Customer = require("../usermanagement/models/merchant.model");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const CustomError = require("../utils/ErrorHandler");
exports.CreateCustomerEkyc = async (req, res, next) => {
  try {
    console.log("Customer: ", req.body.salesSalesid);
    const {
      first_name,
      last_name,
      phone_number,
      email,
      address,
      employment_status,
      monthly_income,
      national_id_number,
      loan_status,
      pre_loan_record,
      // sales_id,
    } = req.body;

    var { national_id_doc, passport, driving_license } = req.files;

    const national_id_path = national_id_doc[0].path;
    const passport_path = passport[0].path;
    const driving_license_path = driving_license[0].path;

    const national_id_doc_cleaned_path = national_id_path.replace(
      "uploads\\",
      ""
    );
    const passport_cleaned_path = passport_path.replace("uploads\\", "");
    const driving_license_cleaned_path = driving_license_path.replace(
      "uploads\\",
      ""
    );
    //create the ekyc
    const existingKyc = await CustomeEkyc.findOne({
      where: { national_id_number: national_id_number },
    });
    if (existingKyc) {
      throw new CustomError("Customer is already onboarded", 409);
    } else {
      const newEkyc = await CustomeEkyc.create({
        first_name,
        last_name,
        phone_number,
        email,
        address,
        employment_status,
        monthly_income,
        national_id_number,
        national_id_doc: IMAGE_UPLOAD_BASE_URL + national_id_doc_cleaned_path, // Store the agreement_doc file path
        passport: IMAGE_UPLOAD_BASE_URL + passport_cleaned_path, // Store the business_license file path
        driving_license: IMAGE_UPLOAD_BASE_URL + driving_license_cleaned_path, // Store the valid_identification file path
        loan_status,
        pre_loan_record,
        // sales_id,
      });
      res.json(newEkyc);
    }
  } catch (error) {
    next(error);
  }
};
exports.getCustomerCreatedBySalesId = async (req, res, next) => {
  try {
    const customerDetail = await CustomeEkyc.findAll({
      // where: { sales_id: salesId },
    });
    if (customerDetail) {
      return res.status(200).json({ customerDetail });
    } else {
      throw new CustomError("No customer is found with this salesId", 404);
    }
  } catch (error) {
    next(error);
  }
};
