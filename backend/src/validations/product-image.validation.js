const Joi = require("joi");

module.exports = {
  create: Joi.object({
    product_id: Joi.number().integer().required(),

    image: Joi.string().uri().required(),

    is_primary: Joi.boolean().default(false),

    sort_order: Joi.number().integer().min(1).default(1),
  }),
};
