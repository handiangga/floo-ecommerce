const {
  Cart,
  CartItem,
  ProductVariant,
  Product,
  Color,
  Size,
} = require("../../models");

class CartRepository {
  async findByCustomer(customer_id) {
    return Cart.findOne({
      where: { customer_id },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: ProductVariant,
              as: "variant",
              include: [
                {
                  model: Product,
                  as: "product",
                },
                {
                  model: Color,
                  as: "color",
                },
                {
                  model: Size,
                  as: "size",
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async create(customer_id) {
    return Cart.create({
      customer_id,
    });
  }
}

module.exports = new CartRepository();
