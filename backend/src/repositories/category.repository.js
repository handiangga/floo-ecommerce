const { Category } = require("../../models");
const { Op } = require("sequelize");

class CategoryRepository {
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

    return Category.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: Category, as: "subcategories", required: false }],
      distinct: true,
      order: [["parent_id", "ASC"], [sort, order]],
    });
  }

  async findById(id) {
    return Category.findByPk(id);
  }

  async findBySlug(slug) {
    return Category.findOne({
      where: { slug },
    });
  }

  async create(payload) {
    return Category.create(payload);
  }

  async update(id, payload) {
    await Category.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Category.destroy({
      where: { id },
    });
  }

  async findByNameAndParent(name, parentId) {
    return Category.findOne({ where: { name, parent_id: parentId || null } });
  }

  async hasChildren(id) {
    return Category.count({ where: { parent_id: id } });
  }
}

module.exports = new CategoryRepository();
