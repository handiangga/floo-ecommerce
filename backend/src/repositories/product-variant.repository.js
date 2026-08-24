const {
  ProductVariant,
  Product,
  Color,
  Size,
  sequelize,
} = require("../../models");
const { Op, Transaction } = require("sequelize");
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

  async findById(id, transaction = null, lock = false) {
    const variant = await ProductVariant.findByPk(id, {
      transaction,
      lock: lock ? Transaction.LOCK.UPDATE : undefined,
    });

    if (!variant) {
      return null;
    }

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
      transaction,
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
    try {
      return await ProductVariant.create(payload);
    } catch (error) {
      if (!this.isPrimaryKeyCollision(error)) throw error;
      await this.syncPrimaryKeySequence();
      return ProductVariant.create(payload);
    }
  }

  isPrimaryKeyCollision(error) {
    return error?.name === "SequelizeUniqueConstraintError"
      && (error.parent?.constraint === "ProductVariants_pkey"
        || error.errors?.some((item) => item.path === "id"));
  }

  async syncPrimaryKeySequence() {
    await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('"ProductVariants"', 'id'),
        COALESCE((SELECT MAX("id") FROM "ProductVariants"), 1),
        EXISTS(SELECT 1 FROM "ProductVariants")
      );
    `);
  }

  async update(id, payload, transaction = null) {
    await ProductVariant.update(payload, {
      where: {
        id,
      },
      transaction,
    });

    return this.findById(id, transaction);
  }

  async findDuplicateOptionKey(product_id, option_key, exceptId = null) {
    const where = { product_id, option_key };
    if (exceptId) where.id = { [Op.ne]: exceptId };
    return ProductVariant.findOne({ where });
  }
  async updateByProduct(product_id, payload) {
    return ProductVariant.update(payload, { where: { product_id } });
  }

  async delete(id) {
    return ProductVariant.destroy({
      where: {
        id,
      },
    });
  }
  async decreaseStock(id, qty, transaction) {
    const variant = await this.findById(id, transaction, true);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    if (variant.stock < qty) {
      throw new Error(
        `${variant.product.name} (${variant.color.name}/${variant.size.name}) stock is insufficient`,
      );
    }

    await variant.update(
      {
        stock: variant.stock - qty,
      },
      {
        transaction,
      },
    );

    return variant;
  }
  async increaseStock(id, qty, transaction) {
    const variant = await this.findById(id, transaction, true);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    await variant.update(
      {
        stock: variant.stock + qty,
      },
      {
        transaction,
      },
    );

    return variant;
  }
}

module.exports = new ProductVariantRepository();
