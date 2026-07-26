"use strict";
const {
  Order,
  Customer,
  Product,
  ProductVariant,
  Payment,
} = require("../../models");

const { Op, fn, col, literal } = require("sequelize");

const ORDER_STATUS = require("../constants/orderStatus");
const PRODUCT_STATUS = require("../constants/productStatus");

class DashboardRepository {
  async getOverview() {
    const today = new Date();

    const startToday = new Date(today);
    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);

    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      revenueToday,
      revenueMonth,
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      expiredOrders,
      totalCustomers,
      totalProducts,
      totalVariants,
      lowStock,
    ] = await Promise.all([
      Order.sum("total", {
        where: {
          status: ORDER_STATUS.COMPLETED,
          completed_at: {
            [Op.between]: [startToday, endToday],
          },
        },
      }),

      Order.sum("total", {
        where: {
          status: ORDER_STATUS.COMPLETED,
          completed_at: {
            [Op.gte]: startMonth,
          },
        },
      }),

      Order.count(),

      Order.count({
        where: {
          status: ORDER_STATUS.WAITING_PAYMENT,
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUS.PROCESSING,
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUS.COMPLETED,
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUS.CANCELLED,
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUS.EXPIRED,
        },
      }),

      Customer.count(),

      Product.count(),

      ProductVariant.count(),

      ProductVariant.count({
        where: {
          stock: {
            [Op.lte]: 5,
          },
        },
      }),
    ]);

    return {
      revenue_today: revenueToday || 0,
      revenue_month: revenueMonth || 0,

      total_orders: totalOrders,

      pending_orders: pendingOrders,

      processing_orders: processingOrders,

      completed_orders: completedOrders,

      cancelled_orders: cancelledOrders,

      expired_orders: expiredOrders,

      total_customers: totalCustomers,

      total_products: totalProducts,

      total_variants: totalVariants,

      low_stock_products: lowStock,
    };
  }

  async getRevenueChart(year) {
    const data = await Order.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("completed_at")), "month"],
        [fn("SUM", col("total")), "revenue"],
      ],
      where: {
        status: ORDER_STATUS.COMPLETED,
        completed_at: {
          [Op.between]: [
            new Date(year, 0, 1),
            new Date(year, 11, 31, 23, 59, 59, 999),
          ],
        },
      },
      group: [literal("DATE_TRUNC('month', \"completed_at\")")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    return data;
  }

  async getOrderStatistics() {
    const statuses = [
      ORDER_STATUS.WAITING_PAYMENT,
      ORDER_STATUS.PAID,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.EXPIRED,
    ];

    const result = {};

    await Promise.all(
      statuses.map(async (status) => {
        result[status.toLowerCase()] = await Order.count({
          where: {
            status,
          },
        });
      }),
    );

    return result;
  }

  async getTopProducts(limit = 10) {
    return Product.findAll({
      attributes: ["id", "name", "slug", "sold_count", "view_count"],
      where: {
        status: PRODUCT_STATUS.ACTIVE,
      },
      order: [["sold_count", "DESC"]],
      limit,
    });
  }

  async getRecentOrders(limit = 10) {
    return Order.findAll({
      attributes: ["id", "invoice", "status", "total", "createdAt"],
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["payment_method", "status", "paid_at"],
        },
      ],
      limit,
      order: [["createdAt", "DESC"]],
    });
  }

  async getLowStockProducts(limit = 10) {
    const LOW_STOCK_LIMIT = 5;
    return ProductVariant.findAll({
      where: {
        stock: {
          [Op.lte]: LOW_STOCK_LIMIT,
        },
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug"],
        },
      ],
      limit,
      order: [["stock", "ASC"]],
    });
  }

  async getRecentCustomers(limit = 10) {
    return Customer.findAll({
      attributes: ["id", "name", "email", "phone", "createdAt"],
      limit,
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = new DashboardRepository();
