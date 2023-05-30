const Items=require("../models/item.model")
exports.createNewItem=async(req,res)=>{
    const {item_name,item_code,item_price, item_type, merchant_id}=req.body;
    const { filename, path: filePath } = req.file;
    console.log(filename)
    try {
    const item = Items.create({item_code,item_name, item_price,merchant_id, item_pic:filename, item_type})
    res.status(201).json({ url: "http://localhost:5000/image/" + filename, message:"Created" });   
    } catch (error) {
       console.log('ERROR',error)
    }
}
exports.getAllItems=async(req,res)=>{
try {
   const items=await Items.findAll({});
   console.log(items)
   res.status(200).json(items) 
} catch (error) {console.log("error",error)    
}
}
exports.getItemsById=async(req,res)=>{
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