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
/**
 * @swagger
 * /coopasstransaction:
 *   get:
 *     summary: Get a list of transactions
 *     description: Retrieve a list of all transaction.
 *     responses:
 *       '200':
 *         description: A list of transaction.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
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
router.get("/allpaypalTransaction", allPaypalTransaction);
router.get(
  "/ebirrTransactionById",
  grantAccess(["merchant"]),
  getEbirrTransactionById
);
router.get("/allEbirrTransactions", getAllEbirrTransactions);

module.exports = router;
