const CustomerAuthService = require("../services/customer-auth.service");
const ResponseHelper = require("../helpers/response.helper");

class CustomerAuthController {
  async register(req, res, next) {
    try {
      const result = await CustomerAuthService.register(req.body);

      return ResponseHelper.created(res, result, "Register successfully");
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await CustomerAuthService.login(email, password);

      return ResponseHelper.success(res, result, "Login successfully");
    } catch (err) {
      next(err);
    }
  }

  async profile(req, res, next) {
    try {
      const result = await CustomerAuthService.profile(req.customer.id);

      return ResponseHelper.success(
        res,
        result,
        "Profile retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await CustomerAuthService.updateProfile(
        req.customer.id,
        req.body,
      );

      return ResponseHelper.updated(
        res,
        result,
        "Profile updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;

      await CustomerAuthService.changePassword(
        req.customer.id,
        old_password,
        new_password,
      );

      return ResponseHelper.success(res, null, "Password changed successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerAuthController();
