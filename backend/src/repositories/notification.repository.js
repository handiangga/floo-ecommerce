"use strict";

const { Notification, Customer, User } = require("../../models");

const { Op } = require("sequelize");

class NotificationRepository {
  async create(payload, transaction = null) {
    return Notification.create(payload, {
      transaction,
    });
  }

  async bulkCreate(payload, transaction = null) {
    return Notification.bulkCreate(payload, {
      transaction,
    });
  }

  async findById(id) {
    return Notification.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });
  }

  async findAll({ page = 1, limit = 10, customer_id, user_id, is_read, type }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (customer_id) where.customer_id = customer_id;

    if (user_id) where.user_id = user_id;

    if (typeof is_read !== "undefined") {
      where.is_read = is_read;
    }

    if (type) where.type = type;

    return Notification.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });
  }

  async countUnread({ customer_id, user_id }) {
    const where = {
      is_read: false,
    };

    if (customer_id) {
      where.customer_id = customer_id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    return Notification.count({
      where,
    });
  }

  async markAsRead(id, transaction = null) {
    return Notification.update(
      {
        is_read: true,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
  }

  async markAllAsRead({ customer_id, user_id }) {
    const where = {
      is_read: false,
    };

    if (customer_id) {
      where.customer_id = customer_id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    return Notification.update(
      {
        is_read: true,
      },
      {
        where,
      },
    );
  }

  async delete(id, transaction = null) {
    return Notification.destroy({
      where: {
        id,
      },
      transaction,
    });
  }

  async deleteOld(days = 30) {
    return Notification.destroy({
      where: {
        createdAt: {
          [Op.lt]: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
    });
  }
}

module.exports = new NotificationRepository();
