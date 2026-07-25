"use strict";
const { sequelize } = require("../../models");

const ShipmentRepository = require("../repositories/shipment.repository");
const OrderRepository = require("../repositories/order.repository");

const PaginationHelper = require("../helpers/pagination.helper");

const SHIPMENT_STATUS = require("../constants/shipmentStatus");
const ORDER_STATUS = require("../constants/orderStatus");
const allowedTransitions = {
  [SHIPMENT_STATUS.PENDING]: [SHIPMENT_STATUS.PICKED],

  [SHIPMENT_STATUS.PICKED]: [SHIPMENT_STATUS.SHIPPED],

  [SHIPMENT_STATUS.SHIPPED]: [
    SHIPMENT_STATUS.DELIVERED,
    SHIPMENT_STATUS.RETURNED,
    SHIPMENT_STATUS.FAILED,
  ],

  [SHIPMENT_STATUS.DELIVERED]: [],

  [SHIPMENT_STATUS.RETURNED]: [],

  [SHIPMENT_STATUS.FAILED]: [],
};

class ShipmentService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await ShipmentRepository.findAll({
      limit,
      offset,
      status: query.status,
      courier: query.courier,
      search: query.search || "",
      sort: query.sort || "createdAt",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const shipment = await ShipmentRepository.findById(id);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    return shipment;
  }

  async getByOrder(orderId) {
    const shipment = await ShipmentRepository.findByOrder(orderId);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    return shipment;
  }

  async create(payload, transaction = null) {
    const order = await OrderRepository.findById(payload.order_id);

    if (!order) {
      throw new Error("Order not found");
    }

    const existing = await ShipmentRepository.findByOrder(payload.order_id);

    if (existing) {
      throw new Error("Shipment already exists");
    }

    if (![ORDER_STATUS.PAID, ORDER_STATUS.PROCESS].includes(order.status)) {
      throw new Error(
        "Shipment can only be created for paid or processing orders",
      );
    }

    if (payload.tracking_number) {
      const existingTracking = await ShipmentRepository.findByTrackingNumber(
        payload.tracking_number,
      );

      if (existingTracking) {
        throw new Error("Tracking number already exists");
      }
    }

    return ShipmentRepository.create(
      {
        order_id: payload.order_id,
        courier: payload.courier,
        service: payload.service,
        tracking_number: payload.tracking_number,
        shipping_cost: payload.shipping_cost || 0,
        weight: payload.weight || 0,
        estimated_delivery: payload.estimated_delivery,
        notes: payload.notes,

        status: SHIPMENT_STATUS.PENDING,
        shipped_at: null,
        delivered_at: null,
      },
      transaction,
    );
  }

  async update(id, payload, transaction = null) {
    const shipment = await ShipmentRepository.findById(id, transaction);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    const data = {
      courier: payload.courier,
      service: payload.service,
      shipping_cost: payload.shipping_cost,
      weight: payload.weight,
      estimated_delivery: payload.estimated_delivery,
      notes: payload.notes,
    };

    return ShipmentRepository.update(id, data, transaction);
  }

  async updateTracking(id, tracking_number) {
    const shipment = await ShipmentRepository.findById(id);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    if (
      [
        SHIPMENT_STATUS.SHIPPED,
        SHIPMENT_STATUS.DELIVERED,
        SHIPMENT_STATUS.RETURNED,
        SHIPMENT_STATUS.FAILED,
      ].includes(shipment.status)
    ) {
      throw new Error(
        "Tracking number cannot be updated in the current shipment status",
      );
    }

    if (tracking_number) {
      const existing =
        await ShipmentRepository.findByTrackingNumber(tracking_number);

      if (existing && existing.id !== shipment.id) {
        throw new Error("Tracking number already exists");
      }
    }

    return ShipmentRepository.update(id, {
      tracking_number,
    });
  }

  async updateStatus(id, status) {
    const transaction = await sequelize.transaction();

    try {
      const shipment = await ShipmentRepository.findById(id, transaction);

      if (!shipment) {
        throw new Error("Shipment not found");
      }

      if (!Object.values(SHIPMENT_STATUS).includes(status)) {
        throw new Error("Invalid shipment status");
      }

      if (!allowedTransitions[shipment.status]?.includes(status)) {
        throw new Error("Invalid shipment status transition");
      }

      if (status === SHIPMENT_STATUS.SHIPPED && !shipment.tracking_number) {
        throw new Error("Tracking number is required before shipment");
      }

      const payload = {
        status,
      };

      switch (status) {
        case SHIPMENT_STATUS.PICKED:
          await OrderRepository.update(
            shipment.order_id,
            {
              status: ORDER_STATUS.PROCESS,
            },
            transaction,
          );
          break;

        case SHIPMENT_STATUS.SHIPPED:
          payload.shipped_at = new Date();

          await OrderRepository.update(
            shipment.order_id,
            {
              status: ORDER_STATUS.SHIPPED,
            },
            transaction,
          );
          break;

        case SHIPMENT_STATUS.DELIVERED:
          payload.delivered_at = new Date();

          await OrderRepository.update(
            shipment.order_id,
            {
              status: ORDER_STATUS.COMPLETED,
              completed_at: new Date(),
            },
            transaction,
          );
          break;

        case SHIPMENT_STATUS.RETURNED:
          await OrderRepository.update(
            shipment.order_id,
            {
              status: ORDER_STATUS.REFUNDED,
              refunded_at: new Date(),
            },
            transaction,
          );
          break;

        case SHIPMENT_STATUS.FAILED:
          await OrderRepository.update(
            shipment.order_id,
            {
              status: ORDER_STATUS.CANCELLED,
              cancelled_at: new Date(),
            },
            transaction,
          );
          break;
      }

      const result = await ShipmentRepository.update(id, payload, transaction);

      await transaction.commit();

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id, transaction = null) {
    const shipment = await ShipmentRepository.findById(id, transaction);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    await ShipmentRepository.delete(id, transaction);

    return true;
  }
}

module.exports = new ShipmentService();
