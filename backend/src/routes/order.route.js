"use strict";

const express = require("express");

const router = express.Router();

const OrderController = require("../controllers/order.controller");

const authenticate = require("../middlewares/auth.middleware");
const customerAuth = require("../middlewares/customer-auth.middleware");

//
// ==============================
// ADMIN
// ==============================
//

router.get("/", authenticate, OrderController.getAll);

router.get("/:id", authenticate, OrderController.getById);

router.patch("/:id/status", authenticate, OrderController.updateStatus);

//
// ==============================
// CUSTOMER
// ==============================
//

router.get("/my/orders", customerAuth, OrderController.getMyOrders);

router.post("/checkout", customerAuth, OrderController.checkout);

router.patch("/:id/cancel", customerAuth, OrderController.cancel);

module.exports = router;
