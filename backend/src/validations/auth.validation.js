const Joi = require("joi");

module.exports = {
  login: Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    name: Joi.string().min(3).max(100).required(),

    email: Joi.string().email().required(),

    phone: Joi.string().min(10).max(20).required(),

    password: Joi.string().min(6).required(),
  }),
};
