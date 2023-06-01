const express = require("express");
const pdfController = require("../controllers/pdfController");

const router = express.Router();

router.get("/generate-pdf", pdfController.generatePDF);

module.exports = router;
