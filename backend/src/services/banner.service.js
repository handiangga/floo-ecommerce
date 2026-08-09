const BannerRepository = require("../repositories/banner.repository");
const PaginationHelper = require("../helpers/pagination.helper");
const SupabaseService = require("./supabase.service");
const ImageHelper = require("../helpers/image.helper");

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

  async create(payload, file) {
    if (file) {
      const uploaded = await SupabaseService.upload(await ImageHelper.banner(file), "banners");
      payload.image = uploaded.public_url;
    }
    return BannerRepository.create(payload);
  }

  async update(id, payload, file) {
    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    if (file) {
      const uploaded = await SupabaseService.upload(await ImageHelper.banner(file), "banners");
      payload.image = uploaded.public_url;
    }
    const updated = await BannerRepository.update(id, payload);

    if (file && banner.image && banner.image !== payload.image) {
      try {
        await SupabaseService.removeByPublicUrl(banner.image);
      } catch (error) {
        console.error("Failed to remove replaced banner image:", error.message);
      }
    }

    return updated;
  }

  async delete(id) {
    const banner = await BannerRepository.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    await BannerRepository.delete(id);

    if (banner.image) {
      try {
        await SupabaseService.removeByPublicUrl(banner.image);
      } catch (error) {
        console.error("Failed to remove deleted banner image:", error.message);
      }
    }

    return true;
  }
}

module.exports = new BannerService();
