const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { grantAccess } = require("../middlewares/userVerification");
// API endpoint to handle image uploads
const {
  CreateCustomerEkyc,
  getCustomerCreatedBySalesId,
} = require("../controllers/customer.eky.controller");
const customerEkycUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customerEkyc"); // Set the destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
const uploadArray = multer({ storage: customerEkycUpload });

router.post(
  "/create",
  //   grantAccess(["merchant"]),
  uploadArray.fields([
    {
      name: "national_id_doc",
      maxCount: 1,
    },
    {
      name: "passport",
      maxCount: 1,
    },
    {
      name: "driving_license",
      maxCount: 1,
    },
  ]),
  CreateCustomerEkyc
);
router.get("/getBysalesId", getCustomerCreatedBySalesId);
module.exports = router;
