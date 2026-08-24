const { Size, sequelize } = require("../../models");
const { Op, fn, col, where } = require("sequelize");

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
      where: where(fn("LOWER", col("name")), String(name).trim().toLowerCase()),
    });
  }

  async create(payload) {
    try {
      return await Size.create(payload);
    } catch (error) {
      if (!this.isPrimaryKeyCollision(error)) throw error;
      await this.syncPrimaryKeySequence();
      return Size.create(payload);
    }
  }

  isPrimaryKeyCollision(error) {
    return error?.name === "SequelizeUniqueConstraintError"
      && (error.parent?.constraint === "Sizes_pkey"
        || error.errors?.some((item) => item.path === "id"));
  }

  async syncPrimaryKeySequence() {
    await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('"Sizes"', 'id'),
        COALESCE((SELECT MAX("id") FROM "Sizes"), 1),
        EXISTS(SELECT 1 FROM "Sizes")
      );
    `);
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
