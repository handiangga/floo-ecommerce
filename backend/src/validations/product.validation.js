const Joi = require("joi");

module.exports = {
  create: Joi.object({
    category_id: Joi.number().required(),

    name: Joi.string().required(),

    description: Joi.string().allow("", null),

    material: Joi.string().allow("", null),

    weight: Joi.number().default(0),

    brand: Joi.string().default("Floo Fashionn"),

    is_ready_stock: Joi.boolean().default(true),

    is_preorder: Joi.boolean().default(false),

    preorder_days: Joi.number().default(0),

    featured: Joi.boolean().default(false),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),

    seo_title: Joi.string().allow("", null),

    seo_description: Joi.string().allow("", null),
  }),

  update: Joi.object({
    category_id: Joi.number(),

    name: Joi.string(),

    description: Joi.string().allow("", null),

    material: Joi.string().allow("", null),

    weight: Joi.number(),

    brand: Joi.string(),

    is_ready_stock: Joi.boolean(),

    is_preorder: Joi.boolean(),

    preorder_days: Joi.number(),

    featured: Joi.boolean(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),

    seo_title: Joi.string().allow("", null),

    seo_description: Joi.string().allow("", null),
  }),
};
