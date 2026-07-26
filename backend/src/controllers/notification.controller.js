"use strict";

const notificationService = require("../services/notification.service");
const ResponseHelper = require("../helpers/response.helper");

class NotificationController {
  async create(req, res, next) {
    try {
      const result = await notificationService.create(req.body);

      return ResponseHelper.success(
        res,
        result,
        "Notification created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const result = await notificationService.findAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Notifications retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const result = await notificationService.findById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Notification retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const result = await notificationService.markAsRead(req.params.id);

      return ResponseHelper.success(res, result, "Notification marked as read");
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.body);

      return ResponseHelper.success(
        res,
        result,
        "All notifications marked as read",
      );
    } catch (error) {
      next(error);
    }
  }

  async countUnread(req, res, next) {
    try {
      const result = await notificationService.countUnread(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Unread notification count retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await notificationService.delete(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Notification deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteOld(req, res, next) {
    try {
      const days = req.query.days || 30;

      const result = await notificationService.deleteOld(days);

      return ResponseHelper.success(
        res,
        result,
        "Old notifications deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
