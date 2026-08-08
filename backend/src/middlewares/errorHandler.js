const ResponseHelper = require("../helpers/response.helper");

module.exports = (err, req, res, next) => {
  console.error({
    message: err.message,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.name === "MulterError") {
    return ResponseHelper.validation(res, [
      {
        field: err.field || "image",
        message: "Upload image is invalid or exceeds the allowed limit",
      },
    ]);
  }

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

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  return ResponseHelper.error(res, message);
};
