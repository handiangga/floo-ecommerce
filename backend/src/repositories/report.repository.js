"use strict";

const {
  Order,
  OrderItem,
  Customer,
  Product,
  ProductVariant,
  Payment,
} = require("../../models");

const { Op, fn, col, literal } = require("sequelize");

const ORDER_STATUS = require("../constants/orderStatus");

class ReportRepository {
  async getSalesReport(startDate, endDate) {
    const where = {
      status: ORDER_STATUS.COMPLETED,
    };

    if (startDate && endDate) {
      where.completed_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    const orders = await Order.findAll({
      attributes: [
        "id",
        "invoice",
        "subtotal",
        "shipping_cost",
        "discount",
        "total",
        "payment_method",
        "status",
        "completed_at",
        "createdAt",
      ],
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [["completed_at", "DESC"]],
    });

    const summary = await Order.findOne({
      attributes: [
        [fn("COUNT", col("id")), "total_orders"],
        [fn("SUM", col("total")), "total_revenue"],
        [fn("AVG", col("total")), "average_order"],
      ],
      where,
      raw: true,
    });

    return {
      summary: {
        total_orders: Number(summary.total_orders || 0),
        total_revenue: Number(summary.total_revenue || 0),
        average_order: Math.round(Number(summary.average_order || 0)),
      },
      orders,
    };
  }

  async getCustomerReport(startDate, endDate) {
    const where = {
      status: ORDER_STATUS.COMPLETED,
    };

    if (startDate && endDate) {
      where.completed_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return Customer.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        [fn("COUNT", col("orders.id")), "total_orders"],
        [fn("SUM", col("orders.total")), "total_spent"],
      ],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [],
          required: false,
          where,
        },
      ],
      group: ["Customer.id"],
      order: [[literal("total_spent"), "DESC"]],
      raw: true,
    });
  }
  async getProductReport(startDate, endDate) {
    const orderWhere = {
      status: ORDER_STATUS.COMPLETED,
    };

    if (startDate && endDate) {
      orderWhere.completed_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return OrderItem.findAll({
      attributes: [
        "product_variant_id",
        "product_name",
        "sku",
        [fn("SUM", col("OrderItem.qty")), "total_qty"],
        [fn("SUM", col("OrderItem.subtotal")), "total_revenue"],
      ],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: orderWhere,
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "stock"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "slug"],
            },
          ],
        },
      ],
      group: [
        "OrderItem.product_variant_id",
        "OrderItem.product_name",
        "OrderItem.sku",
        "variant.id",
        "variant.stock",
        "variant->product.id",
      ],
      order: [[literal("total_qty"), "DESC"]],
    });
  }

  async getPaymentReport(startDate, endDate) {
    const where = {
      status: ORDER_STATUS.COMPLETED,
    };

    if (startDate && endDate) {
      where.completed_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return Order.findAll({
      attributes: [
        "payment_method",
        [fn("COUNT", col("id")), "total_orders"],
        [fn("SUM", col("total")), "total_revenue"],
      ],
      where,
      group: ["payment_method"],
      order: [[literal("total_revenue"), "DESC"]],
      raw: true,
    });
  }

  async getOrderStatusReport(startDate, endDate) {
    const where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    return Order.findAll({
      attributes: ["status", [fn("COUNT", col("id")), "total_orders"]],
      where,
      group: ["status"],
      order: [["status", "ASC"]],
      raw: true,
    });
  }
}

module.exports = new ReportRepository();
