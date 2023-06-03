const jwt = require("jsonwebtoken");
const extractedPhoneFromToken = (imcommigToken) => {
  const [prefix, token] = imcommigToken.split(" ");
  const decodedToken = jwt.decode(token);
  if (decodedToken) {
    if (decodedToken.phone_number == undefined) {
      const email = decodedToken.email_address
      return email
    }else{
      const phoneNumber = decodedToken.phone_number;
      return phoneNumber
    }
  }
};
module.exports = {
  extractedPhoneFromToken,
};
