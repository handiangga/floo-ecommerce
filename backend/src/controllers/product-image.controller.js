const ProductImageService = require("../services/product-image.service");
const ResponseHelper = require("../helpers/response.helper");

class ProductImageController {
  async index(req, res, next) {
    try {
      const result = await ProductImageService.getAll(
        req.params.productId,
      );

      return ResponseHelper.success(
        res,
        result,
        "Product images retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await ProductImageService.create(
        req.body,
      );

      return ResponseHelper.created(
        res,
        result,
        "Product image created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await ProductImageService.delete(req.params.id);

      return ResponseHelper.deleted(
        res,
        "Product image deleted successfully",
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductImageController();