const Items=require("../models/item.model")
const LoanConfig=require("../models/LoanConfig.models")
const ItemsLoan=require("../models/itemsLoan.model")
exports.createNewItem=async(req,res)=>{  
    try {
    const {item_name,item_code,item_price, item_type, merchant_id,loan_limit}=req.body;
    const { filename, path: filePath } = req.file;
    console.log(req.body, req.file)
    const item = await Items.create({item_code,item_name, item_price,merchant_id, item_pic:filename, item_type,loan_limit:loan_limit})
    res.status(201).json({ url: "http://localhost:5000/image/" + filename, message:"Created" });   
    } catch (error) {
       res.status(500).json({message:"Internal Server Error"})
    }
}
exports.editItemById=async(req,res)=>{  
    try {
        const {item_name,item_code,item_price, item_type, merchant_id,loan_limit,item_id}=req.body;
        const { filename, path: filePath } = req.file;
        const item = await Items.findOne({where: {item_id:item_id},include:{model:LoanConfig, as:"loanConfs"}})
        console.log(item);
        // const loanItems = await ItemsLoan.findAll({ where: { item_id: item.item_id }, include:{model:LoanConfig, as:"loanConfs"}});
        if (item) {
            item.item_type=item_type;
            item.item_name=item_name;
            item.item_price=item_price;
            item.merchant_id=merchant_id;
            item.item_pic=filename;
            item.loan_limit=loan_limit;
            await item.save();
        for (const loanItem of item.loanConfs) {
            const principal = (parseInt(item.loan_limit)/100)*parseInt(item.item_price)
            const interestRate=parseFloat(loanItem.interest_rate)/100
            const loanDuration = parseInt(loanItem.duration)
            const interestAmount = principal*interestRate
            const totalAmount=principal+interestAmount
            loanItem.items_loan.totalAmountWithInterest = totalAmount; // Update the quantity based on the edited item
            await loanItem.save();
        }
            res.status(201).json({ item: item, message:"updated" });
        }else{
            res.status(400).json({message:"Item not found"})
        }
        } catch (error) {
            console.error(error);
         res.status(500).json({message:error})
        }
}
exports.getAllItems=async(req,res)=>{
try {
    const {id}=req.query;
   const items=await Items.findAll({
    where:{merchant_id:id}, include:{model:LoanConfig, as:"loanConfs", attributes:["interest_rate","duration"], through:{attributes:["totalAmountWithInterest"]}}}
   );
   console.log(items)
   res.status(200).json(items) 
} catch (error) {console.log("error",error)    
}
}
exports.getItemsById=async(req,res)=>{
try {
    const {merchant_id,item_id}=req.query;
    const items=await Items.findOne({where:{
        merchant_id:merchant_id,
        item_id:item_id
    }});
    if(!items){
        res.status(404).json({"message":"Their is no item with these Id"})
    }else{
        res.status(200).json(items)
    }
} catch (error) {
    
}
}
exports.assignItemsToSales=async(req,res)=>{
try {
    const {item_id,merchant_id,sales_id}=req.body;
    const items=await Items.findByPk(item_id, {where:{merchant_id:merchant_id,itemStatus:"Available"},include:{model:LoanConfig, as:"loanConfs"}});
    if(!items){
        res.status(404).json({"message":"Their is no item with these Id"})
    }else{
        items.sales_id=sales_id
        items.itemStatus="Pending"
        try {
            await items.save()
        } catch (error) {
            console.error(error)
        }
        
        res.status(200).json({status:"success"})
    }
} catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal Server Error"})
}
}
exports.assignItemsToSalesApprove=async(req,res)=>{
try {
    console.log(req.body)
    const {item_id,sales_id}=req.body;
    const items=await Items.findOne({where:{sales_id:sales_id, item_id:item_id,itemStatus:"Pending"}});
    if(!items){
        res.status(404).json({"message":"No Item Has Been Assigned To You"})
    }else{
        items.itemStatus="Accepted"
        items.save()
        res.status(200).json({status:"success"})
    }
} catch (error) {
    res.status(500).json({message:"Internal Server Error"})
}
}

exports.configureLoanForitem=async(req,res)=>{
const {item_id, loan_config_id}=req.body;
try {
   const item = await Items.findOne({where:{item_id:item_id}, include:{model:LoanConfig,as:"loanConfs"}})
   const loanConf=await LoanConfig.findOne({where:{loan_conf_id:loan_config_id}, include:{model:Items,as:"items"}})
   if (item && loanConf) {
    const principal = (parseInt(item.loan_limit)/100)*parseInt(item.item_price)
    const interestRate=parseFloat(loanConf.interest_rate)/100
    const loanDuration = parseInt(loanConf.duration)
    const interestAmount = principal*interestRate
    const totalAmount=principal+interestAmount
    await item.addLoanConfs(loanConf, {through:{totalAmountWithInterest:totalAmount}});
   res.status(200).json(item)
   }else{
    res.status(404).json({"message":"Item Not Found"})
   }
   
} catch (error) {
    console.error(error)
    res.status(500).json({message:"Internal Server Error"})
}
}