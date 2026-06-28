const SizeRepository = require("../repositories/size.repository");
const PaginationHelper = require("../helpers/pagination.helper");

class SizeService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await SizeRepository.findAll({
      limit,
      offset,
      search: query.search || "",
      status: query.status,
      sort: query.sort || "sort_order",
      order: query.order || "ASC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const size = await SizeRepository.findById(id);

    if (!size) {
      throw new Error("Size not found");
    }

    return size;
  }

  async create(payload) {
    const exist = await SizeRepository.findByName(payload.name);

    if (exist) {
      throw new Error("Size already exists");
    }

    return SizeRepository.create(payload);
  }

  async update(id, payload) {
    const size = await SizeRepository.findById(id);

    if (!size) {
      throw new Error("Size not found");
    }

    if (payload.name) {
      const exist = await SizeRepository.findByName(payload.name);

      if (exist && Number(exist.id) !== Number(id)) {
        throw new Error("Size already exists");
      }
    }

    return SizeRepository.update(id, payload);
  }

  async delete(id) {
    const size = await SizeRepository.findById(id);

    if (!size) {
      throw new Error("Size not found");
    }

    await SizeRepository.delete(id);

    return true;
  }
}

module.exports = new SizeService();
