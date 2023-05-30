const { where } = require("sequelize");
const Items=require("../models/item.model")
const Sales = require("../usermanagement/models/sales.model")
const Merchant = require("../usermanagement/models/merchant.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../utils/utils")
exports.getAllSales=async(req,res)=>{
    
    try {
    const {id}=req.query;
    const sales=await Sales.findAll({where:{
        merchant_id:id
    },attributes: ['sales_id','email_address', 'emailStatus','phone_number']});
    res.status(200).json(sales) 
    } catch (error) {
    res.status(500).json({message:"Internal Server Error"})   
    }
}
exports.getSalesById=async(req,res)=>{
    try {
        const {sales_id,merchant_id}=req.query;

        const sales=await Sales.findOne({where:{
            sales_id:sales_id,
            merchant_id:merchant_id
        },attributes: ['sales_id','email_address', 'emailStatus','phone_number']});
        if(!sales){
            res.status(404).json({"message":"Their is no item with these Id"})
        }else{
            res.status(200).json(sales)
        }
    } catch (error) {
    res.status(500).json({message:"Internal Server Error"}) 
    }

}
exports.loginSales=async (req, res)=>{
    const {username, password}=req.body
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    try {
      if (isEmail) {
        const sales = await Sales.findOne({where:{
          email_address:username
        }})
        if (sales) {
          if (sales.emailStatus=="Pending") {
            res.status(403).json({message:"In active Account"})
          }else if(sales.emailStatus=="Inactive"){
            res.status(403).json({message:"Account Is InActive"})
          }else{
            const passwordMatch = bcrypt.compare(password,sales.password)
            if (passwordMatch) {
              const token = jwt.sign({sales_id:sales.sales_id, email_address:sales.email_address, role:sales.role},process.env.JWT_SECRET,{expiresIn:"24h"})
              req.session.jwt=token
              res.status(200).send({token:token})
            }else{
              res.status(401).send({message:"Invalid Credentials"})
            }
          }
          
        }else{
          res.status(400).send({message:"Invalid Credentials"})
        }
       
      }else if(isPhone){
        const sales = await Sales.findOne({where:{
          phone_number:username
        }})
        console.log(sales)
        if (sales){
          if (sales.emailStatus=="Pending") {
            res.status(403).json({message:"In active Account"})
          }else if(sales.emailStatus=="Inactive"){
            res.status(403).json({message:"Account Is InActive"})
          }else{
            const passwordMatch = bcrypt.compare(password,sales.password)
            if (passwordMatch) {
              const token = jwt.sign({sales_id:sales.user_id, phone_number:sales.phone_number, role:sales.role},process.env.JWT_SECRET,{expiresIn:"24h"})
              req.session.jwt=token
              res.status(200).send({token:token})
            }else{
              res.status(401).send({message:"Invalid Credentials"})
            }
          }
          
        }else{
          res.status(401).send({message:"Invalid Credentials"})
        }
       
      }else{
        res.status(422).send({message:"Validation Error"})
      }
    } catch (error) {
      console.error(error)
    }
    
  }
exports.registerSales= async (req, res, next)=>{
  try {
    const { username, merchant_id } = req.body;
    console.log(req.body)
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);
    // Check if the email is already registered for a manager
    if (isEmail) {
      const existingMerchant = await Merchant.findByPk(merchant_id);
    if (!existingMerchant) {
      return res.status(400).json({ message: 'Merchant With This Id Is Not Found' });
    }
    const sales = await Sales.findOne({where:{email_address:username}});
    if (sales) {
      res.status(409).json({message:"Sales Already exist"})
    }else{
    // Generate Random Password 
    const password= utils.generateRandomPassword()
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);   
    // Create the manager
    const registeredSales=await Sales.create({ email_address:username, password: hashedPassword, merchant_id:existingMerchant.merchant_id});
    utils.sendEmail(registeredSales.sales_id,registeredSales.email_address)
    res.status(201).json({ "status":"success",password });
    }
    }else if(isPhone){
      const existingmerchant = await Merchant.findByPk(merchant_id);
      if (!existingmerchant) {
        return res.status(400).json({ message: 'Merchant Not Found' });
      }
      const sales = await Sales.findOne({where:{phone_number:username}});
    if (sales) {
      res.status(409).json({message:"Sales Already exist"})
    }else{
    // Generate Random Password 
    const password= utils.generateRandomPassword()
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);   
    // Create the manager
    const registeredSales=await Sales.create({ phone_number:username, password: hashedPassword, merchant_id:existingmerchant.merchant_id});
    utils.sendMessage(registeredSales.sales_id, registeredSales.phone_number)
    res.status(201).json({ "status":"success",password });
    }
    }else{
        res.status(500).json({message:"Validation Error"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Merchant registration failed' });
  }
}