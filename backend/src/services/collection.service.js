const Repository = require("../repositories/collection.repository");
const SlugHelper = require("../helpers/slug.helper");
class CollectionService {
  getAll() { return Repository.findAll(); }
  async create(payload) { const slug = SlugHelper.generate(payload.name); if (await Repository.findBySlug(slug)) throw new Error("Collection already exists"); return Repository.create({ ...payload, slug }); }
  async update(id, payload) { const item = await Repository.findById(id); if (!item) throw new Error("Collection not found"); if (payload.name && payload.name !== item.name) payload.slug = SlugHelper.generate(payload.name); return Repository.update(id, payload); }
  async remove(id) { if (!await Repository.findById(id)) throw new Error("Collection not found"); return Repository.remove(id); }
}
module.exports = new CollectionService();
