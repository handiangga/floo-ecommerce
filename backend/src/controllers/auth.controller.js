const AuthService = require("../services/auth.service");
const ResponseHelper = require("../helpers/response.helper");
const {
  setAdminCookie,
  clearAdminCookie,
} = require("../helpers/auth-cookie.helper");

class AuthController {
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      setAdminCookie(res, result.token);
      const { token, ...safeResult } = result;

      return ResponseHelper.success(res, safeResult, "Login success");
    } catch (err) {
      if (err.message === "Email or password is incorrect") {
        return ResponseHelper.unauthorized(res, err.message);
      }
      next(err);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await AuthService.profile(req.user.id);

      return ResponseHelper.success(
        res,
        user,
        "Profile retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await AuthService.logout();
      clearAdminCookie(res);

      return ResponseHelper.success(res, null, "Logout success");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
