const Ekyc = require("../models/eKyc.model");
exports.createNewEkyc = async (req, res) => {
  try {
    const {
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
    } = req.body;
    //create the ekyc
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
      agreement_doc: req.files["agreement_doc"][0].path, // Store the agreement_doc file path
      business_license: req.files["business_license"][0].path, // Store the business_license file path
      valid_identification: req.files["valid_identification"][0].path, // Store the valid_identification file path
      merchant_status,
    });
    res.json(newEkyc);
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ error: "Failed to create business" });
  }
};
