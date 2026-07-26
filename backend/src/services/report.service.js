"use strict";

const reportRepository = require("../repositories/report.repository");

class ReportService {
  async getSalesReport(query) {
    const { start_date, end_date } = query;

    return reportRepository.getSalesReport(start_date, end_date);
  }

  async getProductReport(query) {
    const { start_date, end_date } = query;

    return reportRepository.getProductReport(start_date, end_date);
  }

  async getCustomerReport(query) {
    const { start_date, end_date } = query;

    return reportRepository.getCustomerReport(start_date, end_date);
  }

  async getPaymentReport(query) {
    const { start_date, end_date } = query;

    return reportRepository.getPaymentReport(start_date, end_date);
  }

  async getOrderStatusReport(query) {
    const { start_date, end_date } = query;

    return reportRepository.getOrderStatusReport(start_date, end_date);
  }
}

module.exports = new ReportService();
