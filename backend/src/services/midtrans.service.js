"use strict";

const midtransClient = require("midtrans-client");

class MidtransService {
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    this.core = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  /**
   * ============================================================
   * CREATE SNAP TOKEN
   * ============================================================
   */

  async createSnap(order, customer) {
    const parameter = {
      transaction_details: {
        order_id: String(order.code || order.id),
        gross_amount: Number(order.total),
      },

      customer_details: {
        first_name: customer?.name || "Customer",
        email: customer?.email || "",
        phone: customer?.phone || "",
      },

      item_details:
        order.items?.map((item) => ({
          id: String(item.product_variant_id),
          price: Number(item.price),
          quantity: Number(item.quantity),
          name: item.product_name || item.name,
        })) || [],

      expiry: {
        unit: "hours",
        duration: 24,
      },
    };

    return this.snap.createTransaction(parameter);
  }

  /**
   * ============================================================
   * GET STATUS
   * ============================================================
   */

  async getStatus(transactionId) {
    return this.core.transaction.status(transactionId);
  }

  /**
   * ============================================================
   * CANCEL
   * ============================================================
   */

  async cancel(transactionId) {
    return this.core.transaction.cancel(transactionId);
  }

  /**
   * ============================================================
   * EXPIRE
   * ============================================================
   */

  async expire(transactionId) {
    return this.core.transaction.expire(transactionId);
  }

  /**
   * ============================================================
   * REFUND
   * ============================================================
   */

  async refund(transactionId, amount, reason = "Refund") {
    return this.core.transaction.refund(transactionId, {
      refund_key: `refund-${Date.now()}`,
      amount,
      reason,
    });
  }

  /**
   * ============================================================
   * VERIFY SIGNATURE
   * ============================================================
   */

  verifySignature(payload) {
    const crypto = require("crypto");

    const hash = crypto
      .createHash("sha512")
      .update(
        payload.order_id +
          payload.status_code +
          payload.gross_amount +
          process.env.MIDTRANS_SERVER_KEY,
      )
      .digest("hex");

    return hash === payload.signature_key;
  }
}

module.exports = new MidtransService();
