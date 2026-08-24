const { Color, sequelize } = require("../../models");
const { Op, fn, col, where } = require("sequelize");

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
      // Option values are typed manually by the admin. Treat `Navy` and
      // `navy` as the same internal legacy Color record.
      where: where(fn("LOWER", col("name")), String(name).trim().toLowerCase()),
    });
  }

  async create(payload) {
    try {
      return await Color.create(payload);
    } catch (error) {
      if (!this.isPrimaryKeyCollision(error)) throw error;
      await this.syncPrimaryKeySequence();
      return Color.create(payload);
    }
  }

  isPrimaryKeyCollision(error) {
    return error?.name === "SequelizeUniqueConstraintError"
      && (error.parent?.constraint === "Colors_pkey"
        || error.errors?.some((item) => item.path === "id"));
  }

  async syncPrimaryKeySequence() {
    await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('"Colors"', 'id'),
        COALESCE((SELECT MAX("id") FROM "Colors"), 1),
        EXISTS(SELECT 1 FROM "Colors")
      );
    `);
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
