const { User, Role } = require("../../models");

class AuthRepository {
  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
        },
      ],
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
        },
      ],
    });
  }
}

module.exports = new AuthRepository();
