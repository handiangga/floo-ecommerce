"use strict";

const { Payment, Order } = require("../../models");
const { Op } = require("sequelize");

class PaymentRepository {
  async findAll({
    limit,
    offset,
    status,
    method,
    provider,
    search = "",
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (status) {
      where.status = status;
    }

    if (method) {
      where.method = method;
    }

    if (provider) {
      where.provider = provider;
    }

    if (search) {
      where[Op.or] = [
        {
          transaction_id: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          payment_code: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return Payment.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      limit,
      offset,
      distinct: true,
      order: [[sort, order]],
    });
  }

  async findById(id, transaction = null) {
    return Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });
  }

  async findByOrder(order_id, transaction = null) {
    return Payment.findOne({
      where: { order_id },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });
  }

  async findByTransactionId(transaction_id, transaction = null) {
    return Payment.findOne({
      where: {
        transaction_id,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });
  }

  async findBySnapToken(snap_token, transaction = null) {
    return Payment.findOne({
      where: {
        snap_token,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });
  }

  async findExpired(transaction = null) {
    return Payment.findAll({
      where: {
        status: "PENDING",
        expired_at: {
          [Op.lte]: new Date(),
        },
      },
      transaction,
    });
  }

  async create(payload, transaction = null) {
    return Payment.create(payload, {
      transaction,
    });
  }

  async update(id, payload, transaction = null) {
    await Payment.update(payload, {
      where: {
        id,
      },
      transaction,
    });

    return this.findById(id, transaction);
  }

  async updateStatus(id, status, transaction = null) {
    return this.update(id, { status }, transaction);
  }

  async findPending(transaction = null) {
    return Payment.findAll({
      where: {
        status: "PENDING",
      },
      transaction,
    });
  }

  async delete(id, transaction = null) {
    return Payment.destroy({
      where: {
        id,
      },
      transaction,
    });
  }
}

module.exports = new PaymentRepository();
