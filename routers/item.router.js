const express = require('express');
const multer =require("multer")
const router = express.Router();
const {grantAccess} = require('../middlewares/userVerification');
// const {registerMerchant,loginMerchant,registerSales,loginSales,activateAccount}=require("../controllers/merchant")
const upload=multer({dest:'uploads/'})
// Import your controllers
const {
    createNewItem
} = require('../controllers/item.controller');
// User routes

router.post('/create', grantAccess, upload.single('picture'), createNewItem);

module.exports = router;
