const Joi = require("joi");

module.exports = {
  create: Joi.object({
    product_id: Joi.number().integer().required(),

    image: Joi.string().uri().allow("", null),

    is_primary: Joi.boolean().default(false),

    sort_order: Joi.number().integer().min(0).default(0),
  }),

  reorder: Joi.object({
    image_ids: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .required(),
  }),
};
