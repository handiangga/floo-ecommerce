"use strict";

const router = require("express").Router();

const authentication = require("../middlewares/authentication");
const validate = require("../middlewares/validation");

const notificationController = require("../controllers/notification.controller");

const {
  createNotificationSchema,
  notificationQuerySchema,
  notificationIdSchema,
  markAllReadSchema,
} = require("../validations/notification.validation");

router.use(authentication);

// Create Notification
router.post(
  "/",
  validate(createNotificationSchema),
  notificationController.create,
);

// Get Notifications
router.get(
  "/",
  validate(notificationQuerySchema, "query"),
  notificationController.findAll,
);

// Unread Count
router.get("/unread/count", notificationController.countUnread);

// Detail Notification
router.get(
  "/:id",
  validate(notificationIdSchema, "params"),
  notificationController.findById,
);

// Mark As Read
router.patch(
  "/:id/read",
  validate(notificationIdSchema, "params"),
  notificationController.markAsRead,
);

// Mark All As Read
router.patch(
  "/read-all",
  validate(markAllReadSchema),
  notificationController.markAllAsRead,
);

// Delete Notification
router.delete(
  "/:id",
  validate(notificationIdSchema, "params"),
  notificationController.delete,
);

// Delete Old Notifications
router.delete("/cleanup", notificationController.deleteOld);

module.exports = router;
