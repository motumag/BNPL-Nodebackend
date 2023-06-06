const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require("axios")
exports.generateRandomPassword = ()=> {
  const length = 10; // Length of the generated password
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const specialChars = '#$%^&*()~`}{[]';

  let password = '';

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
  console.log(password)
  return password;
}

function getRandomCharacter(characters) {
  const randomIndex = crypto.randomInt(0, characters.length);
  return characters.charAt(randomIndex);
}

function shuffleString(str) {
  let shuffled = str.split('');
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.join('');
}

exports.sendEmail= (id,email_address, password, type="sales")=>{
  const registerUrl = `http://localhost:5000/api/merchant/activate?id=${id}&type=${type}`;
const subject="Activation Link"    
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
      <ol>
      <li>Click on the following activation link: <a href=http://localhost:5000/api/merchant/activate?id=${id}&type=${type}>Activate Account</a> (Note: The link will expire in [X] days, so please complete the activation process promptly.)</li>
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
}
exports.sendMessage=(id,phone_number, password)=>{
  // Make a POST request
  console.log(password)
  const registerUrl = `http://localhost:5000/api/merchant/activate?id=${id}`;
// axios.post(process.env.OTP_ENDPOINT, { Text: registerUrl + "Password: "+ password, Mobile: phone_number })
// .then(response => {
//   console.log('Response:', response.data);
// })
// .catch(error => {
//   console.error('Error:', error.message);
// });
}

