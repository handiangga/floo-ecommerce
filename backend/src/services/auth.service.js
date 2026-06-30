const jwt = require("jsonwebtoken");

const AuthRepository = require("../repositories/auth.repository");
const PasswordHelper = require("../helpers/password.helper");

class AuthService {
  async login(email, password) {
    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      throw new Error("Email or password is incorrect");
    }

    const valid = await PasswordHelper.compare(password, user.password);

    if (!valid) {
      throw new Error("Email or password is incorrect");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name,
        type: "ADMIN",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    await AuthRepository.updateLastLogin(user.id);

    const userData = user.toJSON();

    delete userData.password;

    return {
      token,
      user: userData,
    };
  }

  async profile(id) {
    return await AuthRepository.findById(id);
  }

  async logout() {
    return true;
  }
}

module.exports = new AuthService();
