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

exports.sendEmail= (id,email_address, type="sales")=>{
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
    text:  registerUrl,
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
exports.sendMessage=(id,phone_number)=>{
  // Make a POST request
const registerUrl = `http://localhost:3000/activation?id=${id}`;
axios.post(process.env.OTP_ENDPOINT, { text: registerUrl, Mobile: phone_number })
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error.message);
});
}

