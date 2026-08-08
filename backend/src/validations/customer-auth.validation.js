const Joi = require("joi");

module.exports = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),

    email: Joi.string().email().lowercase().trim().required(),

    phone: Joi.string().min(8).max(20).required(),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/[a-z]/)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain uppercase, lowercase, and number",
      }),

    gender: Joi.string().valid("MALE", "FEMALE").optional(),

    birth_date: Joi.date().allow(null),

    photo: Joi.string().uri().allow("", null),

    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),

    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),

    email: Joi.string().email().lowercase().trim(),

    phone: Joi.string().min(8).max(20),

    gender: Joi.string().valid("MALE", "FEMALE"),

    birth_date: Joi.date().allow(null),

    photo: Joi.string().uri().allow("", null),
  }),

  changePassword: Joi.object({
    old_password: Joi.string().required(),

    new_password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/[a-z]/)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain uppercase, lowercase, and number",
      }),
  }),
};
