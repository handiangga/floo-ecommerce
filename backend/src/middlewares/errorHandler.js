const ResponseHelper = require("../helpers/response.helper");

module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return ResponseHelper.validation(
      res,
      err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    );
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return ResponseHelper.conflict(res, err.errors[0].message);
  }

  return ResponseHelper.error(res, err.message || "Internal Server Error");
};
