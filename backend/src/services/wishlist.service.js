const WishlistRepository = require("../repositories/wishlist.repository");
const CustomerRepository = require("../repositories/customer.repository");
const ProductRepository = require("../repositories/product.repository");

class WishlistService {
  async getAll(customer_id) {
    const customer = await CustomerRepository.findById(customer_id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return WishlistRepository.findAll(customer_id);
  }

  async create(payload) {
    const customer = await CustomerRepository.findById(payload.customer_id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const product = await ProductRepository.findById(payload.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    const duplicate = await WishlistRepository.findDuplicate(
      payload.customer_id,
      payload.product_id,
    );

    if (duplicate) {
      throw new Error("Product already exists in wishlist");
    }

    return WishlistRepository.create(payload);
  }

  async delete(customer_id, product_id) {
    const wishlist = await WishlistRepository.findDuplicate(
      customer_id,
      product_id,
    );

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    await WishlistRepository.delete(customer_id, product_id);

    return true;
  }
}

module.exports = new WishlistService();
