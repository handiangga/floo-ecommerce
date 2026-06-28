const { Banner } = require("../../models");
const { Op } = require("sequelize");

class BannerRepository {
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
      where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (status) {
      where.status = status;
    }

    return Banner.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Banner.findByPk(id);
  }

  async create(payload) {
    return Banner.create(payload);
  }

  async update(id, payload) {
    await Banner.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Banner.destroy({
      where: { id },
    });
  }
}

module.exports = new BannerRepository();
