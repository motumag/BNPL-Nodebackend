const express = require("express");
const multer = require("multer");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");

// Import your controllers
const {
  OrderLoanProcess,
  getLoanProcess,
  getItemsLoan,
  createLoanRequest,
  getLoanRequestBySalesId,
  generateLoanAgreement,
  createSalesToAdminLoanRequest,
} = require("../controllers/loan_process.controller");
// User routes

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "uploads/";

    // Create the directory if it doesn't exist
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory); // Set the destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploaded files
    const directory = "uploads/signedAgreementDoc";

    // Create the directory if it doesn't exist
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
    
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// Create the Multer upload instance
const upload = multer({ storage: storage });
const uploadPdf = multer({ storage: pdfStorage });

router.post("/create", grantAccess(["sales"]), OrderLoanProcess);
router.get(
  "/getCustomerInfoLoanProcess",
  // grantAccess(["merchant"]),
  getLoanProcess
);
router.get(
  "/getItemsLoan",
  // grantAccess(["merchant"]),
  getItemsLoan
);
router.post(
  "/loanRequest",
  upload.single("profile_picture"),
  createLoanRequest
);
router.get("/getLoanReq", getLoanRequestBySalesId);
router.post("/generateLoanAgreement", generateLoanAgreement);
// Creating Loans from Sales to Admin Request
router.post(
  "/newLoanRequest",
  uploadPdf.single("agreementDocument"),
  createSalesToAdminLoanRequest
);
module.exports = router;
