const express = require('express');
const multer =require("multer")
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');   

// Import your controllers
const {
    createNewLoanConfiguration,
    getLoanConfiguration,
    editLoanConfiguration,
    getLoanRequest,
    createLoanRequest
} = require('../controllers/loan.controller');
// User routes

router.post('/create', grantAccess(['merchant']), createNewLoanConfiguration);
router.get('/getAll', grantAccess(['merchant', 'sales']), getLoanConfiguration);
router.put('/editloanConfig', grantAccess(['merchant']),editLoanConfiguration );
router.get('/getLoanRequest', grantAccess(['merchant']),getLoanRequest);




module.exports = router;
