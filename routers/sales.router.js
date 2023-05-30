const express = require('express');
const multer =require("multer")
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');   

// Import your controllers
const {
    getAllSales,
    loginSales,
    registerSales,getSalesById
} = require('../controllers/sales.controller');
// User routes

router.post('/register', grantAccess(['merchant']), registerSales);
router.post('/login', loginSales);
router.get('/getAll', grantAccess(['merchant', 'sales']), getAllSales);
router.get('/getById', grantAccess(['merchant']), getSalesById);

module.exports = router;
