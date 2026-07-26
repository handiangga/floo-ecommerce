"use strict";

const Joi = require("joi");

const reportQuerySchema = Joi.object({
  start_date: Joi.date().iso().optional().messages({
    "date.base": "Start date must be a valid date",
    "date.format": "Start date must be in YYYY-MM-DD format",
  }),

  end_date: Joi.date().iso().optional().messages({
    "date.base": "End date must be a valid date",
    "date.format": "End date must be in YYYY-MM-DD format",
  }),
})
  .custom((value, helpers) => {
    if (
      value.start_date &&
      value.end_date &&
      new Date(value.start_date) > new Date(value.end_date)
    ) {
      return helpers.error("any.invalid");
    }

    return value;
  }, "Date validation")
  .messages({
    "any.invalid": "Start date cannot be greater than end date",
  });

module.exports = {
  reportQuerySchema,
};
