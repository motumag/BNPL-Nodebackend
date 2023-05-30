const Items=require("../models/item.model")
const Sales = require("../usermanagement/models/sales.model")
exports.getAllSales=async(req,res)=>{
    
try {
const {id}=req.params.id;
   const sales=await Sales.findAll({where:{
    merchant_id:id
   }});
   res.status(200).json(sales) 
} catch (error) {console.log("error",error)    
}
}
exports.getSalesById=async(req,res)=>{
try {
    const {id}=req.params.id;
    const items=await Items.findById(id);
    if(!items){
        res.status(404).json({"message":"Their is no item with these Id"})
    }else{
        res.status(200).json(items)
    }
} catch (error) {
    
}
}