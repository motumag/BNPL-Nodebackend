const LoanConfiguration=require("../models/LoanConfig.models")
const Merchant = require("../usermanagement/models/merchant.model")
const axios = require("axios")
exports.createNewLoanConfiguration=async(req,res)=>{
    try {
    const {interest_rate,duration, merchant_id}=req.body;
    const loanConf = LoanConfiguration.create({interest_rate,duration,merchant_id})
    res.status(201).json({message:"Success"});   
    } catch (error) {
       console.log('ERROR',error)
       res.status(500).json({message:"Inter"})
    }
}
exports.getLoanConfiguration=async(req,res)=>{
try {
    const {id}=req.query; 
   const merchant=await Merchant.findByPk(id,{include:LoanConfiguration})
  if (merchant) {
   const loans = merchant.loanconfs;
   res.status(200).json(loans) 
  }else{
   res.status(400).json({message:"Not Found"})
  }
   
} catch (error) {
    res.status(500).send(error)   
}
}
exports.createNewLoan=async(req,res)=>{
try {
    const {id}=req.query; 
   const merchant=await Merchant.findByPk(id,{include:LoanConfiguration})
  if (merchant) {
   const loans = merchant.loanconfs;
   res.status(200).json(loans) 
  }else{
   res.status(400).json({message:"Not Found"})
  }
   
} catch (error) {
    res.status(500).send(error)   
}
}
exports.getAllLoan=async(req,res)=>{
try {
    const {id}=req.query; 
   const merchant=await Merchant.findByPk(id,{include:LoanConfiguration})
  if (merchant) {
   const loans = merchant.loanconfs;
   res.status(200).json(loans) 
  }else{
   res.status(400).json({message:"Not Found"})
  }
   
} catch (error) {
    res.status(500).send(error)   
}
}

exports.editLoanConfiguration = async (req,res, next)=>{
    try{
        const {merchant_id,loan_conf_id, duration,interest_rate}=req.body;
        const loanConfiguration = await LoanConfiguration.findOne({where:{merchant_id:merchant_id,loan_conf_id:loan_conf_id}})
        console.log(loanConfiguration)
        if(!loanConfiguration){        
            res.status(400).json({message:"Not Found"})
        }else{
            loanConfiguration.duration=duration;
            loanConfiguration.interest_rate=interest_rate;
            loanConfiguration.save();
            res.status(200).json({loanConfiguration})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
exports.getLoanRequest = async (req,res, next)=>{
    const {merchant_id}=req.query;
    try{
        axios.get(process.env.LOAN_ADMIN_ENDPOINT).then((response)=>{
            res.status(200).json(response.data)
        })
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}