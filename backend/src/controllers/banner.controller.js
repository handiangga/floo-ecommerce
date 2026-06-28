const BannerService = require("../services/banner.service");
const ResponseHelper = require("../helpers/response.helper");

class BannerController {
  async index(req, res, next) {
    try {
      const result = await BannerService.getAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Banners retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await BannerService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Banner retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await BannerService.create(req.body);

      return ResponseHelper.created(res, result, "Banner created successfully");
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await BannerService.update(req.params.id, req.body);

      return ResponseHelper.success(res, result, "Banner updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await BannerService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Banner deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BannerController();
