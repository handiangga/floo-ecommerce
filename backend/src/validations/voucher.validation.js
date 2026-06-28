const Joi = require("joi");

const VoucherType = require("../constants/voucherType");
const Status = require("../constants/voucherStatus");

module.exports = {
  create: Joi.object({
    code: Joi.string().uppercase().required(),

    name: Joi.string().required(),

    type: Joi.string()
      .valid(...Object.values(VoucherType))
      .required(),

    value: Joi.number().integer().min(1).required(),

    min_purchase: Joi.number().integer().min(0).required(),

    max_discount: Joi.number().integer().min(0).required(),

    quota: Joi.number().integer().min(1).required(),

    start_date: Joi.date().required(),

    end_date: Joi.date().greater(Joi.ref("start_date")).required(),

    status: Joi.string()
      .valid(...Object.values(Status))
      .default(Status.ACTIVE),
  }),

  update: Joi.object({
    code: Joi.string().uppercase(),

    name: Joi.string(),

    type: Joi.string().valid(...Object.values(VoucherType)),

    value: Joi.number().integer().min(1),

    min_purchase: Joi.number().integer().min(0),

    max_discount: Joi.number().integer().min(0),

    quota: Joi.number().integer().min(1),

    used: Joi.number().integer().min(0),

    start_date: Joi.date(),

    end_date: Joi.date(),

    status: Joi.string().valid(...Object.values(Status)),
  }),
};
