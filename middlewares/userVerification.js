const jwt = require("jsonwebtoken")
const grantAccess = (roles) => {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      console.log(token)
      // Check if the user's role is allowed
      if (token) {
        jwt.verify(token,process.env.JWT_SECRET, (err, user)=>{
          if (err) {
            res.status(403).send("Forbidde")
          }else{
            console.log(user.role)
            if (roles.includes(user.role)) {
              console.log() 
              next()
            }else{
              res.status(403).send("Forbidden")
            }
          }
        })
      }else{
        res.status(401).send("Unauthorised")
      }
    };
  };

  module.exports = {grantAccess}