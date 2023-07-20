const LoanProcess = require("../models/loanProcess.model");
const CustomerInfo = require("../models/customer_eKyc.model");
const Sales = require("../usermanagement/models/sales.model");
const ItemsLoan = require("../models/itemsLoan.model");
const Items = require("../models/item.model");
const LoanConf = require("../models/LoanConfig.models");
const CustLoanReq = require("../models/customerLoan.models");
const IMAGE_UPLOAD_BASE_URL = process.env.IMAGE_UPLOAD_BASE_URL;
const { extractedPhoneFromToken } = require("../middlewares/extractTokenSales");
const http = require("http");
const LoanAgreement = require("../middlewares/generateLoanAgreement");
const Merchant = require("../usermanagement/models/merchant.model");
const MerchantEkyc = require("../models/eKyc.model");
const CustomError = require("../utils/ErrorHandler");
exports.OrderLoanProcess = async (req, res, next) => {
  try {
    const {
      national_id_number,
      loan_amount,
      loan_purpose,
      repayment_term,
      interest_rate,
      cumulative_interest,
      total_repayment,
      item_loan_id,
    } = req.body;
    //decode the token and extract phoneNumber
    const tokenWithPrefix = req.headers.authorization;
    const result = extractedPhoneFromToken(tokenWithPrefix);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const isEmail = emailRegex.test(result);
    const isPhone = phoneRegex.test(result);
    //Query here using phoneNumber and get the salesID
    var getsalesId = "";
    if (isPhone) {
      getsalesId = await Sales.findOne({
        where: { phone_number: result },
      });
    } else {
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
        throw new CustomError(
          "Your status is None, wait until you get approved",
          400
        );
      }
      if (hasUnderpaymentStatus) {
        console.log('There are loans with status "Underpaymnet".');
        throw new CustomError(
          "Your status is Underpaymnet, Complete first your loan",
          400
        );
      }
      if (hasCompletedStatus) {
        const items = await Items.findByPk(items_loan.item_id);
        const items_loan = await ItemsLoan.findOne({
          where: { id: item_loan_id },
          model: Items,
          as: "items",
          include: [
            { model: LoanConf, as: "loanConfs", through: { attributes: [] } },
          ],
        });
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
      const items = await Items.findByPk(item_loan_id);
      const items_loan = await ItemsLoan.findOne({
        where: { id: item_loan_id },
        model: Items,
        as: "items",
        include: [
          { model: LoanConf, as: "loanConfs", through: { attributes: [] } },
        ],
      });
      console.log("Got an Item", items_loan);
      const interest = items_loan.loanConfs[0].interest_rate;
      console.log(interest);
      const loan_amount =
        parseFloat(items.item_price) * parseFloat(interest / 100);
      console.log(loan_amount);
      const duration = items_loan.loanConfs[0].duration;
      const totalAmountWithLoans = items_loan.totalAmountWithInterest;
      const cumulative_interest =
        parseFloat(totalAmountWithLoans) -
        parseFloat(items.item_price) * parseFloat(interest / 100);
      const orderLoan = await LoanProcess.create({
        sales_id: salesId,
        customer_id,
        national_id_number,
        loan_amount: loan_amount,
        loan_purpose,
        repayment_term: duration,
        interest_rate: interest,
        cumulative_interest: cumulative_interest,
        total_repayment: totalAmountWithLoans,
      });
      await orderLoan.setItems(items_loan.item_id);

      return res.status(201).json({
        message: "Loan Order is created for the first time",
        orderLoan,
      });
    }
    // }
    else {
      throw new CustomError("Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.getLoanProcess = async (req, res, next) => {
  try {
    const { national_id_number } = req.query;
    const customerDetail = await CustomerInfo.findOne({
      where: { national_id_number: national_id_number },
    });

    if (!customerDetail) {
      throw new CustomError(
        "No user found with " + national_id_number + "National ID number",
        404
      );
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
        throw new CustomError("No loan processes found forr.", 404);
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.getItemsLoan = async function (req, res, next) {
  try {
    const { id } = req.query;
    const items_loan = await ItemsLoan.findOne(
      {
        where: { id: id },
        model: Items,
        as: "items",
        include: [
          { model: LoanConf, as: "loanConfs", through: { attributes: [] } },
        ],
      },
      { model: Items, as: "items" }
    );
    if (items_loan) {
      res.status(200).json({ items_loan });
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.createLoanRequest = async (req, res, next) => {
  try {
    const {
      sales_id,
      item_id,
      national_id,
      first_name,
      middle_name,
      last_name,
      phone_number,
      interest_rate,
      duration,
      amount,
      totalAmountWithInterst,
    } = req.body;
    const cumulative_interest = (
      parseFloat(totalAmountWithInterst) - parseFloat(amount)
    ).toString();
    const sales = await Sales.findByPk(sales_id);
    const items = await Items.findByPk(item_id);
    var profile_picture = "";
    if (req.file) {
      const { filename, path: filePath } = req.file;
      const cleaned_file_path = filePath.replace("uploads\\", "");
      profile_picture = IMAGE_UPLOAD_BASE_URL + filename;
    }
    const customer_loan_request = await CustLoanReq.create({
      national_id,
      first_name,
      last_name,
      middle_name,
      phone_number,
      interest_rate,
      duration,
      sales_id: sales.sales_id,
      item_id: items.item_id,
      customer_image: profile_picture,
      amount,
      totalAmountWithInterest: totalAmountWithInterst,
      cumulative_interest,
    });

    return res
      .status(201)
      .json({ message: "Success", data: customer_loan_request });
  } catch (error) {
    next(error);
  }
};
exports.getLoanRequestBySalesId = async (req, res, next) => {
  try {
    const { sales_id } = req.query;
    const customer_loan_request = await CustLoanReq.findAll({
      where: { sales_id: sales_id },
      include: [{ model: Items }],
    });
    if (customer_loan_request) {
      return res.status(200).json({ customer_loan_request });
    } else {
      throw new CustomError("not found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.generateLoanAgreement = async (req, res, next) => {
  const {
    sales_id,
    item_id,
    first_name,
    last_name,
    interest_rate,
    duration,
    amount,
    loan_req_id,
  } = req.body;
  try {
    const file_path = await LoanAgreement.generatePdf(req.body);
    console.log(file_path);
    if (file_path) {
      console.log(file_path);
      const loan_request = await CustLoanReq.findOne({
        where: { loan_req_id: loan_req_id },
      });
      if (loan_request) {
        const removedFilePath = file_path.replace(
          "C:\\Users\\amhire\\Documents\\NodeProject\\BNPL-Nodebackend\\BNPL-Nodebackend\\uploads\\",
          ""
        );

        loan_request.agreement_doc = IMAGE_UPLOAD_BASE_URL + removedFilePath;
        await loan_request.save();
        return res
          .status(200)
          .json({ message: "Success", data: loan_request.agreement_doc });
      } else {
        throw new CustomError("not found", 404);
      }
    } else {
      throw new CustomError("Failed", 500);
    }
  } catch (error) {
    console.error(error)
    next(error);
  }
};
exports.createSalesToAdminLoanRequest = async (req, res, next) => {
  try {
    const { sales_id, merchant_id, item_id, loan_purpose, loan_req_id } =
      req.body;

    const sendLoanRequest = (postData, signed_agreement_doc) => {
      console.log(signed_agreement_doc);
      return new Promise((resolve, reject) => {
        const options = {
          hostname: process.env.LOAN_SPRING_BACKEND_HOST,
          port: process.env.LOAN_SPRING_BACKEND_PORT, // or the appropriate port number
          path: process.env.LOAN_SPRING_BACKEND_PATH,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
        };

        const request = http.request(options, (response) => {
          let data = "";
          response.on("data", (chunk) => {
            data += chunk;
          });
          response.on("end", async () => {
            console.log(response.statusCode);
            if (response.statusCode === 201) {
              const loanRequestStatus = await CustLoanReq.findByPk(loan_req_id);
              if (loanRequestStatus.status === "Available") {
                loanRequestStatus.status = "Pending";
                loanRequestStatus.signed_agreement_doc = signed_agreement_doc;
                await loanRequestStatus.save();
              }
              resolve({ statusCode: response.statusCode, message: "Success" });
            } else {
              reject({ statusCode: response.statusCode, message: "Error" });
            }
          });
        });

        request.on("error", (error) => {
          console.error("Error", error);
          res.status(400).json({ message: "Bad Request" });
        });
        console.log(postData);
        request.write(postData);
        request.end();
      });
    };

    // const sales= await Sales.findOne({where:{sales_id:sales_id}, include:{model:Merchant}})
    if (!req.file) {
      return res.status(400).json({ message: "Bad Request" });
    } else {
      const { filename, path: filePath } = req.file;

      const cleaned_file_path = filePath.replace("uploads\\", "");
      const signed_agreement_doc =
        IMAGE_UPLOAD_BASE_URL + "signedAgreementDoc/" + cleaned_file_path;
      console.log(signed_agreement_doc);
      const customer_loan_req = await CustLoanReq.findByPk(loan_req_id);
      const merchantEkyc = await MerchantEkyc.findOne({
        where: { merchant_id: merchant_id },
      });
      const loan_request_payload = {
        sales_id: sales_id,
        merchant_id: merchant_id,
        item_id: customer_loan_req.item_id.toString(),
        loan_amount: customer_loan_req.amount,
        loan_purpose,
        loan_req_id,
        repayment_term: customer_loan_req.duration,
        interest_rate: customer_loan_req.interest_rate,
        merchant_valid_identification: merchantEkyc.valid_identification,
        merchant_bussiness_license: merchantEkyc.business_licnense,
        merchant_agreement_doc: merchantEkyc.agreement_doc,
        merchant_business_license: merchantEkyc.business_licnense,
        customer_national_id: customer_loan_req.national_id,
        customer_full_name:
          customer_loan_req.first_name +
          " " +
          customer_loan_req.middle_name +
          " " +
          customer_loan_req.last_name,
        phone_number: customer_loan_req.phone_number,
        customer_image: customer_loan_req.customer_image,
        customer_agreement_doc: signed_agreement_doc,
      };
      console.log(loan_request_payload);
      const postData = JSON.stringify(loan_request_payload);
      const loanResponse = await sendLoanRequest(
        postData,
        signed_agreement_doc
      );
      res
        .status(loanResponse.statusCode)
        .json({ message: loanResponse.message });
    }
  } catch (error) {
    next(error);
  }
};
