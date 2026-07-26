"use strict";

const Joi = require("joi");

const PAYMENT_STATUS = require("../constants/paymentStatus");
const PAYMENT_METHOD = require("../constants/paymentMethod");

const PAYMENT_PROVIDER = ["MIDTRANS", "XENDIT", "MANUAL"];

const createPaymentSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),

  method: Joi.string()
    .valid(...Object.values(PAYMENT_METHOD))
    .required(),

  provider: Joi.string()
    .valid(...PAYMENT_PROVIDER)
    .default("MANUAL"),

  amount: Joi.number().integer().min(0).optional(),

  payment_code: Joi.string().max(100).allow("", null),

  transaction_id: Joi.string().max(100).allow("", null),

  snap_token: Joi.string().max(500).allow("", null),

  payment_url: Joi.string().uri().allow("", null),

  expired_at: Joi.date().optional(),

  notes: Joi.string().max(1000).allow("", null),
});

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(PAYMENT_STATUS))
    .required(),

  transaction_id: Joi.string().max(100).allow("", null),

  payment_code: Joi.string().max(100).allow("", null),

  paid_at: Joi.date().optional(),

  verified_by: Joi.number().integer().positive().allow(null),

  verified_at: Joi.date().optional(),

  failed_reason: Joi.string().allow("", null),

  notes: Joi.string().max(1000).allow("", null),
});

module.exports = {
  createPaymentSchema,
  updatePaymentStatusSchema,
};
