const CategoryService = require("../services/category.service");
const ResponseHelper = require("../helpers/response.helper");

class CategoryController {
  async index(req, res, next) {
    try {
      const result = await CategoryService.getAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Categories retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await CategoryService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Category retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await CategoryService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Category created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await CategoryService.update(req.params.id, req.body);

      return ResponseHelper.success(
        res,
        result,
        "Category updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Category deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
