const express = require("express");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");
// Import your controllers
const {
  getUserInfo,
  sendOtp,
  verifyOtp,
} = require("../controllers/user.controller");
// User routes
// router.post("/create", grantAccess(["merchant"]), createServices);
// router.get("/get", grantAccess(["merchant", "sales"]), getServices);

router.post("/userInfo", getUserInfo);
router.post("/sendOtp", sendOtp);
router.post(
  "/verifyOtp",
  // accessControlMiddleWare.grantAccess(["user"]),
  verifyOtp
);
// router.get("/getAlluser", controller.getAllUser);
// router.get("/getUserById", controller.getUserById);
// router.post("/checkCredential", controller.checkCredential);
// router.get("/getAllUsers", controller.getAllUsers);

module.exports = router;
