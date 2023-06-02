const jwt = require("jsonwebtoken");

const extractedToken = (imcommigToken) => {
  const [prefix, token] = imcommigToken.split(" ");
  const decodedToken = jwt.decode(token);
  var phoneNumber = "";
  if (decodedToken) {
    phoneNumber = decodedToken.phone_number;
  }
  console.log("Phone number is:", phoneNumber);
  return phoneNumber;
};
module.exports = {
  extractedToken,
};
