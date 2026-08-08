const jwt = require("jsonwebtoken");

const { User, Role } = require("../../models");

const ResponseHelper = require("../helpers/response.helper");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const token = req.cookies?.floo_admin_token || headerToken;

    if (!token) {
      return ResponseHelper.unauthorized(res, "Access token required");
    }

    if (authHeader && !headerToken) {
      return ResponseHelper.unauthorized(res, "Invalid token format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "ADMIN") {
      return ResponseHelper.unauthorized(res, "Invalid admin token");
    }

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: "role",
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return ResponseHelper.unauthorized(res, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    return ResponseHelper.unauthorized(res, "Invalid or expired token");
  }
};
