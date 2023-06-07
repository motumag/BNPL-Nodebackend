const LoanProcess = require("../models/loanProcess.model");
const CustomerInfo = require("../models/customer_eKyc.model");
const Sales = require("../usermanagement/models/sales.model");
const ItemsLoan=require("../models/itemsLoan.model");
const Items = require("../models/item.model");
const LoanConf=require("../models/LoanConfig.models");
const CustLoanReq = require("../models/customerLoan.models");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const { extractedPhoneFromToken } = require("../middlewares/extractTokenSales");
const LoanAgreement=require("../middlewares/generateLoanAgreement")
exports.OrderLoanProcess = async (req, res) => {
  try {
    const {
      national_id_number,
      loan_amount,
      loan_purpose,
      repayment_term,
      interest_rate,
      cumulative_interest,
      total_repayment,
      item_loan_id
    } = req.body;
    //decode the token and extract phoneNumber
    const tokenWithPrefix = req.headers.authorization;
    const result = extractedPhoneFromToken(tokenWithPrefix);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(result);
    const isPhone = phoneRegex.test(result);
    //Query here using phoneNumber and get the salesID
    var getsalesId="";
    if (isPhone) {
      getsalesId = await Sales.findOne({
        where: { phone_number: result },
      });
    }else{
      getsalesId = await Sales.findOne({
        where: { email_address: result },
      });
    }    
    const salesId = getsalesId.sales_id;
    const customerByNationalId = await CustomerInfo.findOne({
      where: { national_id_number: national_id_number },
      include: {
        model: LoanProcess,
        attributes: [
          "national_id_number",
          "loan_amount",
          "repayment_term",
          "interest_rate",
          "cumulative_interest",
          "total_repayment",
          "loan_status",
          "createdAt",
        ],
      },
    });

    //if it is empty
    if (customerByNationalId) {
      const loanProcesses = customerByNationalId.loan_processes || [];
      const customer_id = customerByNationalId.customer_id;
      const loanStatuses = loanProcesses.map((loan) => loan.loan_status);

      console.log("Loan Statuses:", loanStatuses);

      const hasNoneStatus = loanStatuses.includes("None");
      const hasUnderpaymentStatus = loanStatuses.includes("Underpayment");
      const hasCompletedStatus = loanStatuses.includes("Completed");

      if (hasNoneStatus) {
        console.log('There are loans with status "None".');
        return res.status(400).json({
          message: "Your status is None, wait until you get approved",
        });
      }
      if (hasUnderpaymentStatus) {
        console.log('There are loans with status "Underpaymnet".');
        return res.status(400).json({
          message: "Your status is Underpaymnet, Complete first your loan",
        });
      }
      if (hasCompletedStatus) {
        console.log('There are loans with status "Completed".');
        const items=await Items.findByPk(items_loan.item_id)
      const items_loan = await ItemsLoan.findOne({where:{id:item_loan_id}, 
        model: Items,
        as: 'items',
        include:[{model:LoanConf ,as:"loanConfs", through:{attributes:[]}}]});
        const orderLoan = await LoanProcess.create({
          sales_id: salesId,
          customer_id,
          national_id_number,
          loan_amount,
          loan_purpose,
          repayment_term,
          interest_rate,
          cumulative_interest,
          total_repayment,

        });
        

        await orderLoan.setItems(items_loan.item_id);
        return res.status(201).json({
          message: "Loan Payment request has succesfully created",
          orderLoan,
        });
      }
      // if (!hasNoneStatus && !hasCompletedStatus && !hasUnderpaymentStatus) {
      const items=await Items.findByPk(item_loan_id)
      const items_loan = await ItemsLoan.findOne({where:{id:item_loan_id}, 
        model: Items,
        as: 'items',
        include:[{model:LoanConf ,as:"loanConfs", through:{attributes:[]}}]});
       console.log("Got an Item",items_loan)
      const interest=items_loan.loanConfs[0].interest_rate;
      console.log(interest)
      const loan_amount=parseFloat(items.item_price)*parseFloat(interest/100)
      console.log(loan_amount)
      const duration =items_loan.loanConfs[0].duration;
      const totalAmountWithLoans = items_loan.totalAmountWithInterest
      const cumulative_interest=parseFloat(totalAmountWithLoans)-(parseFloat(items.item_price)*parseFloat(interest/100))
      const orderLoan = await LoanProcess.create({
        sales_id: salesId,
        customer_id,
        national_id_number,
        loan_amount:loan_amount,
        loan_purpose,
        repayment_term:duration,
        interest_rate:interest,
        cumulative_interest:cumulative_interest,
        total_repayment:totalAmountWithLoans,
      });
      await orderLoan.setItems(items_loan.item_id);

      return res.status(201).json({
        message: "Loan Order is created for the first time",
        orderLoan,
      });
    }
    // }
    else {
      return res.status(404).json({
        message: "No customer is found with this NationalId",
      });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
};
exports.getLoanProcess = async (req, res) => {
  try {
    const { national_id_number } = req.query;
    const customerDetail = await CustomerInfo.findOne({
      where: { national_id_number: national_id_number },
    });

    if (!customerDetail) {
      res.status(404).json({
        message:
          "No user found with " + national_id_number + "National ID number",
      });
    } else {
      const loanProcesses = await LoanProcess.findAll({
        where: { customer_id: customerDetail.customer_id },
        include: {
          model: CustomerInfo,
          attributes: [
            "first_name",
            "last_name",
            "phone_number",
            "national_id_doc",
            "national_id_number",
            "passport",
            "driving_license",
          ],
        },
      });

      if (loanProcesses.length > 0) {
        loanProcesses.forEach((loan) => {
          const customerDetails = loan.customer_ekyc;
          console.log("Loan Process:", loan);
          console.log("Customer Details:", customerDetails);
          console.log("------------------------");
        });
        res.status(200).json({ loanProcesses });
      } else {
        res
          .status(404)
          .json({ message: "No loan processes found forr.", loanProcesses });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsLoan = async function(req,res){
  try{
    const {id} = req.query;
    const items_loan = await ItemsLoan.findOne({where:{id:id}, 
      model: Items,
      as: 'items',
      include:[{model:LoanConf ,as:"loanConfs", through:{attributes:[]}}]}, {model:Items, as:"items"});
    if(items_loan){
      res.status(200).json({items_loan});
    }else{
      res.status(404).json({message:"Item not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({error:error.message});
  }
}
exports.createLoanRequest = async (req,res, next)=>{
  const {sales_id,item_id, national_id, first_name, middle_name , last_name, phone_number, interest_rate, duration, amount,totalAmountWithInterst}=req.body
  try {
      const sales = await Sales.findByPk(sales_id);
      const items = await Items.findByPk(item_id);
      var profile_picture=""
      if(req.file){
        const { filename, path: filePath } = req.file;
        const cleaned_file_path = filePath.replace(
            "uploads\\",
            ""
          );
        profile_picture=IMAGE_UPLOAD_BASE_URL+cleaned_file_path
    }
      const customer_loan_request=await CustLoanReq.create({national_id, first_name, last_name, middle_name, phone_number, interest_rate, duration,sales_id:sales.sales_id, item_id:items.item_id,customer_image:profile_picture, amount,totalAmountWithInterest:totalAmountWithInterst});
      
      return res.status(201).json({message:"Success", data:customer_loan_request})
  } catch (error) {
      console.error(error)
      res.status(500).json({message:"Internal Server Error"})
  }
}
exports.getLoanRequestBySalesId = async (req,res)=>{
  try{
    const {sales_id} = req.query;
    const customer_loan_request = await CustLoanReq.findAll({
      where:{sales_id:sales_id},
      include:[{model:Items}],
    });
    if(customer_loan_request){
      return res.status(200).json({customer_loan_request});
    }else{
      return res.status(404).json({message:"No loan request found"});
    }
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error.message});
  }
}

exports.generateLoanAgreement = async (req,res, next)=>{
  const {sales_id,item_id, first_name, last_name, interest_rate, duration, amount,loan_req_id}=req.body;
  try {
     const file_path= await LoanAgreement.generatePdf(req.body)
      console.log(file_path)
      if (file_path) {
          console.log(file_path)
          const loan_request=await CustLoanReq.findOne({where:{loan_req_id:loan_req_id}})
          if (loan_request) {
            const removedFilePath = file_path.replace('C:\\Users\\amhire\\Documents\\NodeProject\\BNPL-Nodebackend\\BNPL-Nodebackend\\uploads\\', '');

            loan_request.agreement_doc=IMAGE_UPLOAD_BASE_URL+removedFilePath;
            await loan_request.save()
            return res.status(200).json({message:"Success", data:loan_request.agreement_doc})
          }else{
            return res.status(404).json({message:"No loan request found"})
          }
        
      }else{
          return res.status(500).json({message:"Failed"})
      }
  } catch (error) {
  console.error(error)
  return res.status(500).json({message:"Internal Server Error"})
  }
}
