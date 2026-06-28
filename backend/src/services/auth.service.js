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
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      user,
    };
  }

  async profile(id) {
    return await AuthRepository.findById(id);
  }
}

module.exports = new AuthService();
