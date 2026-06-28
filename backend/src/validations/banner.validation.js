const Joi = require("joi");

module.exports = {
  create: Joi.object({
    title: Joi.string().required(),

    image: Joi.string().allow(null, "").optional(),

    link: Joi.string().allow(null, "").optional(),

    sort_order: Joi.number().integer().default(0),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    title: Joi.string(),

    image: Joi.string().allow(null, ""),

    link: Joi.string().allow(null, ""),

    sort_order: Joi.number().integer(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
