const Joi = require("joi");

module.exports = {
  checkout: Joi.object({
    address_id: Joi.number().required(),

    voucher_code: Joi.string().allow("", null),

    notes: Joi.string().allow("", null),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(
        "PENDING",
        "WAITING_PAYMENT",
        "PAID",
        "PROCESS",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
      )
      .required(),
  }),
};
