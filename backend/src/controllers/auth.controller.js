const AuthService = require("../services/auth.service");

const ResponseHelper = require("../helpers/response.helper");

class AuthController {
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);

      return ResponseHelper.success(res, result, "Login success");
    } catch (err) {
      next(err);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await AuthService.profile(req.user.id);

      return ResponseHelper.success(res, user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
