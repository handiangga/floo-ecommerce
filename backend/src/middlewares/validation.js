const { error } = require("../helpers/response");

module.exports = (schema) => {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      return error(
        res,
        "Validation Error",
        422,
        validationError.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      );
    }

    next();
  };
};
