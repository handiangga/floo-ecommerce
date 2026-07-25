"use strict";

const ShipmentService = require("../services/shipment.service");

class ShipmentController {
  async getAll(req, res, next) {
    try {
      const result = await ShipmentService.getAll(req.query);

      res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const shipment = await ShipmentService.getById(req.params.id);

      res.status(200).json({
        success: true,
        message: "Shipment retrieved successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByOrder(req, res, next) {
    try {
      const shipment = await ShipmentService.getByOrder(req.params.orderId);

      res.status(200).json({
        success: true,
        message: "Shipment retrieved successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const shipment = await ShipmentService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const shipment = await ShipmentService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Shipment updated successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTracking(req, res, next) {
    try {
      const shipment = await ShipmentService.updateTracking(
        req.params.id,
        req.body.tracking_number,
      );

      res.status(200).json({
        success: true,
        message: "Tracking number updated successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const shipment = await ShipmentService.updateStatus(
        req.params.id,
        req.body.status,
      );

      res.status(200).json({
        success: true,
        message: "Shipment status updated successfully",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await ShipmentService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Shipment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShipmentController();
