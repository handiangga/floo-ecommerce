const ColorService = require("../services/color.service");
const ResponseHelper = require("../helpers/response.helper");

class ColorController {
  async index(req, res, next) {
    try {
      const result = await ColorService.getAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Colors retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await ColorService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Color retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await ColorService.create(req.body);

      return ResponseHelper.created(res, result, "Color created successfully");
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await ColorService.update(req.params.id, req.body);

      return ResponseHelper.success(res, result, "Color updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await ColorService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Color deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ColorController();
