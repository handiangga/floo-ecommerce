const Joi = require("joi");

module.exports = {
  register: Joi.object({
    name: Joi.string().required(),

    email: Joi.string().email().required(),

    phone: Joi.string().required(),

    password: Joi.string().min(6).required(),

    gender: Joi.string().valid("MALE", "FEMALE"),

    birth_date: Joi.date(),

    photo: Joi.string().allow("", null),
  }),

  update: Joi.object({
    name: Joi.string(),

    email: Joi.string().email(),

    phone: Joi.string(),

    gender: Joi.string().valid("MALE", "FEMALE"),

    birth_date: Joi.date(),

    photo: Joi.string().allow("", null),

    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};
