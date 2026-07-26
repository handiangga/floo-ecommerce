"use strict";

const router = require("express").Router();

const dashboardController = require("../controllers/dashboard.controller");
const authentication = require("../middlewares/authentication");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get("/", authentication, dashboardController.overview);

router.get("/revenue", authentication, dashboardController.revenueChart);

router.get("/orders", authentication, dashboardController.orderStatistics);

router.get("/top-products", authentication, dashboardController.topProducts);

router.get("/recent-orders", authentication, dashboardController.recentOrders);

router.get("/low-stock", authentication, dashboardController.lowStock);

router.get(
  "/recent-customers",
  authentication,
  dashboardController.recentCustomers,
);

module.exports = router;
