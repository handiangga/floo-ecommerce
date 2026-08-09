const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),

    parent_id: Joi.number().integer().positive().allow(null).optional(),

    image: Joi.string().allow(null, "").optional(),

    banner: Joi.string().allow(null, "").optional(),

    description: Joi.string().allow(null, "").optional(),

    sort_order: Joi.number().integer().default(0),

    is_featured: Joi.boolean().default(false),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),

    parent_id: Joi.number().integer().positive().allow(null),

    image: Joi.string().allow(null, ""),

    banner: Joi.string().allow(null, ""),

    description: Joi.string().allow(null, ""),

    sort_order: Joi.number().integer(),

    is_featured: Joi.boolean(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
