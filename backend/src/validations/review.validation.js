"use strict";

const Joi = require("joi");
const REVIEW_STATUS = require("../constants/reviewStatus");

const createReviewSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),

  product_id: Joi.number().integer().positive().required(),

  order_item_id: Joi.number().integer().positive().required(),

  rating: Joi.number().integer().min(1).max(5).required(),

  comment: Joi.string().allow("").max(3000).optional(),

  images: Joi.array().items(Joi.string().uri().required()).max(10).default([]),
});

const reviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  status: Joi.string()
    .valid(
      REVIEW_STATUS.PENDING,
      REVIEW_STATUS.APPROVED,
      REVIEW_STATUS.REJECTED,
    )
    .optional(),

  product_id: Joi.number().integer().positive().optional(),
});

const reviewIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const productReviewSummarySchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
});

module.exports = {
  createReviewSchema,
  reviewQuerySchema,
  reviewIdSchema,
  productReviewSummarySchema,
};
