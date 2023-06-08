const express = require("express");
const cookieSession = require("cookie-session");
const { json } = require("body-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./configs/db");
const merchantManagementRouter = require("./usermanagement/router/merchant");
const itemRouter = require("./routers/item.router");
const eKycRouter = require("./routers/eKyc.router");
const loanRouter = require("./routers/loan.router");
const salesRouter = require("./routers/sales.router");
const pdfRoutes = require("./routers/pdfRoutes");
const loanProcessRouter = require("./routers/loan_process.router");
const customeEkycRouter = require("./routers/customerEkyc.router");
const app = express();
app.use(json());
app.use(bodyParser.json());
// app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(cors("*"));
app.use("/image", express.static("uploads"));
app.use("/api/merchant", merchantManagementRouter);
app.use("/api/items", itemRouter);
app.use("/api/eky", eKycRouter);
app.use("/api/loan", loanRouter);
app.use("/api/sales", salesRouter);
app.use("/api/agreement", pdfRoutes);
app.use("/api/customer-ekyc", customeEkycRouter);
app.use("/api/loanprocess", loanProcessRouter);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.info(`Running On Port 5000`);
});
