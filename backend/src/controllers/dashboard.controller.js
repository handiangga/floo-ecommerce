"use strict";

const dashboardService = require("../services/dashboard.service");
const ResponseHelper = require("../helpers/response.helper");

class DashboardController {
  async overview(req, res, next) {
    try {
      const data = await dashboardService.getOverview();

      return ResponseHelper.success(res, data, "Dashboard overview retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async revenueChart(req, res, next) {
    try {
      const { year } = req.query;

      const data = await dashboardService.getRevenueChart(year);

      return ResponseHelper.success(res, data, "Revenue chart retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async orderStatistics(req, res, next) {
    try {
      const data = await dashboardService.getOrderStatistics();

      return ResponseHelper.success(res, data, "Order statistics retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async topProducts(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getTopProducts(limit);

      return ResponseHelper.success(res, data, "Top products retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async recentOrders(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getRecentOrders(limit);

      return ResponseHelper.success(res, data, "Recent orders retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async lowStock(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getLowStockProducts(limit);

      return ResponseHelper.success(res, data, "Low stock products retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async recentCustomers(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getRecentCustomers(limit);

      return ResponseHelper.success(res, data, "Recent customers retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
