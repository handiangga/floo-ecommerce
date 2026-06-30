const CartRepository = require("../repositories/cart.repository");
const CartItemRepository = require("../repositories/cart-item.repository");

const CustomerRepository = require("../repositories/customer.repository");
const ProductVariantRepository = require("../repositories/product-variant.repository");

class CartService {
  async getCart(customer_id) {
    const customer = await CustomerRepository.findById(customer_id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    let cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      cart = await CartRepository.create(customer_id);
      cart = await CartRepository.findByCustomer(customer_id);
    }

    let subtotal = 0;
    let total_item = 0;

    let selected_subtotal = 0;
    let selected_item = 0;

    cart.items.forEach((item) => {
      const itemSubtotal = item.qty * item.price;

      subtotal += itemSubtotal;
      total_item += item.qty;

      if (item.selected) {
        selected_subtotal += itemSubtotal;
        selected_item += item.qty;
      }
    });

    return {
      cart,
      summary: {
        total_item,
        subtotal,
        selected_item,
        selected_subtotal,
      },
    };
  }

  async addItem(customer_id, payload) {
    let cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      cart = await CartRepository.create(customer_id);

      cart = await CartRepository.findByCustomer(customer_id);
    }

    const variant = await ProductVariantRepository.findById(
      payload.product_variant_id,
    );

    if (!variant) {
      throw new Error("Product variant not found");
    }

    if (payload.qty > variant.stock) {
      throw new Error("Stock is not enough");
    }

    const item = await CartItemRepository.findByVariant(
      cart.id,
      payload.product_variant_id,
    );

    if (item) {
      const newQty = item.qty + payload.qty;

      if (newQty > variant.stock) {
        throw new Error("Stock is not enough");
      }

      return CartItemRepository.update(item.id, {
        qty: newQty,
      });
    }

    return CartItemRepository.create({
      cart_id: cart.id,
      product_variant_id: payload.product_variant_id,
      qty: payload.qty,
      price: variant.discount_price ?? variant.price,
      selected: true,
    });
  }

  async updateQty(customer_id, item_id, qty) {
    const cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await CartItemRepository.findById(item_id);

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (item.cart_id !== cart.id) {
      throw new Error("Forbidden");
    }

    const variant = await ProductVariantRepository.findById(
      item.product_variant_id,
    );

    if (!variant) {
      throw new Error("Product variant not found");
    }

    if (qty < 1) {
      throw new Error("Minimum quantity is 1");
    }

    if (qty > variant.stock) {
      throw new Error("Stock is not enough");
    }

    return CartItemRepository.update(item.id, {
      qty,
    });
  }

  async toggleSelected(customer_id, item_id) {
    const cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await CartItemRepository.findById(item_id);

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (item.cart_id !== cart.id) {
      throw new Error("Forbidden");
    }

    return CartItemRepository.update(item.id, {
      selected: !item.selected,
    });
  }

  async removeItem(customer_id, item_id) {
    const cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await CartItemRepository.findById(item_id);

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (item.cart_id !== cart.id) {
      throw new Error("Forbidden");
    }

    await CartItemRepository.delete(item_id);

    return true;
  }

  async clear(customer_id) {
    const cart = await CartRepository.findByCustomer(customer_id);

    if (!cart) {
      throw new Error("Cart not found");
    }

    await CartItemRepository.clear(cart.id);

    return true;
  }
}

module.exports = new CartService();
