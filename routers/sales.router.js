const express = require('express');
const multer =require("multer")
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');   

// Import your controllers
const {
    getAllSales,
    loginSales,
    registerSales,getSalesById,sendRequestForApproval,getAllSalesKyc,approveSalesKyc
} = require('../controllers/sales.controller');

// User routes

    // Set up Multer storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'uploads/salesKyc'); // Set the destination directory for uploaded images
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
router.post('/kycRequest', grantAccess(['sales']),upload.single('picture'), sendRequestForApproval);
router.get('/getAllKyc', grantAccess(['merchant']), getAllSalesKyc);
router.post('/approveKyc', grantAccess(['merchant']), approveSalesKyc);


module.exports = router;
