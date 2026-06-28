const { Color } = require("../../models");
const { Op } = require("sequelize");

class ColorRepository {
  async findAll({
    limit,
    offset,
    search = "",
    status,
    sort = "id",
    order = "DESC",
  }) {
    const where = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (status) {
      where.status = status;
    }

    return Color.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Color.findByPk(id);
  }

  async findByName(name) {
    return Color.findOne({
      where: { name },
    });
  }

  async create(payload) {
    return Color.create(payload);
  }

  async update(id, payload) {
    await Color.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Color.destroy({
      where: { id },
    });
  }
}

module.exports = new ColorRepository();
