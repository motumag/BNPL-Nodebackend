const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { createNewEkyc } = require("../controllers/eKyc.controller"); // Import the controller function

// API endpoint to handle image uploads
router.post("/create", createNewEkyc);
module.exports = router;
