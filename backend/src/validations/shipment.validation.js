"use strict";

const Joi = require("joi");
const SHIPMENT_STATUS = require("../constants/shipmentStatus");

const createShipmentSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),

  courier: Joi.string().trim().max(100).required(),

  service: Joi.string().trim().max(100).required(),

  tracking_number: Joi.string().trim().max(100).allow(null, ""),

  shipping_cost: Joi.number().min(0).default(0),

  weight: Joi.number().min(0).default(0),

  estimated_delivery: Joi.date().allow(null),

  notes: Joi.string().trim().allow("", null),
});

const updateShipmentSchema = Joi.object({
  courier: Joi.string().trim().max(100),

  service: Joi.string().trim().max(100),

  shipping_cost: Joi.number().min(0),

  weight: Joi.number().min(0),

  estimated_delivery: Joi.date().allow(null),

  notes: Joi.string().trim().allow("", null),
}).min(1);

const updateTrackingSchema = Joi.object({
  tracking_number: Joi.string().trim().max(100).required(),
});

const updateShipmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(SHIPMENT_STATUS))
    .required(),
});

module.exports = {
  createShipmentSchema,
  updateShipmentSchema,
  updateTrackingSchema,
  updateShipmentStatusSchema,
};
