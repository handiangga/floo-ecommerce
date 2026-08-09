const { HomepageCraftsmanship } = require("../../models");

class HomepageCraftsmanshipRepository {
  find() { return HomepageCraftsmanship.findOne({ order: [["id", "ASC"]] }); }
  create(payload) { return HomepageCraftsmanship.create(payload); }
  async update(id, payload) { await HomepageCraftsmanship.update(payload, { where: { id } }); return this.find(); }
}

module.exports = new HomepageCraftsmanshipRepository();
