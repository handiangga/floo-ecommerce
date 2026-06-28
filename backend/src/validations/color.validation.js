const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required(),

    code: Joi.string().max(20).required(),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(50),

    code: Joi.string().max(20),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
