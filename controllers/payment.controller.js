const short = require("short-uuid");
const http = require("http");
const https = require("https");

const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { error, log } = require("console");
const logger = require("../configs/logger");
const { level } = require("winston");
const axios = require("axios");
const utils = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_KEY);
// const Payment = db.payment;
const Payment = require("../models/payment.models");
const EbirrPayment = require("../models/ebirrPayment.models");
const PaypalPayment = require("../models/paypalPayment.models");
const chapaPayment = require("../models/chapaPayment.models");
const StripePayment = require("../models/stripePayment.models");
const PaymentSevice = require("../models/paymentServices.models");
const springCert = path.join(__dirname, "../", "Cooperative Bank.crt");
const certificate = fs.readFileSync(springCert, "utf8");
const serverCert = path.join(__dirname, "../", "server.cert");
const serverKey = path.join(__dirname, "../", "server.key");
const cert = fs.readFileSync(serverCert, "utf8");
const key = fs.readFileSync(serverKey, "utf8");
const CustomError = require("../utils/ErrorHandler");
exports.payment = async (req, res, next) => {
  const accountNumber = req.body.accountNumber;
  const paymentId = req.body.paymentId;
  const decryptedData = CryptoJS.AES.decrypt(
    paymentId,
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  console.log("decrypted Data", decryptedData);
  try {
    const paymentStatus = await Payment.findOne({
      where: {
        endPointIdentifier: decryptedData,
        status: "PENDING",
      },
    });
    console.log(paymentStatus);
    if (paymentStatus) {
      // const messageId =
      //   Date.now().toString(30) + Math.random().toString(30).substr(2);
      const messageId = paymentStatus.orderID;
      const clientId = paymentStatus.client_id;
      const debitAccount = req.body.accountNumber;
      const debitCurrency = paymentStatus.currency;
      const debitAmount = paymentStatus.amount;
      const creditAccount = paymentStatus.creditAccount;
      logger.log({
        level: "info",
        message: "Payment Process Request to the Spring Boot Backend",
        request: {
          messageId: messageId,
          clientId: clientId,
          debitAccount: debitAccount,
          debitCurrency: debitCurrency,
          debitAmount: debitAmount,
          creditAccount: creditAccount,
          paymentId: paymentId,
        },
      });

      const jsonData = JSON.stringify({
        messageId,
        clientId,
        debitAccount,
        debitAmount,
        creditAccount,
      });
      const url = process.env.PAYMENT_URLS + "create-payment";
      const token = await utils.getToken(
        process.env.EMAIL,
        process.env.PASSWORD_AUTH
      );

      // Create an instance of the HTTPS agent
      const httpsAgent = new https.Agent({
        cert: certificate,
        rejectUnauthorized: false,
        // Additional options if required (e.g., ca, passphrase, etc.)
      });
      const agent = new https.Agent({
        cert: cert,
        key: key,
      });
      // Configure Axios to use the HTTPS agent
      const axiosInstance = axios.create({
        httpsAgent: httpsAgent,
      });
      const options = {
        agent: agent,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosInstance
        .post(url, jsonData, config)
        .then((response) => {
          if (response.status == 201) {
            paymentStatus.status = "COMPLETED";
            paymentStatus.transactionId = response.data.transactionID;
            paymentStatus.save();
            logger.log({
              level: "info",
              message: "Payment Response",
              response: {
                parsedData,
              },
            });
            return res.status(201).send({
              status: "success",
              data: parsedData,
              returnUrl: paymentStatus.returnUrl,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json(error.message);
        });
    } else {
      return res
        .status(401)
        .send("You DO Not Have Pending Payment To Complete");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
exports.devicePayment = async (req, res, next) => {
  const messageId =
    Date.now().toString(30) + Math.random().toString(30).substr(2);
  const clientId = req.clientid;
  const debitAccount = req.body.debitAccount;
  const debitCurrency = "ETB";
  const debitAmount = req.body.debitAmount;
  const debitNarrative = "PAYMENTG";
  const creditNarrative = "PAYMENTG";
  const creditAccount = req.body.account_number;
  const data = {
    messageId,
    clientId,
    debitAccount,
    debitCurrency,
    debitAmount,
    debitNarrative,
    creditNarrative,
    creditAccount,
  };

  const jsonData = JSON.stringify({
    messageId,
    clientId,
    debitAccount,
    debitCurrency,
    debitAmount,
    debitNarrative,
    creditNarrative,
    creditAccount,
  });
  console.log(jsonData);
  const url = process.env.PAYMENT_URL;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  var parsedData = {};
  const request = http.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(data);
      parsedData = JSON.parse(data);
    });
    response.on("end", () => {
      return res.status(200).send({ parsedData, callBackUrl });
    });
  });
  request.write(jsonData);

  request.end();
};
exports.initiatePayment = async (req, res) => {
  const clientId = req.body.clientId;
  const secretKey = req.body.secrateKey;
  const apiKey = req.body.apiKey;
  const orderId = req.body.orderId;
  const currency = req.body.currency;
  const amount = req.body.amount;
  const returnUrl = req.body.returnUrl;
  const phoneNumber = req.body.phoneNumber;
  const callBackUrl = req.body.callBackUrl;
  const timestamp = new Date().getTime().toString();

  logger.log({
    level: "info",
    message: "Payment Initiated Request",
    request: {
      clientId,
      secretKey,
      apiKey,
      orderId,
      currency,
      amount,
    },
  });
  const encryptedData = CryptoJS.AES.encrypt(
    timestamp,
    process.env.ENCRYPTION_KEY
  ).toString();
  try {
    const payment = await Payment.findOne({
      where: {
        orderID: orderId,
      },
    });
    if (payment) {
      return res.status(409).json({ message: "Transaction Already Exists" });
    } else {
      const initiatePayment = await Payment.create({
        orderID: orderId,
        email: req.merchant.email_address,
        currency: currency,
        endPointIdentifier: timestamp,
        amount: amount,
        returnUrl: returnUrl,
        payeePhone: phoneNumber,
        callBackUrl: callBackUrl,
        creditAccount: req.merchant.bankAccount[0].account_number,
      });
      await initiatePayment.setMerchant(req.merchant);
      logger.log({
        level: "info",
        message: "payment initiated and Links to Actual Payment Processing",
        response: {
          link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
        },
      });
      return res.status(200).json({
        link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Unable to validate User Credentials!",
    });
  }
};
exports.initiateStripePayment = async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const secretKey = req.body.secrateKey;
    const apiKey = req.body.apiKey;
    const orderId = req.body.orderId;
    const currency = req.body.currency;
    const amount = req.body.amount;
    const returnUrl = req.body.returnUrl;
    const phoneNumber = req.body.phoneNumber;
    const callBackUrl = req.body.callBackUrl;
    const timestamp = new Date().getTime().toString();
    logger.log({
      level: "info",
      message: "Payment Initiated Request",
      request: {
        clientId,
        secretKey,
        apiKey,
        orderId,
        currency,
        amount,
      },
    });
    const encryptedData = CryptoJS.AES.encrypt(
      timestamp,
      process.env.ENCRYPTION_KEY
    ).toString();

    const stripePayment = await StripePayment.findOne({
      where: {
        orderID: orderId,
      },
    });
    if (stripePayment) {
      res.status(409).json({ message: "Transaction Already Exists" });
    } else {
      const initiateStripePayment = await StripePayment.create({
        orderID: orderId,
        email: req.merchant.email_address,
        currency: currency,
        endPointIdentifier: timestamp,
        amount: amount,
        returnUrl: returnUrl,
        payeePhone: phoneNumber,
        callBackUrl: callBackUrl,
        creditAccount: req.merchant.bankAccount[0].account_number,
      });
      await initiateStripePayment.setMerchant(req.merchant);
      logger.log({
        level: "info",
        message: "payment initiated and Links to Actual Payment Processing",
        response: {
          link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
        },
      });
      res.status(200).json({
        link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Unable to validate User Credentials!",
      error: error,
    });
  }
};
exports.initiatePaypalPayment = async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const secretKey = req.body.secrateKey;
    const apiKey = req.body.apiKey;
    const orderId = req.body.orderId;
    const currency = req.body.currency;
    const amount = req.body.amount;
    const returnUrl = req.body.returnUrl;
    const phoneNumber = req.body.phoneNumber;
    const callBackUrl = req.body.callBackUrl;
    const paymentService = req.body.paymentService;
    // replace this with your own data
    // const hash = crypto.createHash('md5').update(clientId).digest('hex');

    const timestamp = new Date().getTime().toString();

    logger.log({
      level: "info",
      message: "Payment Initiated Request",
      request: {
        clientId,
        secretKey,
        apiKey,
        orderId,
        currency,
        amount,
        paymentService,
      },
    });
    const encryptedData = CryptoJS.AES.encrypt(
      timestamp,
      process.env.ENCRYPTION_KEY
    ).toString();

    const payment = await PaypalPayment.findOne({
      where: {
        paypalOrderId: orderId,
      },
    });
    if (payment) {
      res.status(409).json({ message: "Transaction Already Exists" });
    } else {
      const payp = await PaypalPayment.create({
        paypalOrderId: orderId,
        currency: currency,
        endPointIdentifier: timestamp,
        amount: amount,
        returnUrl: returnUrl,
        payeePhone: phoneNumber,
        callBackUrl: callBackUrl,
        creditAccount: req.merchant.bankAccount[0].account_number,
        paymentService: req.body.paymentService,
      });
      await payp.setMerchant(req.merchant);
      logger.log({
        level: "info",
        message: "payment initiated and Links to Actual Payment Processing",
        response: {
          link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
        },
      });
      res.status(200).json({
        link: process.env.PAYMENT_CHEACKOUT_ENDPOINT + btoa(encryptedData),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Unable to validate User Credentials!",
    });
  }
};
exports.initiateChapaPayment = async (req, res) => {
  try {
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const tx_ref = req.body.tx_ref;
    const title = req.body.title;
    const amount = req.body.amount;
    const currency = req.body.currency;
    const description = req.body.description;
    const callBackUrl = req.body.callBackUrl;
    const returnUrl = req.body.returnUrl;
    const authToken = req.body.authToken;
    const token = await utils.getToken(
      process.env.EMAIL,
      process.env.PASSWORD_AUTH
    );
    const certificate = fs.readFileSync(springCert, "utf8");
    // Create an instance of the HTTPS agent
    const httpsAgent = new https.Agent({
      cert: certificate,
      rejectUnauthorized: false,
      // Additional options if required (e.g., ca, passphrase, etc.)
    });
    // Configure Axios to use the HTTPS agent
    const axiosInstance = axios.create({
      httpsAgent: httpsAgent,
    });
    const postData = {
      email,
      first_name,
      last_name,
      tx_ref,
      title,
      amount,
      currency,
      description,
      authToken,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    logger.log({
      level: "info",
      message: "Payment Initiated Request",
      request: {
        email,
        first_name,
        last_name,
        tx_ref,
        title,
        amount,
        currency,
        description,

        // paymentService,
      },
    });
    const chapa = await chapaPayment.findOne({
      where: {
        tx_ref: tx_ref,
      },
    });
    if (chapa) {
      res.status(409).json({ message: "Transaction Already Exists" });
    } else {
      const chapaPay = await chapaPayment.create({
        email: email,
        currency: currency,
        amount: amount,
        return_url: returnUrl,
        first_name: first_name,
        last_name: last_name,
        tx_ref: tx_ref,
        title: title,
        callback_url: callBackUrl,
      });
      await chapaPay.setMerchant(req.user);
      await chapaPay.save();
      await axiosInstance
        .post(
          process.env.PAYMENT_URLS + "chapa-pay",
          {
            email,
            authToken,
            first_name,
            last_name,
            tx_ref,
            title,
            amount,
            currency,
            description,
            return_url: returnUrl,
            // orderId,
          },
          config
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("response Data", response.data.data.checkout_url);
            chapaPay.cheackoutUrl = response.data.data.checkout_url;
            chapaPay.paymentStatus = "PENDING";
            chapaPay.save();
            return res.status(200).json(response.data);
          }
          return res.status(500).json({ message: "Error" });
        })
        .catch((error) => {
          console.error(error.message);
          return res.status(500).json(error.message);
        });
    }
  } catch (error) {
    console.error("Error: " + error);
    return res.status(500).send({
      message: error,
    });
  }
};
exports.getPendingPayment = async (req, res) => {
  try {
    // const paramsObj = querystring.parse(queryParams);
    const encryptedData = decodeURIComponent(req.query.data);
    console.log("encryptedData", encryptedData);
    // const decryptedData = CryptoJS.AES.decrypt(
    //   encryptedData,
    //   process.env.ENCRYPTION_KEY
    // ).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(
      atob(encryptedData),
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    console.log("decryptedData", decryptedData);

    const stripePaymentStatus = await StripePayment.findOne({
      where: {
        endPointIdentifier: decryptedData,
      },
    });
    const coopassPayment = await Payment.findOne({
      where: {
        endPointIdentifier: decryptedData,
      },
    });
    const paypalPaymentStatus = await PaypalPayment.findOne({
      where: {
        endPointIdentifier: decryptedData,
      },
    });

    if (stripePaymentStatus != null) {
      const paymentStatusResponse = {
        currency: stripePaymentStatus.currency,
        amount: stripePaymentStatus.amount,
        phoneNumber: stripePaymentStatus.payeePhone,
        returnUrl: stripePaymentStatus.returnUrl,
        paymentServices: stripePaymentStatus.paymentService,
      };
      return res.status(200).send(paymentStatusResponse);
    }
    if (coopassPayment != null) {
      const paymentStatusResponse = {
        currency: coopassPayment.currency,
        amount: coopassPayment.amount,
        phoneNumber: coopassPayment.payeePhone,
        returnUrl: coopassPayment.returnUrl,
        paymentServices: coopassPayment.paymentServices,
      };
      return res.status(200).send(paymentStatusResponse);
    }
    if (paypalPaymentStatus != null) {
      const paymentStatusResponse = {
        currency: paypalPaymentStatus.currency,
        amount: paypalPaymentStatus.amount,
        phoneNumber: paypalPaymentStatus.payeePhone,
        returnUrl: paypalPaymentStatus.returnUrl,
        status: paypalPaymentStatus.status,
        paymentServices: paypalPaymentStatus.paymentService,
      };
      return res.status(200).send(paymentStatusResponse);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const orderID = req.params.orderId;
    const paymentStatus = await Payment.findOne({
      where: {
        orderID: orderID,
      },
    });
    if (paymentStatus) {
      if (paymentStatus.status == "PENDING") {
        return res
          .status(200)
          .send({ message: "Payment with this Id is Pending", code: -1 });
      } else if (paymentStatus.status == "COMPLETED") {
        var data = {
          phoneNumber: paymentStatus.payeePhone,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          transactionId: paymentStatus.transactionId,
          orderId: paymentStatus.orderID,
          orderedAt: paymentStatus.createdAt,
          completedAt: paymentStatus.updatedAt,
        };
        return res.status(200).json({
          status: "success",
          data: data,
        });
      } else {
        return res.status(302).json({ message: "Failed", code: 0 });
      }
    } else {
      res.status(400).json({ message: "OrderId Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
exports.StripePaymentVerification = async (req, res) => {
  try {
    const orderID = req.params.orderId;
    const paymentStatus = await StripePayment.findOne({
      where: {
        orderID: orderID,
      },
    });
    if (paymentStatus) {
      if (paymentStatus.status == "PENDING") {
        return res
          .status(200)
          .send({ message: "Payment with this Id is Pending", code: -1 });
      } else if (paymentStatus.status == "COMPLETED") {
        var data = {
          phoneNumber: paymentStatus.payeePhone,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          transactionId: paymentStatus.transactionId,
          orderId: paymentStatus.orderID,
          orderedAt: paymentStatus.createdAt,
          completedAt: paymentStatus.updatedAt,
        };
        return res.status(200).json({
          status: "success",
          data: data,
        });
      } else {
        return res.status(302).json({ message: "Failed", code: 0 });
      }
    } else {
      res.status(400).json({ message: "OrderId Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
exports.verifyPaypalPayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const paymentStatus = await PaypalPayment.findOne({
      where: {
        orderID: orderId,
      },
    });

    if (paymentStatus) {
      if (paymentStatus.status == "PENDING") {
        return res
          .status(200)
          .send({ message: "Payment with this Id is Pending", code: -1 });
      } else if (paymentStatus.status == "COMPLETED") {
        var data = {
          phoneNumber: paymentStatus.payeePhone,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          transactionId: paymentStatus.transactionId,
          orderId: paymentStatus.orderID,
          orderedAt: paymentStatus.createdAt,
          completedAt: paymentStatus.updatedAt,
        };

        return res.status(200).json({
          status: "success",
          data: data,
          code: 0,
        });
      } else {
        return res.status(302).json({ message: "Failed", code: 0 });
      }
    } else {
      res.status(400).json({ message: "OrderId Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
exports.stripePayment = async (req, res) => {
  const { id, paymentId } = JSON.parse(req.body.data);
  const stripePaymentId = decodeURIComponent(paymentId);
  const decryptedData = CryptoJS.AES.decrypt(
    atob(stripePaymentId),
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  const paymentStatus = await StripePayment.findOne({
    where: {
      endPointIdentifier: decryptedData,
      status: "PENDING",
    },
  });
  if (paymentStatus) {
    // Create a PaymentIntent with the order amount and currency
    try {
      let amount = paymentStatus.amount + "00";
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(amount),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          order_id: "6735",
        },
      });
      paymentStatus.stripe_amount = amount;
      await paymentStatus.save();
      return res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(409).send({ message: "already Payed" });
  }
};
exports.paypalPyment = async (req, res, next) => {
  try {
    const {
      paymentId,
      amountValue,
      currency_code,
      orderId,
      payeeMerchant_id,
      status,
      transactionId,
      payeeEmail,
      payerEmailAddress,
      payerGiven_name,
      payerCountry_code,
    } = req.body;
    const stripePaymentId = decodeURIComponent(paymentId);
    console.log(stripePaymentId);
    const decryptedData = CryptoJS.AES.decrypt(
      atob(stripePaymentId),
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    const paymentStatus = await PaypalPayment.findOne({
      where: {
        endPointIdentifier: decryptedData,
        status: "PENDING",
      },
    });
    if (paymentStatus) {
      paymentStatus.paypalOrderId = orderId;
      paymentStatus.status = status;
      paymentStatus.amount = amountValue;
      paymentStatus.currencyCode = currency_code;
      paymentStatus.payeeEmail = payeeEmail;
      paymentStatus.payeeMerchant_id = payeeMerchant_id;
      paymentStatus.transactionId = transactionId;
      paymentStatus.payerGiven_name = payerGiven_name;
      paymentStatus.payerEmailAddress = payerEmailAddress;
      paymentStatus.payerCountry_code = payerCountry_code;
      await paymentStatus.save();
      http
        .get(paymentStatus.callBackUrl, (resp) => {
          let result = "";
          resp.on("data", (chunk) => {
            result += chunk;
          });
          resp.on("end", () => {});
        })
        .on("error", (error) => {
          logger.log({
            level: "error",
            message: "Payment verification error",
            error: {
              error,
            },
          });
        });
      return res.status(201).json(paymentStatus);
    } else {
      throw new CustomError("Payment Not Found", 404);
    }
  } catch (error) {
    next(error);
  }
};
exports.verifyStripePayment = async (req, res) => {
  const transactionId = req.body.transactionId;
  const paymentId = decodeURIComponent(req.body.paymentId);
  const paymentIntent = req.body.paymentIntent;
  const decryptedData = CryptoJS.AES.decrypt(
    paymentId,
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);

  try {
    const paymentStatus = await StripePayment.findOne({
      where: {
        endPointIdentifier: decryptedData,
        status: "PENDING",
      },
    });
    if (paymentStatus) {
      paymentStatus.status = "COMPLETED";
      paymentStatus.transactionId = transactionId;
      paymentStatus.save();
      logger.log({
        level: "info",
        message: "Stripe Paymenet Response",
        StripeResponse: {
          paymentIntent,
        },
      });

      http
        .get(paymentStatus.callBackUrl, (resp) => {
          let result = "";
          resp.on("data", (chunk) => {
            result += chunk;
          });
          resp.on("end", () => {});
        })
        .on("error", (error) => {
          logger.log({
            level: "error",
            message: "Payment verification error",
            error: {
              error,
            },
          });
        });
      return res.status(201).send({
        status: "success",
        returnUrl: paymentStatus.returnUrl,
      });
    } else {
      return res.status(409).send({ message: "Ther Is No Pending Payment" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.EbirrPayment = async (req, res, next) => {
  try {
    const { orderID, requestId, accountNo, amount, referenceId, invoiceId } =
      req.body;
    console.log(req.body);
    const eirrPaym = await EbirrPayment.findOne({
      where: { referenceId: referenceId },
    });
    if (eirrPaym) {
      return res.status(409).json({
        message: "Ebirr Payment Already Exists",
      });
    }
    const ebirrPayment = await EbirrPayment.create({
      orderID,
      requestId,
      referenceId,
      amount,
      accountNo,
      invoiceId,
    });
    await ebirrPayment.setMerchant(req.merchant);
    const token = await utils.getToken(
      process.env.EMAIL,
      process.env.PASSWORD_AUTH
    );

    // Create an instance of the HTTPS agent
    const httpsAgent = new https.Agent({
      cert: certificate,
      rejectUnauthorized: false,
      // Additional options if required (e.g., ca, passphrase, etc.)
    });
    const agent = new https.Agent({
      cert: cert,
      key: key,
    });
    // Configure Axios to use the HTTPS agent
    const axiosInstance = axios.create({
      httpsAgent: httpsAgent,
    });
    const postData = {
      requestId,
      accountNo,
      amount,
      referenceId,
      invoiceId,
    };
    const options = {
      agent: agent,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axiosInstance
      .post(process.env.PAYMENT_URLS + "ebirr", postData, config)
      .then((response) => {
        if (response.status == 200) {
          ebirrPayment.paymentStatus = "Approved";
          ebirrPayment.transactionId = response.data.transactionId;
          ebirrPayment.issuerTransactionId = response.data.issuerTransactionId;
          ebirrPayment.save();
          return res.status(200).json({
            status: "success",
            data: response.data,
          });
        } else if (response.status == 409) {
          ebirrPayment.paymentStatus = "Failed";
          ebirrPayment.save();
          return res.status(409).json({
            status: "failure",
            message: "Ebirr Payment Already Exists",
          });
        } else {
          ebirrPayment.paymentStatus = "Failed";
          ebirrPayment.save();
          return res.status(response.status).json({
            status: "failure",
            message: response.data,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        ebirrPayment.paymentStatus = "Failed";
        ebirrPayment.save();
        return res.status(500).json(error.message);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.verifyEbirrPayment = async (req, res) => {
  try {
    const orderID = req.params.orderId;
    console.log(orderID);
    const paymentStatus = await EbirrPayment.findOne({
      where: {
        orderID: orderID,
      },
    });
    console.log(paymentStatus);
    if (paymentStatus) {
      if (paymentStatus.paymentStatus == "Pending") {
        return res
          .status(200)
          .send({ message: "Payment with this Id is Pending", code: -1 });
      } else if (paymentStatus.paymentStatus == "Approved") {
        var data = {
          phoneNumber: paymentStatus.accountNo,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          transactionId: paymentStatus.transactionId,
          orderId: paymentStatus.orderID,
          orderedAt: paymentStatus.createdAt,
          completedAt: paymentStatus.updatedAt,
        };
        return res.status(200).json({
          status: "success",
          data: data,
          code: 0,
        });
      } else {
        return res.status(302).json({ message: "Failed", code: 0 });
      }
    } else {
      res.status(400).json({ message: "OrderId Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
exports.chapa_call_back_url = async (req, res) => {
  const tx_ref = req.body.tx_ref;
  const status = req.body.status;
  const txn_id = req.body.transactionID;
  console.log(req.body);
  try {
    const chapa_payment = await chapaPayment.findOne({
      where: { tx_ref: tx_ref, paymentStatus: "PENDING" },
    });

    if (chapa_payment) {
      if (status == "Completed") {
        chapa_payment.paymentStatus = "COMPLETED";
        await chapa_payment.save();
        await axios
          .put(chapa_payment.callback_url, {
            status: "Completed",
            txn_id: txn_id,
          })
          .then((resp) => {
            console.log(resp.status);
            if (resp.status == 200) {
              chapa_payment.isVerified = true;
              chapa_payment.save();
            }
          })
          .catch((err) => {
            console.error(err);
          });
        return res.status(201).json({ status: "ok" });
      } else if (status == "failed") {
        chapa_payment.paymentStatus = "FAILED";
        await chapa_payment.save();
        return res.status(201).json({ status: "ok" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "No Payment Found with these reference Id" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.createPaymentServices = async (req, res, next) => {
  const { serviceName } = req.body;
  try {
    const paymentServices = await PaymentSevice.findOne({
      where: {
        payment_service_name: serviceName,
      },
    });
    if (paymentServices) {
      return res.status(409).json({ message: "already_exists" });
    }
    const service = await PaymentSevice.create({
      payment_service_name: serviceName,
    });
    if (service) {
      return res.status(201).json({ message: "success" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getPaymentService = async (req, res, next) => {
  try {
    const paymentServices = await PaymentSevice.findAll({});
    if (paymentServices) {
      return res.status(200).json(paymentServices);
    }
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};
exports.updatePaymentService = async (req, res, next) => {
  const { serviceName } = req.body;
  const paymentServices = await PaymentSevice.findOne({
    where: {
      payment_service_name: serviceName,
    },
  });
  if (paymentServices.status === true) {
    paymentServices.status = false;
    paymentServices.save();
    return res.status(201).json({ message: "updated" });
  } else {
    paymentServices.status = true;
    paymentServices.save();
    return res.status(201).json({ message: "updated" });
  }
};
exports.coopassPayment = async (req, res, next) => {
  try {
    const { debitAccount, amount, currency, orderId, clientId, phoneNumber } =
      req.body;

    // const messageId =
    //   Date.now().toString(30) + Math.random().toString(30).substr(2);
    const messageId = orderId;
    const debitCurrency = currency;
    const debitAmount = amount;
    logger.log({
      level: "info",
      message: "Payment Process Request to the Spring Boot Backend",
      request: {
        messageId: messageId,
        clientId: clientId,
        debitAccount: debitAccount,
        debitCurrency: debitCurrency,
        debitAmount: debitAmount,
        creditAccount: req.merchant.bankAccount[0].account_number,
      },
    });
    await Payment.create({
      orderID: orderId,
      email: req.merchant.email_address,
      currency: debitCurrency,
      amount: debitAmount,
      payeePhone: phoneNumber,
      creditAccount: req.merchant.bankAccount[0].account_number,
    });

    const jsonData = JSON.stringify({
      messageId,
      clientId,
      debitAccount,
      debitAmount,
      creditAccount: req.merchant.bankAccount[0].account_number,
    });
    const url = process.env.PAYMENT_URLS + "create-payment";
    const token = await utils.getToken(
      process.env.EMAIL,
      process.env.PASSWORD_AUTH
    );

    // Create an instance of the HTTPS agent
    const httpsAgent = new https.Agent({
      cert: certificate,
      rejectUnauthorized: false,
      // Additional options if required (e.g., ca, passphrase, etc.)
    });
    const agent = new https.Agent({
      cert: cert,
      key: key,
    });
    // Configure Axios to use the HTTPS agent
    const axiosInstance = axios.create({
      httpsAgent: httpsAgent,
    });
    const options = {
      agent: agent,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const paymentStatus = await Payment.findOne({
      where: { orderID: orderId },
    });
    if (paymentStatus) {
      await axiosInstance
        .post(url, jsonData, config)
        .then((response) => {
          if (response.status == 201) {
            paymentStatus.status = "COMPLETED";
            paymentStatus.transactionId = response.data.transactionID;
            paymentStatus.save();
            logger.log({
              level: "info",
              message: "Payment Response",
              response: {
                parsedData,
              },
            });
            return res.status(201).send({
              status: "success",
              data: parsedData,
              returnUrl: paymentStatus.returnUrl,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json(error.message);
        });
    } else {
      return res.status(404).json({ message: "No Pending Payment found " });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
