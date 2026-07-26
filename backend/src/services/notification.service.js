"use strict";

const notificationRepository = require("../repositories/notification.repository");

class NotificationService {
  async create(payload, transaction = null) {
    return notificationRepository.create(payload, transaction);
  }

  async bulkCreate(payload, transaction = null) {
    return notificationRepository.bulkCreate(payload, transaction);
  }

  async findAll(query) {
    return notificationRepository.findAll(query);
  }

  async findById(id) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  }

  async markAsRead(id) {
    await this.findById(id);

    await notificationRepository.markAsRead(id);

    return notificationRepository.findById(id);
  }

  async markAllAsRead(payload) {
    await notificationRepository.markAllAsRead(payload);

    return {
      message: "All notifications marked as read",
    };
  }

  async countUnread(payload) {
    const total = await notificationRepository.countUnread(payload);

    return {
      unread: total,
    };
  }

  async delete(id) {
    await this.findById(id);

    await notificationRepository.delete(id);

    return {
      message: "Notification deleted successfully",
    };
  }

  async deleteOld(days = 30) {
    const total = await notificationRepository.deleteOld(days);

    return {
      deleted: total,
    };
  }
}

module.exports = new NotificationService();
