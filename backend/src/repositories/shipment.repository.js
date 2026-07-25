"use strict";

const { Op } = require("sequelize");

const { Shipment, Order } = require("../../models");

class ShipmentRepository {
  async findAll({
    limit,
    offset,
    status,
    courier,
    search = "",
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (status) {
      where.status = status;
    }

    if (courier) {
      where.courier = courier;
    }

    if (search) {
      where[Op.or] = [
        {
          tracking_number: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          courier: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          service: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return Shipment.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      limit,
      offset,
      order: [[sort, order]],
      distinct: true,
    });
  }

  async findById(id, transaction = null) {
    return Shipment.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });
  }

  async findByOrder(order_id) {
    return Shipment.findOne({
      where: {
        order_id,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async findByTrackingNumber(tracking_number) {
    return Shipment.findOne({
      where: {
        tracking_number,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async create(payload, transaction = null) {
    return Shipment.create(payload, {
      transaction,
    });
  }

  async update(id, payload, transaction = null) {
    await Shipment.update(payload, {
      where: {
        id,
      },
      transaction,
    });

    return this.findById(id);
  }

  async delete(id, transaction = null) {
    return Shipment.destroy({
      where: {
        id,
      },
      transaction,
    });
  }
  async findByStatus(status) {
    return Shipment.findAll({
      where: {
        status,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async findDeliveredToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return Shipment.findAll({
      where: {
        delivered_at: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async findPending() {
    return Shipment.findAll({
      where: {
        status: "PENDING",
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async findShipped() {
    return Shipment.findAll({
      where: {
        status: "SHIPPED",
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }

  async findByTrackingAndCourier(tracking_number, courier) {
    return Shipment.findOne({
      where: {
        tracking_number,
        courier,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });
  }
}

module.exports = new ShipmentRepository();
