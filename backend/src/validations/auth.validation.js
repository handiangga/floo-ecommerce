const Joi = require("joi");

module.exports = {
  login: Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),

    email: Joi.string().email().required(),

    phone: Joi.string().trim().min(10).max(20).required(),

    password: Joi.string().min(6).max(100).required(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),

    newPassword: Joi.string().min(6).max(100).required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(6).max(100).required(),
  }),
};
