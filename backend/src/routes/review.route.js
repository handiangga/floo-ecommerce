"use strict";

const router = require("express").Router();

const authentication = require("../middlewares/authentication");
const validate = require("../middlewares/validation");

const reviewController = require("../controllers/review.controller");

const {
  createReviewSchema,
  reviewQuerySchema,
  reviewIdSchema,
  productReviewSummarySchema,
} = require("../validations/review.validation");

// ==============================
// Public
// ==============================

// Get Reviews
router.get("/", validate(reviewQuerySchema, "query"), reviewController.findAll);

// Get Review Detail
router.get(
  "/:id",
  validate(reviewIdSchema, "params"),
  reviewController.findById,
);

// Product Review Summary
router.get(
  "/product/:productId/summary",
  validate(productReviewSummarySchema, "params"),
  reviewController.summary,
);

// ==============================
// Protected
// ==============================

router.use(authentication);

// Create Review
router.post("/", validate(createReviewSchema), reviewController.create);

// Approve Review
router.patch(
  "/:id/approve",
  validate(reviewIdSchema, "params"),
  reviewController.approve,
);

// Reject Review
router.patch(
  "/:id/reject",
  validate(reviewIdSchema, "params"),
  reviewController.reject,
);

// Delete Review
router.delete(
  "/:id",
  validate(reviewIdSchema, "params"),
  reviewController.delete,
);

module.exports = router;
