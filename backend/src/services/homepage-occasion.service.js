const HomepageOccasionRepository = require("../repositories/homepage-occasion.repository");
const SupabaseService = require("./supabase.service");
const ImageHelper = require("../helpers/image.helper");

class HomepageOccasionService {
  async syncActiveSlots() {
    const all = await HomepageOccasionRepository.findAll({});
    await Promise.all(
      all.map((item, index) =>
        HomepageOccasionRepository.update(item.id, {
          status: index < 4 ? "ACTIVE" : "INACTIVE",
          link: "/products",
        }),
      ),
    );
  }
  getAll(query) { return HomepageOccasionRepository.findAll(query); }
  async getById(id) {
    const item = await HomepageOccasionRepository.findById(id);
    if (!item) throw new Error("Homepage occasion not found");
    return item;
  }
  async create(payload, file) {
    if (file) payload.image = (await SupabaseService.upload(await ImageHelper.product(file), "occasions")).public_url;
    if (!payload.image) throw new Error("Gambar occasion diperlukan");
    payload.link = "/products";
    const created = await HomepageOccasionRepository.create(payload);
    await this.syncActiveSlots();
    return this.getById(created.id);
  }
  async update(id, payload, file) {
    const item = await this.getById(id);
    if (file) payload.image = (await SupabaseService.upload(await ImageHelper.product(file), "occasions")).public_url;
    payload.link = "/products";
    delete payload.status;
    await HomepageOccasionRepository.update(id, payload);
    if (file && item.image && item.image !== payload.image) {
      try { await SupabaseService.removeByPublicUrl(item.image); } catch (error) { console.error("Failed to remove replaced occasion image:", error.message); }
    }
    await this.syncActiveSlots();
    return this.getById(id);
  }
  async delete(id) {
    const item = await this.getById(id);
    await HomepageOccasionRepository.delete(id);
    try { await SupabaseService.removeByPublicUrl(item.image); } catch (error) { console.error("Failed to remove occasion image:", error.message); }
    await this.syncActiveSlots();
    return true;
  }
}

module.exports = new HomepageOccasionService();
