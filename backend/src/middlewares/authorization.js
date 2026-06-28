const ResponseHelper = require("../helpers/response.helper");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return ResponseHelper.unauthorized(res, "Unauthorized");
    }

    if (!roles.includes(req.user.role.name)) {
      return ResponseHelper.forbidden(res, "You don't have permission");
    }

    next();
  };
};
