"use strict";

const dashboardService = require("../services/dashboard.service");

class DashboardController {
  async overview(req, res, next) {
    try {
      const data = await dashboardService.getOverview();

      return res.success(data, "Dashboard overview retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async revenueChart(req, res, next) {
    try {
      const { year } = req.query;

      const data = await dashboardService.getRevenueChart(year);

      return res.success(data, "Revenue chart retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async orderStatistics(req, res, next) {
    try {
      const data = await dashboardService.getOrderStatistics();

      return res.success(data, "Order statistics retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async topProducts(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getTopProducts(limit);

      return res.success(data, "Top products retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async recentOrders(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getRecentOrders(limit);

      return res.success(data, "Recent orders retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async lowStock(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getLowStockProducts(limit);

      return res.success(data, "Low stock products retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async recentCustomers(req, res, next) {
    try {
      const { limit } = req.query;

      const data = await dashboardService.getRecentCustomers(limit);

      return res.success(data, "Recent customers retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
