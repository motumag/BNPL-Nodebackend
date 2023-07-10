const CustomeEkyc = require("../models/customer_eKyc.model");
// const Customer = require("../usermanagement/models/merchant.model");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
exports.CreateCustomerEkyc = async (req, res) => {
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
      return res.status(409).json({ error: "Customer is already onboarded" });
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
    console.error("Error while Adding CustomerEKYC:", error);
    res.status(500).json({ error: "Failed to create Customerkyc" });
  }
};
exports.getCustomerCreatedBySalesId = async (req, res) => {
  try {
    const customerDetail = await CustomeEkyc.findAll({
      // where: { sales_id: salesId },
    });
    if (customerDetail) {
      res.status(200).json({ customerDetail });
    } else {
      res
        .status(404)
        .json({ message: "No customer is found with this salesId" });
    }
  } catch (error) {
    console.log("Customer fetching error: ", error);
    res.status(500).json({ message: error.message });
  }
};
