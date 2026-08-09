const Service = require("../services/homepage-craftsmanship.service");
const ResponseHelper = require("../helpers/response.helper");

class HomepageCraftsmanshipController {
  async show(req, res, next) { try { return ResponseHelper.success(res, await Service.get(), "Craftsmanship retrieved successfully"); } catch (error) { next(error); } }
  async update(req, res, next) {
    try {
      const files = req.files ? Object.values(req.files).flat() : [];
      return ResponseHelper.success(res, await Service.update(req.body, files), "Craftsmanship updated successfully");
    } catch (error) { next(error); }
  }
}

module.exports = new HomepageCraftsmanshipController();
