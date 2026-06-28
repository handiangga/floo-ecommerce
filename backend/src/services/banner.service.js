const BannerRepository = require("../repositories/banner.repository");
const PaginationHelper = require("../helpers/pagination.helper");

class BannerService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await BannerRepository.findAll({
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
    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    return banner;
  }

  async create(payload) {
    return BannerRepository.create(payload);
  }

  async update(id, payload) {
    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    return BannerRepository.update(id, payload);
  }

  async delete(id) {
    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    await BannerRepository.delete(id);

    return true;
  }
}

module.exports = new BannerService();
