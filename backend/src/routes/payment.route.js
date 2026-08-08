"use strict";

const router = require("express").Router();

const PaymentController = require("../controllers/payment.controller");

const validate = require("../middlewares/validation");
const authentication = require("../middlewares/authentication");
const customerAuthentication = require("../middlewares/customer-authentication");
const cronAuthentication = require("../middlewares/cron-authentication");
const rateLimit = require("../middlewares/rate-limit");
const upload = require("../middlewares/upload");

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
  "/my/order/:orderId",
  customerAuthentication,
  PaymentController.getMyPaymentByOrder,
);

router.post(
  "/my/order/:orderId",
  customerAuthentication,
  PaymentController.createMyPayment,
);

router.post(
  "/my/:id/proof",
  customerAuthentication,
  upload.single("proof"),
  PaymentController.submitMyProof,
);

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

router.post(
  "/webhook",
  rateLimit({ windowMs: 60 * 1000, max: 120, keyPrefix: "payment-webhook" }),
  PaymentController.webhook,
);

router.post("/:id/approve-manual", authentication, PaymentController.approveManual);
router.post("/:id/reject-manual", authentication, PaymentController.rejectManual);

/*
|--------------------------------------------------------------------------
| CRON JOB
|--------------------------------------------------------------------------
*/

router.post("/expire", cronAuthentication, PaymentController.expirePending);

module.exports = router;
