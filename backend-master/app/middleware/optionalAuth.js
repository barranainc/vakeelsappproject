const jwt = require("jsonwebtoken");
const logger = require("../logger");
const response = require("../utils/responseHelpers");
const config = process.env;
const verifyToken = async (req, res, next) => {
  var token = req.headers["authorization"];
  if (!token) {
    return next()
  }
  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");
  try {
    // const isBlacklisted = await BlacklistedToken.findOne({ token });
    // if (isBlacklisted) {
    //   return res.status(401).send("Token is no longer valid.");
    // }
    if (token == null || token == "null") {
      return next()

    }
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded;
    
  } catch (error) {
    console.log(error)
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return response.authError(res, "Unauthorized");
  }
  return next();
};

module.exports = verifyToken;
