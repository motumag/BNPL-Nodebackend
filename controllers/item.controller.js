const Items=require("../models/item.model")
exports.createNewItem=async(req,res)=>{
    const {item_name,item_code,item_price}=req.body;
    try {
    const item = Items.create({item_code,item_name, item_price})
    res.status(200).json({"success":"Item created successfully",
item})    
    } catch (error) {
       console.log('ERROR',error) 
    }
}
exports.getAllItems=async(req,res)=>{
try {
   const allItems=Items.findAll();
   res.status(200).json({
    count : allItems.length,
    allItems
   }) 
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