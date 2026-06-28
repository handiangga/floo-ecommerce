const { Category } = require("../../models");

class CategoryRepository {
  async findAll({ limit, offset }) {
    const { rows, count } = await Category.findAndCountAll({
      limit,
      offset,
      order: [["sort_order", "ASC"]],
    });

    return {
      rows,
      count,
    };
  }

  async findById(id) {
    return await Category.findByPk(id);
  }

  async findBySlug(slug) {
    return await Category.findOne({
      where: { slug },
    });
  }

  async create(payload) {
    return await Category.create(payload);
  }

  async update(category, payload) {
    return await category.update(payload);
  }

  async delete(category) {
    return await category.destroy();
  }
}

module.exports = new CategoryRepository();
