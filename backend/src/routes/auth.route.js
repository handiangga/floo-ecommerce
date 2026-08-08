const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");

const authentication = require("../middlewares/authentication");
const validation = require("../middlewares/validation");
const rateLimit = require("../middlewares/rate-limit");

const AuthValidation = require("../validations/auth.validation");

router.post(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.ADMIN_AUTH_RATE_LIMIT_MAX || 8),
    message: "Too many admin login attempts. Please try again in 15 minutes.",
    keyPrefix: "admin-auth",
  }),
  validation(AuthValidation.login),
  AuthController.login,
);

router.get("/profile", authentication, AuthController.profile);

router.post("/logout", authentication, AuthController.logout);

module.exports = router;
