"use strict";

const reportService = require("../services/report.service");
const ResponseHelper = require("../helpers/response.helper");

class ReportController {
  async salesReport(req, res, next) {
    try {
      const result = await reportService.getSalesReport(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Sales report retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async productReport(req, res, next) {
    try {
      const result = await reportService.getProductReport(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Product report retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async customerReport(req, res, next) {
    try {
      const result = await reportService.getCustomerReport(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Customer report retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async paymentReport(req, res, next) {
    try {
      const result = await reportService.getPaymentReport(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Payment report retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async orderStatusReport(req, res, next) {
    try {
      const result = await reportService.getOrderStatusReport(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Order status report retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
