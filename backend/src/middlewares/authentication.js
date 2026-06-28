const jwt = require("jsonwebtoken");

const { User, Role } = require("../../models");

const ResponseHelper = require("../helpers/response.helper");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ResponseHelper.unauthorized(res, "Access token required");
    }

    if (!authHeader.startsWith("Bearer ")) {
      return ResponseHelper.unauthorized(res, "Invalid token format");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
