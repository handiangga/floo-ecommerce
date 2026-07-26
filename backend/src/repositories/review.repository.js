"use strict";

const {
  Review,
  ReviewImage,
  Customer,
  Product,
  OrderItem,
} = require("../../models");

const { Op, fn, col } = require("sequelize");

const REVIEW_STATUS = require("../constants/reviewStatus");

class ReviewRepository {
  async create(payload, transaction = null) {
    return Review.create(payload, { transaction });
  }

  async bulkCreateImages(images, transaction = null) {
    return ReviewImage.bulkCreate(images, {
      transaction,
    });
  }

  async findById(id) {
    return Review.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "photo"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug"],
        },
        {
          model: OrderItem,
          as: "order_item",
          attributes: ["id", "sku", "product_name", "color_name", "size_name"],
        },
        {
          model: ReviewImage,
          as: "images",
          attributes: ["id", "image", "sort_order"],
        },
      ],
    });
  }

  async findAll({ page = 1, limit = 10, status, product_id }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (product_id) where.product_id = product_id;

    return Review.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "photo"],
        },
        {
          model: ReviewImage,
          as: "images",
          attributes: ["id", "image", "sort_order"],
        },
      ],
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  }

  async findByOrderItem(order_item_id) {
    return Review.findOne({
      where: {
        order_item_id,
      },
    });
  }

  async update(id, payload, transaction = null) {
    return Review.update(payload, {
      where: { id },
      transaction,
    });
  }

  async destroyImages(review_id, transaction = null) {
    return ReviewImage.destroy({
      where: {
        review_id,
      },
      transaction,
    });
  }

  async delete(id, transaction = null) {
    return Review.destroy({
      where: {
        id,
      },
      transaction,
    });
  }

  async getSummary(product_id) {
    return Review.findOne({
      attributes: [
        [fn("COUNT", col("id")), "total_review"],
        [fn("AVG", col("rating")), "average_rating"],
      ],
      where: {
        product_id,
        status: REVIEW_STATUS.APPROVED,
      },
      raw: true,
    });
  }

  async getRatingDistribution(product_id) {
    return Review.findAll({
      attributes: ["rating", [fn("COUNT", col("id")), "total"]],
      where: {
        product_id,
        status: REVIEW_STATUS.APPROVED,
      },
      group: ["rating"],
      order: [["rating", "DESC"]],
      raw: true,
    });
  }
}

module.exports = new ReviewRepository();
