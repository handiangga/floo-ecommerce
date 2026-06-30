const Joi = require("joi");

module.exports = {
  addItem: Joi.object({
    product_variant_id: Joi.number().integer().required(),

    qty: Joi.number().integer().min(1).default(1),
  }),

  updateQty: Joi.object({
    qty: Joi.number().integer().min(1).required(),
  }),
};
