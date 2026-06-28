const CategoryService = require("../services/category.service");
const ResponseHelper = require("../helpers/response.helper");

class CategoryController {
  async index(req, res, next) {
    try {
      const result = await CategoryService.findAll(req.query);

      return ResponseHelper.pagination(res, result.data, result.meta);
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const category = await CategoryService.findById(req.params.id);

      if (!category) {
        return ResponseHelper.notFound(res, "Category not found");
      }

      return ResponseHelper.success(res, category);
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);

      return ResponseHelper.created(
        res,
        category,
        "Category created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);

      return ResponseHelper.updated(
        res,
        category,
        "Category updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);

      return ResponseHelper.deleted(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
