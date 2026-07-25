"use strict";

const express = require("express");
const router = express.Router();

const ShipmentController = require("../controllers/shipment.controller");

const validate = require("../middlewares/validation.js");

const {
  createShipmentSchema,
  updateShipmentSchema,
  updateTrackingSchema,
  updateShipmentStatusSchema,
} = require("../validations/shipment.validation");

// GET
router.get("/", ShipmentController.getAll);
router.get("/order/:orderId", ShipmentController.getByOrder);
router.get("/:id", ShipmentController.getById);
// POST
router.post("/", validate(createShipmentSchema), ShipmentController.create);

// PUT
router.put("/:id", validate(updateShipmentSchema), ShipmentController.update);

// PATCH Tracking
router.patch(
  "/:id/tracking",
  validate(updateTrackingSchema),
  ShipmentController.updateTracking,
);

// PATCH Status
router.patch(
  "/:id/status",
  validate(updateShipmentStatusSchema),
  ShipmentController.updateStatus,
);

// DELETE
router.delete("/:id", ShipmentController.delete);

module.exports = router;
