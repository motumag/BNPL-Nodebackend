const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const path = require("path");
exports.generateRandomPassword = () => {
  const length = 10; // Length of the generated password
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const specialChars = "#$%^&*()~`}{[]";

  let password = "";

  // Generate at least one uppercase letter
  password += getRandomCharacter(uppercaseChars);

  // Generate at least one lowercase letter
  password += getRandomCharacter(lowercaseChars);

  // Generate at least one special character
  password += getRandomCharacter(specialChars);

  // Generate the remaining characters randomly
  for (let i = 0; i < length - 3; i++) {
    const allChars = uppercaseChars + lowercaseChars + specialChars;
    password += getRandomCharacter(allChars);
  }

  // Shuffle the generated password to ensure randomness
  password = shuffleString(password);
  console.log(password);
  return password;
};

function getRandomCharacter(characters) {
  const randomIndex = crypto.randomInt(0, characters.length);
  return characters.charAt(randomIndex);
}

function shuffleString(str) {
  let shuffled = str.split("");
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.join("");
}

exports.sendEmail = (id, email_address, password, type = "merchant") => {
  const subject = "Activation Link";
  // Create a transporter with your SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amaedris1@gmail.com",
      pass: "dporbuwjfvvlnima",
    },
  });

  var mailOptions = {
    from: "amaedris1@gmail.com",
    to: email_address,
    subject: subject,
    // text:  registerUrl,
    html: `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activate Your Epay Account</title>
    </head>
    <body>
      <h2>Activate Your Epay Account - Action Required</h2>
      <p>Dear [User's Name],</p>
      <p>Thank you for choosing Epay as your trusted payment gateway. We're excited to have you on board! To fully activate your Epay account, we kindly request that you complete the account activation process.</p>
      <p>To activate your account, please follow the simple steps below:</p>
      <p>Password:${password}</p>
      <ol>
      <li>Click on the following activation link: <a href=${process.env.EMAIL_ACTIVATION_END_POINT}?id=${id}&type=${type}>Activate Account</a> (Note: The link will expire in [X] days, so please complete the activation process promptly.)</li>
        <li>You will be redirected to a secure activation page. Fill in the required information, including your username and password.</li>
        <li>Once you have entered the necessary details, click on the "Activate Account" button to confirm your activation.</li>
      </ol>
      <p>That's it! Your Epay account will be successfully activated, and you will gain access to our comprehensive merchant dashboard.</p>
      <p>Should you have any questions or encounter any issues during the activation process, please don't hesitate to contact our dedicated support team at <a href="mailto:[Support Email]">[Support Email]</a> or call us at [Support Phone Number]. We're here to assist you every step of the way.</p>
      <p>Thank you for choosing Epay as your payment gateway partner. We look forward to serving your payment processing needs and helping your business thrive.</p>
      <p>Best regards,<br>
      [Your Name]<br>
      [Your Position/Title]<br>
      Epay Support Team</p>
    </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
      // res.sendStatus(500);
    } else {
      console.log("Email has sent to:" + info.response);
      // res.sendStatus(200);
    }
  });
};
exports.sendSalesEmail = ({ email_address, password }) => {
  const subject = "Default Password";
  // Create a transporter with your SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amaedris1@gmail.com",
      pass: "dporbuwjfvvlnima",
    },
  });

  var mailOptions = {
    from: "amaedris1@gmail.com",
    to: email_address,
    subject: subject,
    text: "Your Password Is " + password,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
      // res.sendStatus(500);
    } else {
      console.log("Email has sent to:" + info.response);
      // res.sendStatus(200);
    }
  });
};
exports.sendMessage = ({ id, phone_number, password, type = "sales" }) => {
  // Make a POST request
  // const registerUrl = `${process.env.EMAIL_ACTIVATION_END_POINT}?id=${id}&type=${type} your Password is: ${password}`;
  const registerUrl = `${password}`;
  console.log(registerUrl, " ", phone_number);
  axios
    .post(process.env.OTP_ENDPOINT, {
      Text: registerUrl,
      Mobile: phone_number,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
};
exports.sendSalesMessage = (phone_number, password) => {
  // Make a POST request
  axios
    .post(process.env.OTP_ENDPOINT, {
      Text: "Password: " + password,
      Mobile: phone_number,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
};
exports.generateRandomNumber = async function () {
  const min = 100000; // Minimum 8-digit number (inclusive)
  const max = 999999; // Maximum 8-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getToken = async function (email, password) {
  try {
    // Read the certificate file
    const cert = path.join(__dirname, "../", "Cooperative Bank.crt");
    const certificate = fs.readFileSync(cert, "utf8");
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
    const response = await axiosInstance.post(process.env.SPRING_ENDPOINT, {
      email: email,
      password: password,
    });
    console.log(response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
