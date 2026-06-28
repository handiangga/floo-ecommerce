const CategoryRepository = require("../repositories/category.repository");
const PaginationHelper = require("../helpers/pagination.helper");
const SlugHelper = require("../helpers/slug.helper");

class CategoryService {
  async findAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const { rows, count } = await CategoryRepository.findAll({
      limit,
      offset,
    });

    return {
      data: rows,
      meta: PaginationHelper.getMeta(count, page, limit),
    };
  }

  async findById(id) {
    return await CategoryRepository.findById(id);
  }

  async create(payload) {
    payload.slug = SlugHelper.generate(payload.name);

    return await CategoryRepository.create(payload);
  }

  async update(id, payload) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    if (payload.name) {
      payload.slug = SlugHelper.generate(payload.name);
    }

    return await CategoryRepository.update(category, payload);
  }

  async delete(id) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return await CategoryRepository.delete(category);
  }
}

module.exports = new CategoryService();
