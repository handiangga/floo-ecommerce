const Joi = require("joi");

module.exports = {
  create: Joi.object({
    product_id: Joi.number().integer().required(),
  }),
};