const jwt = require("jsonwebtoken");
const approveMerchants = (imcommigToken) => {
  if (imcommigToken == undefined) {
    return "undefied call";
  }
  const [prefix, token] = imcommigToken.split(" ");
  const decodedToken = jwt.decode(token);
  if (decodedToken) {
    const roleOfAuthorizer = decodedToken.role;
    console.log("Auth", roleOfAuthorizer);
    return roleOfAuthorizer;
  }
};
module.exports = {
  approveMerchants,
};
