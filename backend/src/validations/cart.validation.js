const Joi = require("joi");

module.exports = {
  addItem: Joi.object({
    product_variant_id: Joi.number().integer().required().messages({
      "any.required": "Product variant is required",
      "number.base": "Product variant must be a number",
      "number.integer": "Product variant must be an integer",
    }),

    qty: Joi.number().integer().min(1).required().messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Minimum quantity is 1",
    }),
  }),

  updateQty: Joi.object({
    qty: Joi.number().integer().min(1).required().messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Minimum quantity is 1",
    }),
  }),
};
