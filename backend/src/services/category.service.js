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
    let parent = null;
    if (payload.parent_id) {
      parent = await CategoryRepository.findById(payload.parent_id);
      if (!parent) throw new Error("Kategori utama tidak ditemukan");
      if (parent.parent_id) throw new Error("Subkategori hanya boleh berada satu tingkat di bawah kategori utama");
    }

    const exist = await CategoryRepository.findByNameAndParent(payload.name, payload.parent_id);
    if (exist) throw new Error("Subkategori dengan nama tersebut sudah ada pada kategori ini");

    payload.slug = SlugHelper.generate(parent ? `${parent.slug}-${payload.name}` : payload.name);

    return CategoryRepository.create(payload);
  }

  async update(id, payload) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    const nextParentId = Object.prototype.hasOwnProperty.call(payload, "parent_id") ? payload.parent_id : category.parent_id;
    let parent = null;

    if (nextParentId && Number(nextParentId) === Number(id)) {
      throw new Error("Kategori tidak dapat menjadi subkategori dirinya sendiri");
    }

    if (nextParentId) {
      parent = await CategoryRepository.findById(nextParentId);
      if (!parent) throw new Error("Kategori utama tidak ditemukan");
      if (parent.parent_id) throw new Error("Subkategori hanya boleh berada satu tingkat di bawah kategori utama");
    }

    const nextName = payload.name || category.name;
    const exist = await CategoryRepository.findByNameAndParent(nextName, nextParentId);
    if (exist && Number(exist.id) !== Number(id)) throw new Error("Subkategori dengan nama tersebut sudah ada pada kategori ini");

    payload.slug = SlugHelper.generate(parent ? `${parent.slug}-${nextName}` : nextName);

    return CategoryRepository.update(id, payload);
  }

  async delete(id) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    const children = await CategoryRepository.hasChildren(id);
    if (children) throw new Error("Hapus atau pindahkan subkategori terlebih dahulu");

    await CategoryRepository.delete(id);

    return true;
  }
}

module.exports = new CategoryService();
