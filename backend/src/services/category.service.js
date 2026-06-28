const CategoryRepository = require("../repositories/category.repository");

const PaginationHelper = require("../helpers/pagination.helper");
const SlugHelper = require("../helpers/slug.helper");

class CategoryService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await CategoryRepository.findAll({
      limit,
      offset,
      search: query.search || "",
      status: query.status,
      sort: query.sort || "id",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async create(payload) {
    payload.slug = SlugHelper.generate(payload.name);

    const exist = await CategoryRepository.findBySlug(payload.slug);

    if (exist) {
      throw new Error("Category already exists");
    }

    return CategoryRepository.create(payload);
  }

  async update(id, payload) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    if (payload.name) {
      payload.slug = SlugHelper.generate(payload.name);

      const exist = await CategoryRepository.findBySlug(payload.slug);

      if (exist && Number(exist.id) !== Number(id)) {
        throw new Error("Category already exists");
      }
    }

    return CategoryRepository.update(id, payload);
  }

  async delete(id) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    await CategoryRepository.delete(id);

    return true;
  }
}

module.exports = new CategoryService();
