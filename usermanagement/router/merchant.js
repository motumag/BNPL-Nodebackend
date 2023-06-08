const express = require("express");
const router = express.Router();
const { grantAccess } = require("../../middlewares/userVerification");
const {
  registerMerchant,
  getAllMerchants,
  loginMerchant,
  registerSales,
  loginSales,
  activateAccount,
  getAllMerchantsByPage,
} = require("../controllers/merchant");
// Import your controllers
const {
  getAllUser,
  getUserById,
  createAccount,
  generateApiKey,
  sendBussinessRequest,
  createNedajStation,
  getAgent,
  getAllAccount,
  getAllKey,
  getManager,
  getNedajStation,
  getPrimaryAccount,
  setPrimaryAccount,
} = require("../controllers/merchant");
// User routes
// router.get('/', grantAccess(['admin','user']), getAllUser);
router.post("/register", registerMerchant);
router.post("/login", loginMerchant);
router.get("/activate", activateAccount);
router.get("/all", getAllMerchants);
router.get("/byPage", getAllMerchantsByPage);
module.exports = router;
