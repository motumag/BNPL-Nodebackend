const express = require('express');
const router = express.Router();
const {grantAccess} = require('../middleware/authMiddleware');
const {registerUser,loginUser}=require("../controller/auth")
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
} = require('../controller/user');
// User routes
router.get('/', grantAccess(['admin','user']), getAllUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', grantAccess(['user', 'admin']), getUserById);
router.get('/createAccount', grantAccess(['user']),createAccount);
router.get('/setPrimaryAccount', grantAccess(['user']),createAccount);
router.get('/generateApiKey', grantAccess(['user']),generateApiKey);
router.get('/bussinessRequest', grantAccess(['user']),sendBussinessRequest);
module.exports = router;
