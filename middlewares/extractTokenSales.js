const jwt = require("jsonwebtoken");
const extractedPhoneFromToken = (imcommigToken) => {
  const [prefix, token] = imcommigToken.split(" ");
  const decodedToken = jwt.decode(token);
  var phoneNumber = "";
  if (decodedToken) {
    phoneNumber = decodedToken.phone_number;
  }
  console.log("Phone number is:", phoneNumber);
  //return the phone number
  return phoneNumber;
};
module.exports = {
  extractedPhoneFromToken,
};
