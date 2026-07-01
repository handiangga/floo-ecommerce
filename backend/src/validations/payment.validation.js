"use strict";

const Joi = require("joi");

const PAYMENT_STATUS = require("../constants/paymentStatus");
const PAYMENT_METHOD = require("../constants/paymentMethod");

const createPaymentSchema = Joi.object({
  order_id: Joi.number().integer().required(),

  method: Joi.string()
    .valid(...Object.values(PAYMENT_METHOD))
    .required(),

  provider: Joi.string().valid("MIDTRANS", "XENDIT", "MANUAL").optional(),

  payment_code: Joi.string().max(100).allow("", null),

  transaction_id: Joi.string().max(100).allow("", null),

  snap_token: Joi.string().max(500).allow("", null),

  payment_url: Joi.string().uri().allow("", null),

  expired_at: Joi.date().optional(),

  notes: Joi.string().allow("", null),
});

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(PAYMENT_STATUS))
    .required(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentStatusSchema,
};
