const express = require('express');
const router = express.Router();
const {grantAccess} = require('../../middlewares/userVerification');
const {registerMerchant,loginMerchant,activateAccount,getUserInfo,sendOtp,verifyOtp}=require("../controllers/merchant")
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
router.get('/activate', activateAccount);
router.get('/userInfo', getUserInfo);
router.post('/sendOtp', sendOtp);
router.post('/sendOtp', verifyOtp);
module.exports = router;
