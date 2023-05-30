const Items=require("../models/item.model")
const LoanConfiguration=require("../models/LoanConfig.models")
exports.createNewLoanConfiguration=async(req,res)=>{
    const {interest_rate,duration, merchant_id}=req.body;
    try {
    const loanConf = LoanConfiguration.create({interest_rate,duration,merchant_id})
    res.status(201).json({message:"Success"});   
    } catch (error) {
       console.log('ERROR',error)
    }
}
exports.getLoanConfiguration=async(req,res)=>{
try {
   const loanConf=await LoanConfiguration.findAll({});
   console.log(loanConf)
   res.status(200).json(loanConf) 
} catch (error) {console.log("error",error)    
}
}
