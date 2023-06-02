const LoanProcess = require("../models/loanProcess.model");
const CustomerInfo = require("../models/customer_eKyc.model");
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
    } = req.body;
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
    console.log("Fetched is:", customerByNationalId);
    //if it is empty
    if (customerByNationalId) {
      const loanProcesses = customerByNationalId.loan_processes || [];
      const customer_id = customerByNationalId.customer_id;
      // const findDetailInloan = await LoanProcess.findAll({
      //   where: { customer_id: customer_id },
      // });
      // console.log("Detail of customer in loan id", findDetailInloan);
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
        const orderLoan = await LoanProcess.create({
          customer_id,
          national_id_number,
          loan_amount,
          loan_purpose,
          repayment_term,
          interest_rate,
          cumulative_interest,
          total_repayment,
        });
        return res.status(201).json({
          message: "Loan Payment request has succesfully created",
          orderLoan,
        });
      }

      if (!hasNoneStatus && !hasCompletedStatus && !hasUnderpaymentStatus) {
        console.log("Created for the first time.");
        const orderLoan = await LoanProcess.create({
          customer_id,
          national_id_number,
          loan_amount,
          loan_purpose,
          repayment_term,
          interest_rate,
          cumulative_interest,
          total_repayment,
        });
        return res.status(201).json({
          message: "Loan Order is created for the first time",
          orderLoan,
        });
      }
    } else {
      return res.status(404).json({
        message: "No customer is found with this NationalId",
      });
    }
  } catch (error) {
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
      console.log("national id no", customerDetail.customer_id);
      const loanProcesses = await LoanProcess.findAll({
        where: { customer_id: customerDetail.customer_id },
        include: {
          model: CustomerInfo,
          attributes: ["first_name", "email", "phone_number"],
        },
      });

      if (loanProcesses.length > 0) {
        loanProcesses.forEach((loan) => {
          const customerDetails = loan.customer_ekyc;
          console.log("Loan Process:", loan);
          console.log("Customer Details:", customerDetails);
          console.log("------------------------");
        });
        res
          .status(201)
          .json({ message: "Loan Order Created successfully", loanProcesses });
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
