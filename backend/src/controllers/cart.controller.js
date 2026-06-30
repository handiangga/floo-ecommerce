const CartService = require("../services/cart.service");
const ResponseHelper = require("../helpers/response.helper");

class CartController {
  async index(req, res, next) {
    try {
      const result = await CartService.getCart(req.customer.id);

      return ResponseHelper.success(res, result, "Cart retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async addItem(req, res, next) {
    try {
      const result = await CartService.addItem(req.customer.id, req.body);

      return ResponseHelper.created(res, result, "Product added to cart");
    } catch (err) {
      next(err);
    }
  }

  async updateQty(req, res, next) {
    try {
      const result = await CartService.updateQty(
        req.customer.id,
        req.params.id,
        req.body.qty,
      );

      return ResponseHelper.updated(res, result, "Cart updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async toggleSelected(req, res, next) {
    try {
      const result = await CartService.toggleSelected(
        req.customer.id,
        req.params.id,
      );

      return ResponseHelper.updated(
        res,
        result,
        "Cart item updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      await CartService.removeItem(req.customer.id, req.params.id);

      return ResponseHelper.deleted(res, "Item removed from cart");
    } catch (err) {
      next(err);
    }
  }

  async clear(req, res, next) {
    try {
      await CartService.clear(req.customer.id);

      return ResponseHelper.deleted(res, "Cart cleared successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
