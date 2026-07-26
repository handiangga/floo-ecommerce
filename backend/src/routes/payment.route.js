"use strict";

const router = require("express").Router();

const PaymentController = require("../controllers/payment.controller");

const validate = require("../middlewares/validation");
const authentication = require("../middlewares/authentication");
const customerAuthentication = require("../middlewares/customer-authentication");

const {
  createPaymentSchema,
  updatePaymentStatusSchema,
} = require("../validations/payment.validation");

/*
|--------------------------------------------------------------------------
| CUSTOMER
|--------------------------------------------------------------------------
*/

router.get("/my", customerAuthentication, PaymentController.getMyPayments);

router.get(
  "/my/:id",
  customerAuthentication,
  PaymentController.getMyPaymentDetail,
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get("/", authentication, PaymentController.getAll);

router.get("/order/:order_id", authentication, PaymentController.getByOrder);

router.get("/:id", authentication, PaymentController.getById);

// Sebenarnya endpoint ini bisa dihapus jika Payment
// selalu dibuat otomatis saat Checkout.
// Untuk sementara tetap disediakan.
router.post(
  "/",
  authentication,
  validate(createPaymentSchema),
  PaymentController.create,
);

router.patch(
  "/:id/status",
  authentication,
  validate(updatePaymentStatusSchema),
  PaymentController.updateStatus,
);

/*
|--------------------------------------------------------------------------
| PAYMENT GATEWAY WEBHOOK
|--------------------------------------------------------------------------
*/

router.post("/webhook", PaymentController.webhook);

/*
|--------------------------------------------------------------------------
| CRON JOB
|--------------------------------------------------------------------------
*/

router.post("/expire", PaymentController.expirePending);

module.exports = router;
