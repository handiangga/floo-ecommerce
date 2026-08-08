const router = require("express").Router();

const CustomerAuthController = require("../controllers/customer-auth.controller");

const validation = require("../middlewares/validation");

const customerAuthentication = require("../middlewares/customer-authentication");
const rateLimit = require("../middlewares/rate-limit");

const CustomerAuthValidation = require("../validations/customer-auth.validation");

// ======================
// PUBLIC
// ======================

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
  message: "Too many authentication attempts. Please try again in 15 minutes.",
  keyPrefix: "customer-auth",
});

router.get("/google", authRateLimit, CustomerAuthController.googleLogin);
router.get("/google/callback", CustomerAuthController.googleCallback);

router.post(
  "/register",
  authRateLimit,
  validation(CustomerAuthValidation.register),
  CustomerAuthController.register,
);

router.post(
  "/login",
  authRateLimit,
  validation(CustomerAuthValidation.login),
  CustomerAuthController.login,
);

// ======================
// PRIVATE
// ======================

router.get("/profile", customerAuthentication, CustomerAuthController.profile);

router.put(
  "/profile",
  customerAuthentication,
  validation(CustomerAuthValidation.updateProfile),
  CustomerAuthController.updateProfile,
);

router.put(
  "/change-password",
  customerAuthentication,
  validation(CustomerAuthValidation.changePassword),
  CustomerAuthController.changePassword,
);

router.post("/logout", customerAuthentication, CustomerAuthController.logout);

module.exports = router;
