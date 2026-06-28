const { Size } = require("../../models");
const { Op } = require("sequelize");

class SizeRepository {
  async findAll({
    limit,
    offset,
    search = "",
    status,
    sort = "sort_order",
    order = "ASC",
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

    return Size.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Size.findByPk(id);
  }

  async findByName(name) {
    return Size.findOne({
      where: { name },
    });
  }

  async create(payload) {
    return Size.create(payload);
  }

  async update(id, payload) {
    await Size.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Size.destroy({
      where: { id },
    });
  }
}

module.exports = new SizeRepository();
