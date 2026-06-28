const SizeService = require("../services/size.service");
const ResponseHelper = require("../helpers/response.helper");

class SizeController {
  async index(req, res, next) {
    try {
      const result = await SizeService.getAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Sizes retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await SizeService.getById(req.params.id);

      return ResponseHelper.success(res, result, "Size retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await SizeService.create(req.body);

      return ResponseHelper.created(res, result, "Size created successfully");
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await SizeService.update(req.params.id, req.body);

      return ResponseHelper.success(res, result, "Size updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await SizeService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Size deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SizeController();
