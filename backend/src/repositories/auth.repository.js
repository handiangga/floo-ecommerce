const { User, Role } = require("../../models");

class AuthRepository {
  async findByEmail(email) {
    return User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async updateLastLogin(id) {
    return User.update(
      {
        last_login: new Date(),
      },
      {
        where: { id },
      },
    );
  }

  async findById(id) {
    return User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "photo",
        "status",
        "last_login",
      ],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });
  }
}

module.exports = new AuthRepository();
