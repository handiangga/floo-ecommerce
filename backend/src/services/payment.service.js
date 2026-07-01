"use strict";

const PaymentRepository = require("../repositories/payment.repository");
const OrderRepository = require("../repositories/order.repository");

const PaginationHelper = require("../helpers/pagination.helper");

const PAYMENT_STATUS = require("../constants/paymentStatus");
const ORDER_STATUS = require("../constants/orderStatus");

class PaymentService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await PaymentRepository.findAll({
      limit,
      offset,
      status: query.status,
      method: query.method,
      provider: query.provider,
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
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async getByOrder(order_id) {
    const payment = await PaymentRepository.findByOrder(order_id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async create(payload, transaction = null) {
    const order = await OrderRepository.findById(payload.order_id);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== ORDER_STATUS.WAITING_PAYMENT) {
      throw new Error("Order is not waiting for payment");
    }

    const existing = await PaymentRepository.findByOrder(payload.order_id);

    if (existing) {
      throw new Error("Payment already exists");
    }

    return PaymentRepository.create(
      {
        order_id: order.id,
        method: payload.method,
        provider: payload.provider || "MIDTRANS",
        amount: order.total,
        payment_code: payload.payment_code,
        transaction_id: payload.transaction_id,
        snap_token: payload.snap_token,
        payment_url: payload.payment_url,
        expired_at: payload.expired_at,
        notes: payload.notes,
        status: PAYMENT_STATUS.PENDING,
      },
      transaction,
    );
  }
  async pay(id, payload = {}) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === PAYMENT_STATUS.PAID) {
      throw new Error("Payment already paid");
    }

    if (
      payment.status === PAYMENT_STATUS.CANCELLED ||
      payment.status === PAYMENT_STATUS.EXPIRED ||
      payment.status === PAYMENT_STATUS.REFUNDED
    ) {
      throw new Error("Payment cannot be paid");
    }

    await PaymentRepository.update(id, {
      status: PAYMENT_STATUS.PAID,
      paid_at: new Date(),
      transaction_id: payload.transaction_id || payment.transaction_id,
      payment_code: payload.payment_code || payment.payment_code,
      snap_token: payload.snap_token || payment.snap_token,
      payment_url: payload.payment_url || payment.payment_url,
      webhook_payload: payload.webhook_payload || payment.webhook_payload,
    });

    await OrderRepository.update(payment.order_id, {
      status: ORDER_STATUS.PAID,
      paid_at: new Date(),
    });

    return PaymentRepository.findById(id);
  }

  async expire(id) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      throw new Error("Payment cannot be expired");
    }

    await PaymentRepository.update(id, {
      status: PAYMENT_STATUS.EXPIRED,
      expired_at: new Date(),
    });

    await OrderRepository.update(payment.order_id, {
      status: ORDER_STATUS.EXPIRED,
    });

    return PaymentRepository.findById(id);
  }

  async cancel(id) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (
      payment.status === PAYMENT_STATUS.PAID ||
      payment.status === PAYMENT_STATUS.CANCELLED ||
      payment.status === PAYMENT_STATUS.REFUNDED
    ) {
      throw new Error("Payment cannot be cancelled");
    }

    await PaymentRepository.update(id, {
      status: PAYMENT_STATUS.CANCELLED,
    });

    await OrderRepository.update(payment.order_id, {
      status: ORDER_STATUS.CANCELLED,
      cancelled_at: new Date(),
    });

    return PaymentRepository.findById(id);
  }

  async refund(id) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    const order = await OrderRepository.findById(payment.order_id);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== ORDER_STATUS.COMPLETED) {
      throw new Error("Only completed orders can be refunded");
    }

    if (payment.status !== PAYMENT_STATUS.PAID) {
      throw new Error("Only paid payment can be refunded");
    }

    await PaymentRepository.update(id, {
      status: PAYMENT_STATUS.REFUNDED,
    });

    await OrderRepository.update(payment.order_id, {
      status: ORDER_STATUS.REFUNDED,
      refunded_at: new Date(),
    });

    return PaymentRepository.findById(id);
  }
  async updateStatus(id, status, payload = {}) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }
    if (!Object.values(PAYMENT_STATUS).includes(status)) {
      throw new Error("Invalid payment status");
    }
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return this.pay(id, payload);

      case PAYMENT_STATUS.EXPIRED:
        return this.expire(id);

      case PAYMENT_STATUS.CANCELLED:
        return this.cancel(id);

      case PAYMENT_STATUS.REFUNDED:
        return this.refund(id);

      case PAYMENT_STATUS.FAILED:
        await PaymentRepository.update(id, {
          status: PAYMENT_STATUS.FAILED,
          webhook_payload: payload.webhook_payload,
        });

        return PaymentRepository.findById(id);

      default:
        throw new Error("Invalid payment status");
    }
  }

  async handleWebhook(payload) {
    const payment = await PaymentRepository.findByTransactionId(
      payload.transaction_id,
    );

    if (!payment) {
      throw new Error("Payment not found");
    }
    const statusMap = {
      settlement: PAYMENT_STATUS.PAID,
      capture: PAYMENT_STATUS.PAID,
      pending: PAYMENT_STATUS.PENDING,
      expire: PAYMENT_STATUS.EXPIRED,
      cancel: PAYMENT_STATUS.CANCELLED,
      refund: PAYMENT_STATUS.REFUNDED,
      deny: PAYMENT_STATUS.FAILED,
    };

    const status = statusMap[payload.status] || payload.status;

    switch (status) {
      case PAYMENT_STATUS.PAID:
        return this.pay(payment.id, payload);

      case PAYMENT_STATUS.EXPIRED:
        return this.expire(payment.id);

      case PAYMENT_STATUS.CANCELLED:
        return this.cancel(payment.id);

      case PAYMENT_STATUS.REFUNDED:
        return this.refund(payment.id);

      case PAYMENT_STATUS.FAILED:
        return this.updateStatus(payment.id, PAYMENT_STATUS.FAILED, payload);

      default:
        return payment;
    }
  }

  async expirePendingPayments() {
    const payments = await PaymentRepository.findExpired();

    for (const payment of payments) {
      try {
        await this.expire(payment.id);
      } catch (err) {
        console.error(err);
      }
    }

    return payments.length;
  }
}

module.exports = new PaymentService();
