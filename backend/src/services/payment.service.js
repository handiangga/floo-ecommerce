"use strict";

const MidtransService = require("./midtrans.service");
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

    const existing = await PaymentRepository.findByOrder(order.id);

    if (existing) {
      throw new Error("Payment already exists");
    }

    const snap = await MidtransService.createSnap(order, order.customer || {});

    const payment = await PaymentRepository.create(
      {
        order_id: order.id,
        method: payload.method,
        provider: "MIDTRANS",

        amount: order.total,

        transaction_id: String(order.code || order.id),

        snap_token: snap.token,

        payment_url: snap.redirect_url,

        expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),

        status: PAYMENT_STATUS.PENDING,

        notes: payload.notes,
      },
      transaction,
    );

    await OrderRepository.update(
      order.id,
      {
        payment_method: payload.method,
      },
      transaction,
    );

    return PaymentRepository.findById(payment.id);
  }

  async pay(id, payload = {}) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === PAYMENT_STATUS.PAID) {
      return payment;
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
      provider: "MIDTRANS",

      paid_at: payload.paid_at || new Date(),
      verified_at: new Date(),

      transaction_id: payload.transaction_id || payment.transaction_id,

      payment_code:
        payload.va_numbers?.[0]?.va_number ||
        payload.bill_key ||
        payload.payment_code ||
        payment.payment_code,

      snap_token: payload.snap_token || payment.snap_token,

      payment_url: payload.payment_url || payment.payment_url,

      webhook_payload: payload,
    });

    await OrderRepository.update(payment.order_id, {
      status: ORDER_STATUS.PAID,
      paid_at: payload.paid_at || new Date(),
    });

    return PaymentRepository.findById(id);
  }

  async createSnap(order_id) {
    const payment = await PaymentRepository.findByOrder(order_id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.snap_token && payment.status === PAYMENT_STATUS.PENDING) {
      return payment;
    }

    const order = payment.order;

    const snap = await MidtransService.createSnap(order, order.customer || {});

    await PaymentRepository.update(payment.id, {
      snap_token: snap.token,
      payment_url: snap.redirect_url,
    });

    return PaymentRepository.findById(payment.id);
  }

  async checkStatus(order_id) {
    const payment = await PaymentRepository.findByOrder(order_id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    const result = await MidtransService.getStatus(payment.transaction_id);

    await this.handleWebhook(result, false);

    return PaymentRepository.findById(payment.id);
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
    if (payment.status === PAYMENT_STATUS.REFUNDED) {
      return payment;
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
  async updateStatus(id, payload = {}) {
    const { status } = payload;
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
          failed_reason:
            payload.failed_reason || payload.status_message || null,
        });

        return PaymentRepository.findById(id);

      default:
        throw new Error("Invalid payment status");
    }
  }

  async handleWebhook(payload, verifySignature = true) {
    if (verifySignature && !MidtransService.verifySignature(payload)) {
      throw new Error("Invalid Midtrans signature");
    }

    // order_id yang dikirim Midtrans = transaction_id yang kita simpan
    const payment = await PaymentRepository.findByTransactionId(
      payload.order_id,
    );

    if (!payment) {
      throw new Error("Payment not found");
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    // Simpan payload webhook terlebih dahulu
    await PaymentRepository.update(payment.id, {
      webhook_payload: payload,
    });

    switch (transactionStatus) {
      case "capture":
        // Credit Card
        if (fraudStatus === "challenge") {
          return PaymentRepository.findById(payment.id);
        }

        return this.pay(payment.id, {
          ...payload,
          status: PAYMENT_STATUS.PAID,
        });

      case "settlement":
        return this.pay(payment.id, {
          ...payload,
          status: PAYMENT_STATUS.PAID,
        });

      case "pending":
        await PaymentRepository.update(payment.id, {
          status: PAYMENT_STATUS.PENDING,
          webhook_payload: payload,
          payment_code:
            payload.va_numbers?.[0]?.va_number ||
            payload.bill_key ||
            payment.payment_code,
        });

        return PaymentRepository.findById(payment.id);

      case "expire":
        return this.expire(payment.id);

      case "cancel":
        return this.cancel(payment.id);

      case "deny":
        return this.updateStatus(payment.id, {
          ...payload,
          status: PAYMENT_STATUS.FAILED,
          failed_reason: payload.status_message,
        });

      case "refund":
      case "partial_refund":
        return this.refund(payment.id);

      case "authorize":
        await PaymentRepository.update(payment.id, {
          status: PAYMENT_STATUS.PENDING,
          webhook_payload: payload,
        });

        return PaymentRepository.findById(payment.id);

      default:
        await PaymentRepository.update(payment.id, {
          webhook_payload: payload,
        });

        return PaymentRepository.findById(payment.id);
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
