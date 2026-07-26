"use strict";

const router = require("express").Router();

const authentication = require("../middlewares/authentication");
const reportController = require("../controllers/report.controller");
const validate = require("../middlewares/validation");
const { reportQuerySchema } = require("../validations/report.validation");

// All report routes require admin authentication
router.use(authentication);

// Sales Report
router.get(
  "/sales",
  validate(reportQuerySchema, "query"),
  reportController.salesReport,
);

// Product Report
router.get(
  "/products",
  validate(reportQuerySchema, "query"),
  reportController.productReport,
);

// Customer Report
router.get(
  "/customers",
  validate(reportQuerySchema, "query"),
  reportController.customerReport,
);

// Payment Report
router.get(
  "/payments",
  validate(reportQuerySchema, "query"),
  reportController.paymentReport,
);

// Order Status Report
router.get(
  "/orders",
  validate(reportQuerySchema, "query"),
  reportController.orderStatusReport,
);

module.exports = router;
