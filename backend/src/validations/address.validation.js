const Joi = require("joi");

module.exports = {
  create: Joi.object({
    receiver_name: Joi.string().min(2).max(100).required(),

    phone: Joi.string().min(8).max(20).required(),

    label: Joi.string().valid("HOME", "OFFICE", "OTHER").required(),

    province: Joi.string().required(),

    city: Joi.string().required(),

    district: Joi.string().required(),

    subdistrict: Joi.string().required(),

    postal_code: Joi.string().min(3).max(10).required(),

    address: Joi.string().required(),

    notes: Joi.string().allow("", null),

    latitude: Joi.number().min(-90).max(90).allow(null),

    longitude: Joi.number().min(-180).max(180).allow(null),

    is_default: Joi.boolean(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),

  update: Joi.object({
    receiver_name: Joi.string().min(2).max(100),

    phone: Joi.string().min(8).max(20),

    label: Joi.string().valid("HOME", "OFFICE", "OTHER"),

    province: Joi.string(),

    city: Joi.string(),

    district: Joi.string(),

    subdistrict: Joi.string(),

    postal_code: Joi.string().min(3).max(10),

    address: Joi.string(),

    notes: Joi.string().allow("", null),

    latitude: Joi.number().min(-90).max(90).allow(null),

    longitude: Joi.number().min(-180).max(180).allow(null),

    is_default: Joi.boolean(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
