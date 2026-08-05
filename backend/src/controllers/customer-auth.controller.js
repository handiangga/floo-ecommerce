const CustomerAuthService = require("../services/customer-auth.service");
const ResponseHelper = require("../helpers/response.helper");

class CustomerAuthController {
  googleLogin(req, res) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) return ResponseHelper.error(res, "Google OAuth is not configured", 503);
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: process.env.GOOGLE_REDIRECT_URI, response_type: "code", scope: "openid email profile", prompt: "select_account" });
    return res.redirect(url.toString());
  }

  async googleCallback(req, res, next) {
    try {
      const result = await CustomerAuthService.googleCallback(req.query.code);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      return res.redirect(`${frontendUrl}/auth/google/callback?token=${encodeURIComponent(result.token)}`);
    } catch (err) { next(err); }
  }
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
