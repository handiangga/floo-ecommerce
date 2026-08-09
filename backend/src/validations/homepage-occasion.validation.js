const Joi = require("joi");

const fields = {
  title: Joi.string().trim().min(2).max(120),
  image: Joi.string().allow(null, ""),
  link: Joi.string().allow(null, ""),
  sort_order: Joi.number().integer().min(0),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
};

module.exports = {
  create: Joi.object({ ...fields, title: fields.title.required() }),
  update: Joi.object(fields).min(1),
};
