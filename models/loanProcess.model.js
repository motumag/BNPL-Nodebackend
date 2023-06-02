const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const ProcessLoan = sequelize.define("process_loan", {
  // Columns/attributes of the Loan Process table
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});
// module.exports = LoanProcess;
module.exports = ProcessLoan;
