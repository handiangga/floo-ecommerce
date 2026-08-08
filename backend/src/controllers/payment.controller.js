"use strict";

const PaymentService = require("../services/payment.service");
const ResponseHelper = require("../helpers/response.helper");

class PaymentController {
  // =====================================================
  // CUSTOMER
  // =====================================================

  async getMyPayments(req, res) {
    try {
      const result = await PaymentService.getMyPayments(
        req.customer.id,
        req.query,
      );

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

  async getMyPaymentDetail(req, res) {
    try {
      const payment = await PaymentService.getMyPaymentDetail(
        req.params.id,
        req.customer.id,
      );

      return ResponseHelper.success(
        res,
        payment,
        "Payment fetched successfully",
      );
    } catch (err) {
      return ResponseHelper.notFound(res, err.message);
    }
  }

  async createMyPayment(req, res) {
    try {
      const payment = await PaymentService.createForCustomer(
        req.params.orderId,
        req.customer.id,
      );

      return ResponseHelper.created(
        res,
        payment,
        "Payment created successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async getMyPaymentByOrder(req, res) {
    try {
      const payment = await PaymentService.getForCustomerOrder(
        req.params.orderId,
        req.customer.id,
      );
      return ResponseHelper.success(res, payment, "Payment fetched successfully");
    } catch (err) {
      return ResponseHelper.notFound(res, err.message);
    }
  }

  async submitMyProof(req, res) {
    try {
      const payment = await PaymentService.submitProof(
        req.params.id,
        req.customer.id,
        req.file,
      );
      return ResponseHelper.updated(res, payment, "Payment proof submitted");
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  // =====================================================
  // ADMIN
  // =====================================================

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
        req.body,
      );

      return ResponseHelper.updated(
        res,
        payment,
        "Payment status updated successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async approveManual(req, res) {
    try {
      const payment = await PaymentService.approveManual(
        req.params.id,
        req.user.id,
        req.body.note || null,
      );
      return ResponseHelper.updated(res, payment, "Manual payment approved");
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  async rejectManual(req, res) {
    try {
      const payment = await PaymentService.rejectManual(
        req.params.id,
        req.user.id,
        req.body.note || null,
      );
      return ResponseHelper.updated(res, payment, "Manual payment needs revision");
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }

  // =====================================================
  // PAYMENT GATEWAY
  // =====================================================

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

  // =====================================================
  // CRON
  // =====================================================

  async expirePending(req, res) {
    try {
      const total = await PaymentService.expirePendingPayments();

      return ResponseHelper.success(
        res,
        { total },
        "Expired payment checked successfully",
      );
    } catch (err) {
      return ResponseHelper.badRequest(res, err.message);
    }
  }
}

module.exports = new PaymentController();
