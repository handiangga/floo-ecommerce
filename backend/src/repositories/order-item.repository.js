"use strict";

const { OrderItem, ProductVariant } = require("../../models");

class OrderItemRepository {
  async findByOrder(order_id) {
    return OrderItem.findAll({
      where: {
        order_id,
      },
      include: [
        {
          model: ProductVariant,
          as: "variant",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  async bulkCreate(items, transaction = null) {
    return OrderItem.bulkCreate(items, {
      transaction,
    });
  }

  async deleteByOrder(order_id, transaction = null) {
    return OrderItem.destroy({
      where: {
        order_id,
      },
      transaction,
    });
  }
}

module.exports = new OrderItemRepository();
