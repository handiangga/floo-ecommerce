const ResponseHelper = require("../helpers/response.helper");

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ResponseHelper.forbidden(res, "You don't have permission");
    }

    next();
  };
};

module.exports = roleMiddleware;
