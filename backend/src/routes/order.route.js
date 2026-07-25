"use strict";

const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order.controller");

const authenticate = require("../middlewares/authentication");
const customerAuth = require("../middlewares/customer-authentication");
const validation = require("../middlewares/validation");

const { checkout, updateStatus } = require("../validations/order.validation");

//
// ==============================
// CUSTOMER
// ==============================
//

// IMPORTANT:
// letakkan route spesifik sebelum /:id

router.get("/my/orders/:id", customerAuth, OrderController.getMyOrderDetail);
router.get("/my/orders", customerAuth, OrderController.getMyOrders);

router.post(
  "/checkout",
  customerAuth,
  validation(checkout),
  OrderController.checkout,
);

router.patch("/:id/cancel", customerAuth, OrderController.cancel);

//
// ==============================
// ADMIN
// ==============================
//

router.get("/", authenticate, OrderController.getAll);

router.get("/:id", authenticate, OrderController.getById);

router.patch("/:id/cancel", authenticate, OrderController.cancel);
router.patch(
  "/:id/status",
  authenticate,
  validation(updateStatus),
  OrderController.updateStatus,
);

module.exports = router;
