const {
  Cart,
  CartItem,
  ProductVariant,
  Product,
  ProductImage,
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
                  include: [
                    {
                      model: ProductImage,
                      as: "images",
                      attributes: ["id", "image", "alt", "is_primary", "sort_order"],
                      separate: true,
                      order: [
                        ["is_primary", "DESC"],
                        ["sort_order", "ASC"],
                      ],
                    },
                  ],
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
