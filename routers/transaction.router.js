const express = require("express");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");
// Import your controllers
const {
  transaction,
  allPaypalTransaction,
  getAllEbirrTransactions,
  getAllStripeTransaction,
  getAllTransaction,
  getEbirrTransactionById,
  paypalTransaction,
  stripetransaction,
} = require("../controllers/transaction.controller");

router.get(
  "/coopasstransaction",
  grantAccess(["merchant", "Admin"]),
  transaction
);
router.get(
  "/stripetransaction",
  // grantAccess(["user", "admin"]),
  stripetransaction
);
router.get(
  "/allstripetransaction",
  grantAccess(["admin"]),
  getAllStripeTransaction
);
router.get(
  "/allcoopasstransactions",
  grantAccess(["admin"]),
  getAllTransaction
);
router.get(
  "/paypalTransaction",
  grantAccess(["user", "admin"]),
  paypalTransaction
);
router.get(
  "/allpaypalTransaction",
  grantAccess(["user", "admin"]),
  allPaypalTransaction
);
router.get(
  "/ebirrTransactionById",
  grantAccess(["user", "admin"]),
  getEbirrTransactionById
);
router.get(
  "/allEbirrTransactions",
  grantAccess(["admin"]),
  getAllEbirrTransactions
);

module.exports = router;
