const CustomerAuthService = require("../services/customer-auth.service");
const ResponseHelper = require("../helpers/response.helper");
const crypto = require("crypto");
const {
  setCustomerCookie,
  clearCustomerCookie,
} = require("../helpers/auth-cookie.helper");

class CustomerAuthController {
  googleLogin(req, res) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) return ResponseHelper.error(res, "Google OAuth is not configured", 503);
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("floo_google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
      path: "/api/v1/customer-auth/google/callback",
    });
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: process.env.GOOGLE_REDIRECT_URI, response_type: "code", scope: "openid email profile", prompt: "select_account", state });
    return res.redirect(url.toString());
  }

  async googleCallback(req, res, next) {
    try {
      const expectedState = req.cookies?.floo_google_oauth_state;
      const receivedState = req.query.state;
      res.clearCookie("floo_google_oauth_state", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/v1/customer-auth/google/callback",
      });

      if (
        !expectedState ||
        typeof receivedState !== "string" ||
        expectedState.length !== receivedState.length ||
        !crypto.timingSafeEqual(
          Buffer.from(expectedState),
          Buffer.from(receivedState),
        )
      ) {
        return ResponseHelper.unauthorized(res, "Invalid Google OAuth state");
      }

      const result = await CustomerAuthService.googleCallback(req.query.code);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      setCustomerCookie(res, result.token);
      return res.redirect(`${frontendUrl}/auth/google/callback`);
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
      setCustomerCookie(res, result.token);
      const { token, ...safeResult } = result;

      return ResponseHelper.success(res, safeResult, "Login successfully");
    } catch (err) {
      if (err.message === "Email or password is incorrect") {
        return ResponseHelper.unauthorized(res, err.message);
      }
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

  async logout(req, res) {
    clearCustomerCookie(res);
    return ResponseHelper.success(res, null, "Logout successfully");
  }
}

module.exports = new CustomerAuthController();
