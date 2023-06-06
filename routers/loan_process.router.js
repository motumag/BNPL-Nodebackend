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
  getLoanRequestBySalesId
} = require("../controllers/loan_process.controller");
// User routes


// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
// Create the Multer upload instance
const upload = multer({ storage: storage });




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
router.post('/loanRequest', upload.single("profile_picture"),createLoanRequest);
router.get('/getLoanReq', getLoanRequestBySalesId);
router.get('/generateLoanAgreement', getLoanRequestBySalesId);
module.exports = router;
