const express = require("express");
const cookieSession = require("cookie-session");
const { json } = require("body-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const debug = require("debug")("app:server");
const db = require("./configs/db");
const merchantManagementRouter = require("./usermanagement/router/merchant");
const itemRouter = require("./routers/item.router");
const eKycRouter = require("./routers/eKyc.router");
const loanRouter = require("./routers/loan.router");
const salesRouter = require("./routers/sales.router");
const pdfRoutes = require("./routers/pdfRoutes");
const loanProcessRouter = require("./routers/loan_process.router");
const customeEkycRouter = require("./routers/customerEkyc.router");
const apiKeyRouter = require("./routers/apikey.router");
const serviceRouter = require("./routers/service.router");
const userRouter = require("./routers/user.router");
const paymentRouter = require("./routers/payment.router");
const transactionRouter = require("./routers/transaction.router");
const logger = require("./configs/logger");

const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger");
app.use(helmet());
app.disable("x-powered-by");
app.use(json());
app.use(compression());
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
app.use("/api/apiKey", apiKeyRouter);
app.use("/api/services", serviceRouter);
app.use("/api/user", userRouter);
app.use("/api", paymentRouter);
app.use("/api/transaction", transactionRouter);

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that Api!");
});

app.use(function (err, req, res, next) {
  // Handle Your Error Here
  // set Status Code
  res.status(err.statusCode || 500);
  //send a Json Response with the error message
  res.json({ error: err.message });
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  debug(`listening on ${PORT}`);
  logger.info(`listening on ${PORT}`);
  console.info(`Running On Port 5000`);
});

module.exports = app;
