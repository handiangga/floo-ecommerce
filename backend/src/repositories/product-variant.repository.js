const { ProductVariant, Product, Color, Size } = require("../../models");

const { Op } = require("sequelize");

class ProductVariantRepository {
  async findAll({
    limit,
    offset,
    product_id,
    color_id,
    size_id,
    is_ready_stock,
    status,
    search = "",
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (product_id) {
      where.product_id = product_id;
    }

    if (color_id) {
      where.color_id = color_id;
    }

    if (size_id) {
      where.size_id = size_id;
    }

    if (is_ready_stock !== undefined) {
      where.is_ready_stock = is_ready_stock;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        {
          sku: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          barcode: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return ProductVariant.findAndCountAll({
      where,
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
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return ProductVariant.findByPk(id, {
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
    });
  }

  async findByProduct(product_id) {
    return ProductVariant.findAll({
      where: {
        product_id,
      },
      include: [
        {
          model: Color,
          as: "color",
        },
        {
          model: Size,
          as: "size",
        },
      ],
      order: [
        ["color_id", "ASC"],
        ["size_id", "ASC"],
      ],
    });
  }

  async findDuplicate(product_id, color_id, size_id) {
    return ProductVariant.findOne({
      where: {
        product_id,
        color_id,
        size_id,
      },
    });
  }

  async findDuplicateExcept(id, product_id, color_id, size_id) {
    return ProductVariant.findOne({
      where: {
        product_id,
        color_id,
        size_id,
        id: {
          [Op.ne]: id,
        },
      },
    });
  }

  async findBySku(sku) {
    return ProductVariant.findOne({
      where: {
        sku,
      },
    });
  }

  async create(payload) {
    return ProductVariant.create(payload);
  }

  async update(id, payload) {
    await ProductVariant.update(payload, {
      where: {
        id,
      },
    });

    return this.findById(id);
  }

  async delete(id) {
    return ProductVariant.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new ProductVariantRepository();
