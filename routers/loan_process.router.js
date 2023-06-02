const express = require("express");
const multer = require("multer");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");

// Import your controllers
const {
  OrderLoanProcess,
  getLoanProcess,
} = require("../controllers/loan_process.controller");
// User routes

router.post(
  "/create",
  // grantAccess(["merchant"]),
  OrderLoanProcess
);
router.get(
  "/getCustomerInfoLoanProcess",
  // grantAccess(["merchant"]),
  getLoanProcess
);

module.exports = router;
