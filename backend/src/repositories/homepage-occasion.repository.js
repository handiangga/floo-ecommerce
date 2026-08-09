const { HomepageOccasion } = require("../../models");
const { Op } = require("sequelize");

class HomepageOccasionRepository {
  findAll({ search = "", status } = {}) {
    const where = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (status) where.status = status;
    return HomepageOccasion.findAll({ where, order: [["sort_order", "ASC"], ["id", "ASC"]] });
  }
  findById(id) { return HomepageOccasion.findByPk(id); }
  create(payload) { return HomepageOccasion.create(payload); }
  async update(id, payload) { await HomepageOccasion.update(payload, { where: { id } }); return this.findById(id); }
  delete(id) { return HomepageOccasion.destroy({ where: { id } }); }
}

module.exports = new HomepageOccasionRepository();
