const router = require("express").Router();

const CustomerAuthController = require("../controllers/customer-auth.controller");

const validation = require("../middlewares/validation");

const customerAuthentication = require("../middlewares/customer-authentication");

const CustomerAuthValidation = require("../validations/customer-auth.validation");

// ======================
// PUBLIC
// ======================

router.get("/google", CustomerAuthController.googleLogin);
router.get("/google/callback", CustomerAuthController.googleCallback);

router.post(
  "/register",
  validation(CustomerAuthValidation.register),
  CustomerAuthController.register,
);

router.post(
  "/login",
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

module.exports = router;
