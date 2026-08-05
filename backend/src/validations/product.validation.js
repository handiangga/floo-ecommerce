const Joi = require("joi");

const Status = require("../constants/productStatus");

module.exports = {
  create: Joi.object({
    category_id: Joi.number().integer().required(),

    name: Joi.string().min(2).max(150).required(),

    description: Joi.string().allow("", null),

    material: Joi.string().allow("", null),

    brand: Joi.string().default("Floo Fashionn"),

    weight: Joi.number().integer().min(0).default(0),

    is_ready_stock: Joi.boolean().default(true),

    is_preorder: Joi.boolean().default(false),

    preorder_days: Joi.number().integer().min(0).default(0),

    is_featured: Joi.boolean().default(false),
    is_best_seller: Joi.boolean().default(false),
    is_new_arrival: Joi.boolean().default(false),

    seo_title: Joi.string().allow("", null),

    seo_description: Joi.string().allow("", null),

    status: Joi.string()
      .valid(...Object.values(Status))
      .default(Status.ACTIVE),
  }),

  update: Joi.object({
    category_id: Joi.number().integer(),

    name: Joi.string().min(2).max(150),

    description: Joi.string().allow("", null),

    material: Joi.string().allow("", null),

    brand: Joi.string(),

    weight: Joi.number().integer().min(0),

    is_ready_stock: Joi.boolean(),

    is_preorder: Joi.boolean(),

    preorder_days: Joi.number().integer().min(0),

    is_featured: Joi.boolean(),
    is_best_seller: Joi.boolean(),
    is_new_arrival: Joi.boolean(),

    seo_title: Joi.string().allow("", null),

    seo_description: Joi.string().allow("", null),

    status: Joi.string().valid(...Object.values(Status)),
  }),
};
