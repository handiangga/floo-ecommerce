const {
  Product,
  Category,
  ProductImage,
  ProductVariant,
  Color,
  Size,
} = require("../../models");
const { Op } = require("sequelize");

class ProductRepository {
  async findAll({
    limit,
    offset,
    search = "",
    category_id,
    status,
    is_featured,
    is_best_seller,
    is_new_arrival,
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (status) {
      where.status = status;
    }

    if (is_best_seller !== undefined) {
      where.is_best_seller = is_best_seller;
    }

    if (is_new_arrival !== undefined) {
      where.is_new_arrival = is_new_arrival;
    }

    if (is_featured !== undefined) {
      where.is_featured = is_featured;
    }

    return Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
          separate: true,
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductVariant,
          as: "variants",
          required: false,
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
        },
      ],
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
          separate: true,
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductVariant,
          as: "variants",
          required: false,
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
        },
      ],
    });
  }

  async findBySlug(slug) {
    return Product.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
          separate: true,
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductVariant,
          as: "variants",
          required: false,
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
        },
      ],
    });
  }

  async create(payload) {
    return Product.create(payload);
  }

  async update(id, payload) {
    await Product.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Product.destroy({
      where: { id },
    });
  }
}

module.exports = new ProductRepository();
