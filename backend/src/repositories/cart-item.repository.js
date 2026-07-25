const { CartItem } = require("../../models");

class CartItemRepository {
  async findByVariant(cart_id, product_variant_id) {
    return CartItem.findOne({
      where: {
        cart_id,
        product_variant_id,
      },
    });
  }

  async create(payload) {
    return CartItem.create(payload);
  }

  async update(id, payload) {
    await CartItem.update(payload, {
      where: { id },
    });

    return CartItem.findByPk(id);
  }

  async delete(id) {
    return CartItem.destroy({
      where: { id },
    });
  }
  async deleteSelected(cart_id, transaction) {
    return CartItem.destroy({
      where: {
        cart_id,
        selected: true,
      },
      transaction,
    });
  }
  async clear(cart_id, transaction = null) {
    return CartItem.destroy({
      where: {
        cart_id,
      },
      transaction,
    });
  }

  async findById(id) {
    return CartItem.findByPk(id);
  }
  static async deleteSelected(cart_id, transaction) {
    return CartItem.destroy({
      where: {
        cart_id,
        selected: true,
      },
      transaction,
    });
  }
}

module.exports = new CartItemRepository();
