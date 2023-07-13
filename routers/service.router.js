const express = require("express");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");
// Import your controllers
const {
  createServices,
  getServices,
} = require("../controllers/service.controller");
// User routes
router.post("/create", grantAccess(["Admin"]), createServices);
router.get("/get", grantAccess(["merchant", "sales"]), getServices);
module.exports = router;
