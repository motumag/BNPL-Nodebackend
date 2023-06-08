const express = require('express');
const multer =require("multer");
const fs = require('fs');
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');   

// Import your controllers
const {
    getAllSales,
    loginSales,
    registerSales,getSalesById,sendRequestForApproval,getAllSalesKyc,approveSalesKyc,rejectSalesKyc
} = require('../controllers/sales.controller');

// User routes

  // Set up Multer storage
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          const directory = "uploads/salesKyc";

          // Create the directory if it doesn't exist
          fs.mkdirSync(directory, { recursive: true });
          cb(null, directory);
        cb(null, directory); // Set the destination directory for uploaded images
        },
        filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
        },
    });

    // Create the Multer upload instance
    const upload = multer({ storage: storage });
router.post('/register', grantAccess(['merchant']), registerSales);
router.post('/login', loginSales);
router.get('/getAll', grantAccess(['merchant', 'sales']), getAllSales);
router.get('/getById', grantAccess(['merchant']), getSalesById);
router.post('/kycRequest', grantAccess(['sales']),upload.single('valid_identification'), sendRequestForApproval);
router.get('/getAllKyc', grantAccess(['merchant']), getAllSalesKyc);
router.put('/approveKyc', grantAccess(['merchant']), approveSalesKyc);
router.put('/rejectKyc', grantAccess(['merchant']), rejectSalesKyc);
module.exports = router;
