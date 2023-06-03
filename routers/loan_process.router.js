const express = require("express");
const multer = require("multer");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");

// Import your controllers
const {
  OrderLoanProcess,
  getLoanProcess,
  getItemsLoan
} = require("../controllers/loan_process.controller");
// User routes

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

module.exports = router;
