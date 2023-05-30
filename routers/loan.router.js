const express = require('express');
const multer =require("multer")
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');   

// Import your controllers
const {
    createNewLoanConfiguration,
    getLoanConfiguration
} = require('../controllers/loan.controller');
// User routes

router.post('/create', grantAccess(['sales']), createNewLoanConfiguration);
router.get('/getAll', grantAccess(['merchant', 'sales']), getLoanConfiguration);

module.exports = router;
