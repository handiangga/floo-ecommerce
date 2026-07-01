"use strict";

const PaymentService = require("../services/payment.service");

const ResponseHelper = require("../helpers/response.helper");

class PaymentController {
  async getAll(req, res) {
    try {
      const result = await PaymentService.getAll(req.query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Payments fetched successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async getById(req, res) {
    try {
      const payment = await PaymentService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        payment,
        "Payment fetched successfully",
      );
    } catch (err) {
      return ResponseHelper.notFound(res, err.message);
    }
  }

  async getByOrder(req, res) {
    try {
      const payment = await PaymentService.getByOrder(req.params.order_id);

      return ResponseHelper.success(
        res,
        payment,
        "Payment fetched successfully",
      );
    } catch (err) {
      return ResponseHelper.notFound(res, err.message);
    }
  }

  async create(req, res) {
    try {
      const payment = await PaymentService.create(req.body);

      return ResponseHelper.created(
        res,
        payment,
        "Payment created successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async updateStatus(req, res) {
    try {
      const payment = await PaymentService.updateStatus(
        req.params.id,
        req.body.status,
        req.body,
      );

      return ResponseHelper.updated(
        res,
        payment,
        "Payment updated successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async webhook(req, res) {
    try {
      await PaymentService.handleWebhook(req.body);

      return ResponseHelper.success(
        res,
        null,
        "Webhook processed successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async expirePending(req, res) {
    try {
      const total = await PaymentService.expirePendingPayments();

      return ResponseHelper.success(
        res,
        {
          total,
        },
        "Expired payment checked",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }
}

module.exports = new PaymentController();
