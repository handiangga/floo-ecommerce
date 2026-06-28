const jwt = require("jsonwebtoken");
const ResponseHelper = require("../helpers/response.helper");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return ResponseHelper.unauthorized(res, "Access token required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return ResponseHelper.unauthorized(res, "Invalid token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return ResponseHelper.unauthorized(res, "Invalid or expired token");
  }
};
