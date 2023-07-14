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
  grantAccess(["merchant", "Admin"]),
  stripetransaction
);
router.get(
  "/allstripetransaction",
  grantAccess(["Admin"]),
  getAllStripeTransaction
);
router.get(
  "/allcoopasstransactions",
  grantAccess(["Admin"]),
  getAllTransaction
);
router.get(
  "/paypalTransaction",
  grantAccess(["merchant", "Admin"]),
  paypalTransaction
);
router.get(
  "/allpaypalTransaction",
  grantAccess(["merchant", "Admin"]),
  allPaypalTransaction
);
router.get(
  "/ebirrTransactionById",
  grantAccess(["merchant", "Admin"]),
  getEbirrTransactionById
);
router.get(
  "/allEbirrTransactions",
  grantAccess(["Admin"]),
  getAllEbirrTransactions
);

module.exports = router;
