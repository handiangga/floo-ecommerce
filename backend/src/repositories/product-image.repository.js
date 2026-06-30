const { ProductImage } = require("../../models");

class ProductImageRepository {
  async findAll(product_id) {
    return ProductImage.findAll({
      where: {
        product_id,
      },
      order: [
        ["is_primary", "DESC"],
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });
  }

  async findById(id) {
    return ProductImage.findByPk(id);
  }

  async create(payload) {
    return ProductImage.create(payload);
  }

  async update(id, payload) {
    await ProductImage.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return ProductImage.destroy({
      where: { id },
    });
  }

  async resetPrimary(product_id, color_id = null) {
    const where = {
      product_id,
    };

    if (color_id !== null && color_id !== undefined) {
      where.color_id = color_id;
    }

    return ProductImage.update(
      {
        is_primary: false,
      },
      {
        where,
      },
    );
  }
}

module.exports = new ProductImageRepository();
