const Joi = require("joi");

module.exports = {
  create: Joi.object({
    product_id: Joi.number().integer().required(),

    color_id: Joi.number().integer().required(),

    size_id: Joi.number().integer().required(),

    barcode: Joi.string().allow("", null),

    price: Joi.number().integer().min(0).required(),

    discount_price: Joi.number().integer().min(0).allow(null),

    stock: Joi.number().integer().min(0).default(0),

    weight: Joi.number().integer().min(0).default(0),

    length: Joi.number().min(0).default(0),

    width: Joi.number().min(0).default(0),

    height: Joi.number().min(0).default(0),

    min_order: Joi.number().integer().min(1).default(1),

    max_order: Joi.number().integer().allow(null),

    image: Joi.string().uri().allow("", null),

    is_ready_stock: Joi.boolean().default(true),

    is_preorder: Joi.boolean().default(false),

    preorder_days: Joi.number().integer().min(0).default(0),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    barcode: Joi.string().allow("", null),

    price: Joi.number().integer().min(0),

    discount_price: Joi.number().integer().min(0).allow(null),

    stock: Joi.number().integer().min(0),

    weight: Joi.number().integer().min(0),

    length: Joi.number().min(0),

    width: Joi.number().min(0),

    height: Joi.number().min(0),

    min_order: Joi.number().integer().min(1),

    max_order: Joi.number().integer().allow(null),

    image: Joi.string().uri().allow("", null),

    is_ready_stock: Joi.boolean(),

    is_preorder: Joi.boolean(),

    preorder_days: Joi.number().integer().min(0),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
