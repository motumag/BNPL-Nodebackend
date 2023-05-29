// const BankAccount = require("../models/BankAccount")
const User = require("../models/user")
// const {getAllUser,getUserById}=require("../dal/user")

exports.registerUser = async (req, res) => {
    console.log(req.body)
      try {
        const { email_address, phone_number, password } = req.body;
        // Check if the email is already registered for a manager
        const existingUser = await User.findOne({ where: { email_address } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already registered for a user' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);   
        // Create the manager
        const user = await User.create({ email_address, phone_number, password: hashedPassword, role:"user"});
         const jsontoken = jwt.sign({ id: user.user_id, email_address:user.email_address, role:user.role}, process.env.JWT_SECRET, {
          expiresIn: "24hr",
        });
        req.session.jwt = jsontoken
        res.status(201).json({ jsontoken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'User registration failed' });
      }
    };
  

exports.loginUser=async (req, res)=>{
    const {phone_number, password}=req.body
    const user = await User.findOne({where:{
      phone_number:phone_number
    }})
    const passwordMatch = bcrypt.compare(password,user.password)
    if (passwordMatch) {
      const token = jwt.sign({user_id:user.user_id, email_address:user.email_address, client_id:user.client_id, role:user.role},process.env.JWT_SECRET,{expiresIn:"24h"})
      res.status(200).send({token:token})
    }else{
      res.status(401).send({message:"Invalid Credentials"})
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

