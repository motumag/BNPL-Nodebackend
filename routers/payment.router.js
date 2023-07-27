const express = require("express");
const router = express.Router();
const {
  grantAccess,
  paymentServices,
  verifyKeys,
} = require("../middlewares/userVerification");
// Import your controllers
const {
  payment,
  paypalPyment,
  EbirrPayment,
  StripePaymentVerification,
  chapa_call_back_url,
  createPaymentServices,
  devicePayment,
  getPaymentService,
  getPendingPayment,
  initiateChapaPayment,
  initiatePayment,
  initiatePaypalPayment,
  initiateStripePayment,
  stripePayment,
  updatePaymentService,
  verifyEbirrPayment,
  verifyPayment,
  verifyPaypalPayment,
  verifyStripePayment,
  coopassPayment,
  assignPaymentServicesToMerchant,
  removePaymentServicesFromMerchant,
} = require("../controllers/payment.controller");
// const coopassPayment = require("../models/payment.models");
// // User routes
// router.post("/create", grantAccess(["merchant"]), createServices);
// router.get("/get", grantAccess(["merchant", "sales"]), getServices);
router.post("/api/payment", payment);
// router.post(
//   "/api/devicePayment",
//   [
//     middleware.clientandSecreteKey,
//     //   verifySignUp.checkRolesExisted,
//   ],
//   devicePayment
// );
router.post(
  "/initiatePayment",
  paymentServices(["COOPASS"]),
  verifyKeys,
  initiatePayment
);
router.post(
  "/initiatePaypalPayment",
  paymentServices(["PAYPAL"]),
  verifyKeys,
  initiatePaypalPayment
);
router.post(
  "/initiateStripePayment",
  paymentServices(["STRIPE"]),
  verifyKeys,
  initiateStripePayment
);
router.post(
  "/chapainitiate",
  paymentServices(["CHAPA"]),
  verifyKeys,
  initiateChapaPayment
);
router.post("/stripe-payment", stripePayment);
router.post("/paypal-payment", paypalPyment);
router.get("/getPaymentStatus", getPendingPayment);
router.get("/verifyCoopassPayment/:orderId", verifyPayment);
router.get("/verifyPaypalPayment/:orderId", verifyPaypalPayment);
router.get("/verifyEbirrPayment/:orderId", verifyEbirrPayment);
router.get("/verifyStripePayment/:orderId", StripePaymentVerification);
router.post("/verify-stripe-payment", verifyStripePayment);
router.post("/createPaymentServices", createPaymentServices);
router.get("/getPaymentService", getPaymentService);
router.put("/updatePaymentService", updatePaymentService);
router.post(
  "/assignMerchantToPaymentServices",
  assignPaymentServicesToMerchant
);
router.post(
  "/removeMerchantFromPaymentServices",
  removePaymentServicesFromMerchant
);
router.post(
  "/EbirrPayment",
  paymentServices(["EBIRR"]),
  verifyKeys,
  EbirrPayment
);
router.post(
  "/coopas_payment",
  paymentServices(["COOPASS"]),
  verifyKeys,
  coopassPayment
);
router.post("/chapa_call_back", chapa_call_back_url);
module.exports = router;
