"use strict";

const dashboardRepository = require("../repositories/dashboard.repository");

class DashboardService {
  async getOverview() {
    return dashboardRepository.getOverview();
  }

  async getRevenueChart(year) {
    const selectedYear = Number(year) || new Date().getFullYear();

    return dashboardRepository.getRevenueChart(selectedYear);
  }

  async getOrderStatistics() {
    return dashboardRepository.getOrderStatistics();
  }

  async getTopProducts(limit) {
    const selectedLimit = Number(limit) || 10;

    return dashboardRepository.getTopProducts(selectedLimit);
  }

  async getRecentOrders(limit) {
    const selectedLimit = Number(limit) || 10;

    return dashboardRepository.getRecentOrders(selectedLimit);
  }

  async getLowStockProducts(limit) {
    const selectedLimit = Number(limit) || 10;

    return dashboardRepository.getLowStockProducts(selectedLimit);
  }

  async getRecentCustomers(limit) {
    const selectedLimit = Number(limit) || 10;

    return dashboardRepository.getRecentCustomers(selectedLimit);
  }
}

module.exports = new DashboardService();
