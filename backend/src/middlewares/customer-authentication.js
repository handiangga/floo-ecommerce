const jwt = require("jsonwebtoken");

const { Customer } = require("../../models");

const ResponseHelper = require("../helpers/response.helper");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const token = req.cookies?.floo_customer_token || headerToken;

    if (!token) {
      return ResponseHelper.unauthorized(res, "Access token required");
    }

    if (authHeader && !headerToken) {
      return ResponseHelper.unauthorized(res, "Invalid token format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "CUSTOMER") {
      return ResponseHelper.unauthorized(res, "Invalid customer token");
    }

    const customer = await Customer.findByPk(decoded.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!customer) {
      return ResponseHelper.unauthorized(res, "Customer not found");
    }

    req.customer = customer;

    next();
  } catch (error) {
    return ResponseHelper.unauthorized(res, "Invalid or expired token");
  }
};
