const { Collection } = require("../../models");
class CollectionRepository {
  findAll() { return Collection.findAll({ order: [["sort_order", "ASC"], ["name", "ASC"]] }); }
  findById(id) { return Collection.findByPk(id); }
  findBySlug(slug) { return Collection.findOne({ where: { slug } }); }
  create(payload) { return Collection.create(payload); }
  async update(id, payload) { await Collection.update(payload, { where: { id } }); return this.findById(id); }
  remove(id) { return Collection.destroy({ where: { id } }); }
}
module.exports = new CollectionRepository();
