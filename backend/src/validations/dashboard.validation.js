const Joi = require("joi");

class DashboardValidation {
  revenueChart = Joi.object({
    year: Joi.number()
      .integer()
      .min(2020)
      .max(2100)
      .default(new Date().getFullYear()),
  });

  limit = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10),
  });
}

module.exports = new DashboardValidation();
