const { Wishlist, Product, Category, ProductImage } = require("../../models");

class WishlistRepository {
  async findAll(customer_id) {
    return Wishlist.findAll({
      where: {
        customer_id,
      },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Category,
              as: "category",
            },
            {
              model: ProductImage,
              as: "images",
              required: false,
              where: {
                is_primary: true,
              },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id) {
    return Wishlist.findByPk(id);
  }

  async findDuplicate(customer_id, product_id) {
    return Wishlist.findOne({
      where: {
        customer_id,
        product_id,
      },
    });
  }

  async create(payload) {
    return Wishlist.create(payload);
  }

  async delete(customer_id, product_id) {
    return Wishlist.destroy({
      where: {
        customer_id,
        product_id,
      },
    });
  }
}

module.exports = new WishlistRepository();
