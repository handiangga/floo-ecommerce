const ResponseHelper = require("../helpers/response.helper");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return ResponseHelper.validation(
        res,
        error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      );
    }

    req.body = value;

    next();
  };
};

module.exports = validationMiddleware;
