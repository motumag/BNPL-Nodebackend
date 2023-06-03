const Merchant = require('../usermanagement/models/merchant.model');
const Sales = require('../usermanagement/models/sales.model');

exports.isEmailExist=async function(email){
    const merchant = await Merchant.findOne({where:{email_address:email}})
    const sales = await Sales.findOne({where:{email_address:email}})
    if(merchant|| sales){
            return true
    }else{
        return false
    }

}
exports.isPhoneExist=async function(phone){
    const merchant = await Merchant.findOne({where:{phone_number:phone}})
    const sales = await Sales.findOne({where:{phone_number:phone}})
    if(merchant|| sales){
        return true
    }else{
        return false
    }

}