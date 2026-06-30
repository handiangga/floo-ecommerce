const ProductVariantService = require("../services/product-variant.service");
const ResponseHelper = require("../helpers/response.helper");

class ProductVariantController {
  async index(req, res, next) {
    try {
      const result = await ProductVariantService.getAll(req.query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Product variants retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await ProductVariantService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Product variant retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async showByProduct(req, res, next) {
    try {
      const result = await ProductVariantService.getByProduct(
        req.params.productId,
      );

      return ResponseHelper.success(
        res,
        result,
        "Product variants retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await ProductVariantService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Product variant created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await ProductVariantService.update(
        req.params.id,
        req.body,
      );

      return ResponseHelper.updated(
        res,
        result,
        "Product variant updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await ProductVariantService.delete(req.params.id);

      return ResponseHelper.deleted(
        res,
        "Product variant deleted successfully",
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductVariantController();
