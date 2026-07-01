"use strict";

const {
  Order,
  Customer,
  Address,
  OrderItem,
  ProductVariant,
  Payment,
  Shipment,
  Voucher,
} = require("../../models");

const { Op } = require("sequelize");

class OrderRepository {
  async findAll({
    limit,
    offset,
    customer_id,
    status,
    search = "",
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (customer_id) {
      where.customer_id = customer_id;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        {
          invoice: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          receiver_name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          receiver_phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return Order.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: Voucher,
          as: "voucher",
        },
        {
          model: Payment,
          as: "payment",
        },
        {
          model: Shipment,
          as: "shipment",
        },
      ],
      limit,
      offset,
      distinct: true,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: Voucher,
          as: "voucher",
        },
        {
          model: Payment,
          as: "payment",
        },
        {
          model: Shipment,
          as: "shipment",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: ProductVariant,
              as: "variant",
            },
          ],
        },
      ],
    });
  }

  async findByInvoice(invoice) {
    return Order.findOne({
      where: {
        invoice,
      },
    });
  }

  async findByCustomer(customer_id) {
    return Order.findAll({
      where: {
        customer_id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async create(payload, transaction = null) {
    return Order.create(payload, {
      transaction,
    });
  }

  async update(id, payload, transaction = null) {
    await Order.update(payload, {
      where: {
        id,
      },
      transaction,
    });

    return this.findById(id);
  }

  async delete(id, transaction = null) {
    return Order.destroy({
      where: {
        id,
      },
      transaction,
    });
  }
}

module.exports = new OrderRepository();
