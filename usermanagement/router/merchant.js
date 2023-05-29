const express = require('express');
const router = express.Router();
const {grantAccess} = require('../../middlewares/userVerification');
const {registerMerchant,loginMerchant,registerSales,loginSales}=require("../controllers/merchant")
// Import your controllers
const {
    getAllUser,
    getUserById,
    createAccount, 
    generateApiKey, 
    sendBussinessRequest,
    createNedajStation,
    getAgent,
    getAllAccount,
    getAllKey,
    getManager,
    getNedajStation,
    getPrimaryAccount,
    setPrimaryAccount
} = require('../controllers/merchant');
// User routes
// router.get('/', grantAccess(['admin','user']), getAllUser);
router.post('/register', registerMerchant);
router.post('/login', loginMerchant);
router.post('/sales/register', grantAccess(['merchant']), registerSales);
router.post('/sales/login', loginSales);
router.post('/activate', loginSales);
// router.get('/:id', grantAccess(['user', 'admin']), getUserById);
// router.get('/createAccount', grantAccess(['user']),createAccount);
// router.get('/setPrimaryAccount', grantAccess(['user']),createAccount);
// router.get('/generateApiKey', grantAccess(['user']),generateApiKey);
// router.get('/bussinessRequest', grantAccess(['user']),sendBussinessRequest);
module.exports = router;
