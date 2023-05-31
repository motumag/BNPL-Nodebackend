const express = require("express");
const multer = require("multer");
const eKycRouter = express.Router();
const path = require("path");
const { createNewEkyc } = require("../controllers/eKyc.controller"); // Import the controller function
// Set up Multer and other configurations
const storage = multer.diskStorage({
  destination: "./uploads", // Specify the directory to save the uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, fileName);
  },
});
const upload = multer({ storage });
// API endpoint to handle image uploads
eKycRouter.post(
  "/create",
  upload.fields([
    { name: "agreement_doc", maxCount: 1 },
    { name: "business_license", maxCount: 1 },
    { name: "valid_identification", maxCount: 1 },
  ]),
  createNewEkyc
);
module.exports = eKycRouter;
