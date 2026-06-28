const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().required(),

    sort_order: Joi.number().integer().required(),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    name: Joi.string(),

    sort_order: Joi.number().integer(),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
