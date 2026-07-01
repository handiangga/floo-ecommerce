"use strict";

const OrderService = require("../services/order.service");

const OrderValidation = require("../validations/order.validation");

const ValidationHelper = require("../helpers/validation.helper");
const ResponseHelper = require("../helpers/response.helper");

class OrderController {
  async getAll(req, res) {
    try {
      const query = ValidationHelper.validate(
        OrderValidation.getAll,
        req.query,
      );

      const result = await OrderService.getAll(query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Orders retrieved successfully",
      );
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const result = await OrderService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Order retrieved successfully",
      );
    } catch (error) {
      return ResponseHelper.notFound(res, error.message);
    }
  }

  async getMyOrders(req, res) {
    try {
      const result = await OrderService.getMyOrders(req.customer.id);

      return ResponseHelper.success(
        res,
        result,
        "Orders retrieved successfully",
      );
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async checkout(req, res) {
    try {
      const payload = ValidationHelper.validate(
        OrderValidation.checkout,
        req.body,
      );

      const result = await OrderService.checkout(req.customer.id, payload);

      return ResponseHelper.created(res, result, "Checkout successfully");
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async cancel(req, res) {
    try {
      const result = await OrderService.cancel(req.params.id);

      return ResponseHelper.updated(
        res,
        result,
        "Order cancelled successfully",
      );
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async updateStatus(req, res) {
    try {
      const payload = ValidationHelper.validate(
        OrderValidation.updateStatus,
        req.body,
      );

      const result = await OrderService.updateStatus(
        req.params.id,
        payload.status,
      );

      return ResponseHelper.updated(
        res,
        result,
        "Order status updated successfully",
      );
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }
}

module.exports = new OrderController();
