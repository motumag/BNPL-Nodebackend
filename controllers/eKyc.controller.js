const Ekyc = require("../models/eKyc.model");
const Merchant = require("../usermanagement/models/merchant.model");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
exports.createNewEkyc = async (req, res) => {
  try {
    // console.log("The incomming req is: ", inc.compliance_aml);
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
      merchant_id
    } = req.body;
    var {agreement_doc,business_license,valid_identification}=req.files;
    console.log(req.files)
    console.log(req.body)
    const agreement_doc_path = agreement_doc[0].path
    const business_license_path = business_license[0].path
    const valid_identification_path = valid_identification[0].path
    const agreament_doc_cleaned_path = agreement_doc_path.replace("uploads\\",'')
    const business_license_cleaned_path = business_license_path.replace("uploads\\",'')
    const valid_identification_cleaned_path = valid_identification_path.replace("uploads\\",'')
    //create the ekyc
    // const merchant = await Merchant.findOne({ where: { sales_id } });
    const existingKyc = await Ekyc.findOne({where:{merchant_id:merchant_id}})
    if (existingKyc) {
      return res.status(409).json({ error: "Ekyc already exists" });
    }else{
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
        agreement_doc: IMAGE_UPLOAD_BASE_URL+agreament_doc_cleaned_path, // Store the agreement_doc file path
        business_licnense: IMAGE_UPLOAD_BASE_URL+business_license_cleaned_path, // Store the business_license file path
        valid_identification: IMAGE_UPLOAD_BASE_URL+valid_identification_cleaned_path, // Store the valid_identification file path
        merchant_status,
        merchant_id:merchant_id
      });
      res.status(200).json(newEkyc);
    }
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ error: "Failed to create business" });
  }
};

exports.getMerchantKyc = async function (req, res, next) {
  // console.log("The incomming req is: ", inc.compliance_aml);
  const {
    merchant_id,
  } = req.query;
 const merchant_kyc = await Ekyc.findOne({where:{merchant_id:merchant_id}})
 if (merchant_kyc) {
  res.status(200).json(merchant_kyc);
 }else{
  res.status(400).json({message:"Not Found"})
 }

}