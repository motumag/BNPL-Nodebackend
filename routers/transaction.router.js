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
router.get("/allstripetransaction", getAllStripeTransaction);
router.get("/allcoopasstransactions", getAllTransaction);
router.get("/paypalTransaction", grantAccess(["merchant"]), paypalTransaction);
router.get(
  "/allpaypalTransaction",
  grantAccess(["merchant"]),
  allPaypalTransaction
);
router.get(
  "/ebirrTransactionById",
  grantAccess(["merchant"]),
  getEbirrTransactionById
);
router.get("/allEbirrTransactions", getAllEbirrTransactions);

module.exports = router;
