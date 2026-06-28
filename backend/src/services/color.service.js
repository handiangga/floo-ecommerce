const ColorRepository = require("../repositories/color.repository");
const PaginationHelper = require("../helpers/pagination.helper");

class ColorService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await ColorRepository.findAll({
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
    const color = await ColorRepository.findById(id);

    if (!color) {
      throw new Error("Color not found");
    }

    return color;
  }

  async create(payload) {
    const exist = await ColorRepository.findByName(payload.name);

    if (exist) {
      throw new Error("Color already exists");
    }

    return ColorRepository.create(payload);
  }

  async update(id, payload) {
    const color = await ColorRepository.findById(id);

    if (!color) {
      throw new Error("Color not found");
    }

    if (payload.name) {
      const exist = await ColorRepository.findByName(payload.name);

      if (exist && Number(exist.id) !== Number(id)) {
        throw new Error("Color already exists");
      }
    }

    return ColorRepository.update(id, payload);
  }

  async delete(id) {
    const color = await ColorRepository.findById(id);

    if (!color) {
      throw new Error("Color not found");
    }

    await ColorRepository.delete(id);

    return true;
  }
}

module.exports = new ColorService();
