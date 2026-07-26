"use strict";

const Joi = require("joi");

const NOTIFICATION_TYPES = [
  "ORDER",
  "PAYMENT",
  "SHIPMENT",
  "PROMOTION",
  "SYSTEM",
];

const createNotificationSchema = Joi.object({
  customer_id: Joi.number().integer().positive().allow(null),

  user_id: Joi.number().integer().positive().allow(null),

  title: Joi.string().max(255).required(),

  message: Joi.string().required(),

  type: Joi.string()
    .valid(...NOTIFICATION_TYPES)
    .required(),

  reference_id: Joi.number().integer().positive().allow(null),
});

const notificationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  customer_id: Joi.number().integer().positive(),

  user_id: Joi.number().integer().positive(),

  type: Joi.string().valid(...NOTIFICATION_TYPES),

  is_read: Joi.boolean(),
});

const notificationIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const markAllReadSchema = Joi.object({
  customer_id: Joi.number().integer().positive(),

  user_id: Joi.number().integer().positive(),
}).or("customer_id", "user_id");

module.exports = {
  createNotificationSchema,
  notificationQuerySchema,
  notificationIdSchema,
  markAllReadSchema,
};
