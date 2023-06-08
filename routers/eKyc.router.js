const express = require("express");
const multer = require("multer");
const fs = require('fs');
const router = express.Router();
const path = require("path");
const { grantAccess } = require("../middlewares/userVerification");
// API endpoint to handle image uploads
const {
  createNewEkyc,
  getMerchantKyc,
  createBankAccount,
  getMerchantAccountNumber,
} = require("../controllers/eKyc.controller");
const merchantUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "uploads/merchantKyc";

    // Create the directory if it doesn't exist
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory); // Set the destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const uploadArray = multer({ storage: merchantUpload });

router.post(
  "/create",
  grantAccess(["merchant"]),
  uploadArray.fields([
    {
      name: "agreement_doc",
      maxCount: 1,
    },
    {
      name: "business_license",
      maxCount: 1,
    },
    {
      name: "valid_identification",
      maxCount: 1,
    },
  ]),
  createNewEkyc
);
router.get("/getKyc", grantAccess(["merchant"]), getMerchantKyc);
router.post("/account", grantAccess(["merchant"]), createBankAccount);
router.get("/account", grantAccess(["merchant"]), getMerchantAccountNumber);
module.exports = router;
