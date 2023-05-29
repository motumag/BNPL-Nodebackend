// const BankAccount = require("../models/BankAccount")
const Merchant = require("../models/merchant.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const {getAllUser,getUserById}=require("../dal/user")

exports.registerMerchant = async (req, res) => {
      try {
        const { username, password } = req.body;
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^\d{10}$/;
        const isEmail = emailRegex.test(username);
        const isPhone = phoneRegex.test(username);
        // Check if the email is already registered for a manager
        if (isEmail) {
          const existingUser = await Merchant.findOne({ where: { email_address } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already registered for a merchant' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);   
        // Create the manager
        const merchant = await Merchant.create({ email_address:email_address, password: hashedPassword});
         const jsontoken = jwt.sign({ id: merchant.merchant_id, email_address:merchant.email_address, role:merchant.role}, process.env.JWT_SECRET, {
          expiresIn: "24hr",
        });
        req.session.jwt = jsontoken
        res.status(201).json({ jsontoken });
          
        }else if(isPhone){
          const existingmerchant = await Merchant.findOne({ where: { phone_number:username } });
          if (existingmerchant) {
            return res.status(400).json({ message: 'Phone already registered for a user' });
          }
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);   
          // Create the manager
          const merchant = await Merchant.create({ phone_number:username, password: hashedPassword});
          console.log("Merchant",merchant)
           const jsontoken = jwt.sign({ id: merchant.merchant_id, phone_number:merchant.phone_number, role:merchant.role}, process.env.JWT_SECRET, {
            expiresIn: "24hr",
          });
          req.session.jwt = jsontoken
          res.status(201).json({ jsontoken });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Merchant registration failed' });
      }
    };
  

exports.loginMerchant=async (req, res)=>{
    const {username, password}=req.body
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(username);
    const isPhone = phoneRegex.test(username);

    if (isEmail) {
      const merchant = await Merchant.findOne({where:{
        email_address:username
      }})
      const passwordMatch = bcrypt.compare(password,merchant.password)
    if (passwordMatch) {
      const token = jwt.sign({merchant_id:merchant.merchant_id, email_address:merchant.email_address, role:merchant.role},process.env.JWT_SECRET,{expiresIn:"24h"})
      req.session.jwt=token
      res.status(200).send({token:token})
    }else{
      res.status(401).send({message:"Invalid Credentials"})
    }
    }else if(isPhone){
      const merchant = await Merchant.findOne({where:{
        phone_number:username
      }})
      console.log(merchant)
      const passwordMatch = bcrypt.compare(password,merchant.password)
    if (passwordMatch) {
      const token = jwt.sign({merchant_id:merchant.user_id, phone_number:merchant.phone_number, role:merchant.role},process.env.JWT_SECRET,{expiresIn:"24h"})
      req.session.jwt=token
      res.status(200).send({token:token})
    }else{
      res.status(401).send({message:"Invalid Credentials"})
    }
    }else{
      res.status(422).json({"message":"Validation Error"})
    }
    
  }
exports.getAllUser= async (req, res, next)=>{
  try {
    const result = await getAllUser()
    console.log(result)
    res.status(200).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
}
exports.getUserById= async (request,response)=>{
  // Inside an async function or a route handler
 
  const userId = request.params.id;
   // Replace with the actual ID you want to find
  try {
    const user = await getUserById(userId);
    if (user) {
      response.status(200).send(user)
    }else{
      response.status(400).json("User Not Found")
    }
  } catch (error) {
    console.error(error)
    response.status(500).send("Internal Server Error")
  }

}
exports.createAccount=(req,res,next)=>{
  const {accountNumber}=req.body
  const {user_id}=req.user_id
  res.status(200).send("Create Your Bank Account")
}
exports.setPrimaryAccount=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.generateApiKey=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.sendBussinessRequest=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getPrimaryAccount=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getAllAccount=async(req,res,next)=>{
  try {
    const userId = req.params.id; // Replace with the actual ID you want to find
    const user = await User.findByPk(userId, {include:'bankAccounts'});
    if (user) {
      res.status(200).send({accounts:user.bankAccounts})
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
  }
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getAllKey=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getManager=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getAgent=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.createNedajStation=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}
exports.getNedajStation=(req,res,next)=>{
  res.status(200).send("Set Your Bank Account Primary")
}

