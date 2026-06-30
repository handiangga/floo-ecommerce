const WishlistService = require("../services/wishlist.service");
const ResponseHelper = require("../helpers/response.helper");

class WishlistController {
  async index(req, res, next) {
    try {
      const result = await WishlistService.getAll(req.customer.id);

      return ResponseHelper.success(
        res,
        result,
        "Wishlist retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      req.body.customer_id = req.customer.id;

      const result = await WishlistService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Product added to wishlist",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await WishlistService.delete(
        req.customer.id,
        req.params.productId,
      );

      return ResponseHelper.deleted(
        res,
        "Product removed from wishlist",
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WishlistController();