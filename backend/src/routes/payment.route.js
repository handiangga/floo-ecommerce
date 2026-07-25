"use strict";

const router = require("express").Router();

const PaymentController = require("../controllers/payment.controller");

const validate = require("../middlewares/validation.js");

const {
  createPaymentSchema,
  updatePaymentStatusSchema,
} = require("../validations/payment.validation");

// Admin
router.get("/", PaymentController.getAll);

router.get("/order/:order_id", PaymentController.getByOrder);

router.get("/:id", PaymentController.getById);

router.post("/", validate(createPaymentSchema), PaymentController.create);

router.patch(
  "/:id/status",
  validate(updatePaymentStatusSchema),
  PaymentController.updateStatus,
);

// Webhook
router.post("/webhook", PaymentController.webhook);

// Cron
router.post("/expire", PaymentController.expirePending);

module.exports = router;
