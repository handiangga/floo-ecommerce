"use strict";

const Joi = require("joi");

const PAYMENT_METHOD = require("../constants/paymentMethod");

class OrderValidation {
  static checkout = Joi.object({
    address_id: Joi.number().integer().positive().required().messages({
      "any.required": "Address is required",
    }),

    voucher_code: Joi.string().trim().max(50).allow("", null),

    shipping_cost: Joi.number().min(0).default(0),

    shipping_method: Joi.string().max(100).allow("", null),

    courier_service: Joi.string().max(100).allow("", null),

    payment_method: Joi.string()
      .valid(...Object.values(PAYMENT_METHOD))
      .required()
      .messages({
        "any.required": "Payment method is required",
        "any.only": "Invalid payment method",
      }),

    notes: Joi.string().max(500).allow("", null),
  });

  static updateStatus = Joi.object({
    status: Joi.string()
      .valid(
        "WAITING_PAYMENT",
        "PAID",
        "PROCESS",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
        "EXPIRED",
        "REFUNDED",
      )
      .required()
      .messages({
        "any.required": "Status is required",
        "any.only": "Invalid status",
      }),
  });

  static getAll = Joi.object({
    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).max(100).default(10),

    customer_id: Joi.number().integer().positive(),

    status: Joi.string().valid(
      "WAITING_PAYMENT",
      "PAID",
      "PROCESS",
      "SHIPPED",
      "COMPLETED",
      "CANCELLED",
      "EXPIRED",
      "REFUNDED",
    ),

    search: Joi.string().allow("", null),

    sort: Joi.string().valid(
      "createdAt",
      "updatedAt",
      "invoice",
      "subtotal",
      "total",
      "status",
    ),

    order: Joi.string().valid("ASC", "DESC"),
  });
}

module.exports = OrderValidation;
