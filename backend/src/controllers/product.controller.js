const ProductService = require("../services/product.service");
const ResponseHelper = require("../helpers/response.helper");

class ProductController {
  async index(req, res, next) {
    try {
      const result = await ProductService.getAll(req.query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Products retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await ProductService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Product retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async showBySlug(req, res, next) {
    try {
      const result = await ProductService.getBySlug(req.params.slug);

      return ResponseHelper.success(
        res,
        result,
        "Product retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await ProductService.create(req.body, req.file);

      return ResponseHelper.created(
        res,
        result,
        "Product created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await ProductService.update(
        req.params.id,
        req.body,
        req.file,
        );

      return ResponseHelper.updated(
        res,
        result,
        "Product updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await ProductService.delete(req.params.id);

      return ResponseHelper.deleted(res, "Product deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
