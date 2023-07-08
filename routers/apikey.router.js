const express = require("express");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");
// Import your controllers
const {
  generateApiKey,
  gateApiKey,
} = require("../controllers/apiKey.controller");
// User routes
router.post("/generate", grantAccess(["merchant"]), generateApiKey);
router.get("/get", grantAccess(["merchant", "sales"]), gateApiKey);
module.exports = router;
