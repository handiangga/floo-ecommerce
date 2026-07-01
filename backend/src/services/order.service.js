"use strict";

const { sequelize } = require("../../models");

const OrderRepository = require("../repositories/order.repository");
const OrderItemRepository = require("../repositories/order-item.repository");
const CartRepository = require("../repositories/cart.repository");
const CartItemRepository = require("../repositories/cart-item.repository");
const ProductVariantRepository = require("../repositories/product-variant.repository");
const AddressRepository = require("../repositories/address.repository");
const VoucherRepository = require("../repositories/voucher.repository");

const PaginationHelper = require("../helpers/pagination.helper");
const InvoiceHelper = require("../helpers/invoice.helper");

const ORDER_STATUS = require("../constants/orderStatus");

class OrderService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await OrderRepository.findAll({
      limit,
      offset,
      customer_id: query.customer_id,
      status: query.status,
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
    const order = await OrderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async getMyOrders(customer_id) {
    return OrderRepository.findByCustomer(customer_id);
  }

  async checkout(customer_id, payload) {
    const transaction = await sequelize.transaction();

    try {
      const address = await AddressRepository.findById(payload.address_id);

      if (!address) {
        throw new Error("Address not found");
      }

      if (String(address.customer_id) !== String(customer_id)) {
        throw new Error("Address not belongs to customer");
      }

      let cart = await CartRepository.findByCustomer(customer_id);

      if (!cart) {
        throw new Error("Cart not found");
      }

      if (!cart.items || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let subtotal = 0;

      const orderItems = [];

      for (const item of cart.items) {
        const variant = await ProductVariantRepository.findById(
          item.product_variant_id,
        );

        if (!variant) {
          throw new Error("Product variant not found");
        }

        if (variant.stock < item.qty) {
          throw new Error(
            `${variant.product.name} (${variant.color.name}/${variant.size.name}) stock is insufficient`,
          );
        }

        const price = variant.discount_price || variant.price;

        const lineSubtotal = price * item.qty;

        subtotal += lineSubtotal;

        orderItems.push({
          product_variant_id: variant.id,
          sku: variant.sku,
          product_name: variant.product.name,
          color_name: variant.color.name,
          size_name: variant.size.name,
          price,
          qty: item.qty,
          subtotal: lineSubtotal,
        });
      }
      let discount = 0;
      let voucher = null;

      if (payload.voucher_code) {
        voucher = await VoucherRepository.findByCode(
          payload.voucher_code.trim().toUpperCase(),
        );

        if (!voucher) {
          throw new Error("Voucher not found");
        }

        if (voucher.status !== "ACTIVE") {
          throw new Error("Voucher is inactive");
        }

        const now = new Date();

        if (now < new Date(voucher.start_date)) {
          throw new Error("Voucher has not started");
        }

        if (now > new Date(voucher.end_date)) {
          throw new Error("Voucher has expired");
        }

        if (voucher.quota > 0 && voucher.used >= voucher.quota) {
          throw new Error("Voucher quota has been exhausted");
        }

        if (subtotal < voucher.min_purchase) {
          throw new Error(
            `Minimum purchase Rp ${voucher.min_purchase.toLocaleString(
              "id-ID",
            )}`,
          );
        }

        if (voucher.type === "PERCENTAGE") {
          discount = Math.floor((subtotal * voucher.value) / 100);

          if (voucher.max_discount && discount > voucher.max_discount) {
            discount = voucher.max_discount;
          }
        } else {
          discount = voucher.value;
        }

        if (discount > subtotal) {
          discount = subtotal;
        }
      }

      if (!payload.payment_method) {
        throw new Error("Payment method is required");
      }
      const shippingCost = Number(payload.shipping_cost || 0);

      if (shippingCost < 0) {
        throw new Error("Invalid shipping cost");
      }

      const total = subtotal + shippingCost - discount;

      let invoice;

      do {
        invoice = InvoiceHelper.generate();
      } while (await OrderRepository.findByInvoice(invoice));

      const paymentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const order = await OrderRepository.create(
        {
          customer_id,

          address_id: address.id,

          invoice,

          subtotal,

          shipping_cost: shippingCost,

          discount,

          total,

          voucher_id: voucher ? voucher.id : null,

          receiver_name: address.receiver_name,

          receiver_phone: address.phone,

          province: address.province,

          city: address.city,

          district: address.district,

          subdistrict: address.subdistrict,

          postal_code: address.postal_code,

          address: address.address,

          shipping_method: payload.shipping_method,

          courier_service: payload.courier_service,

          payment_method: payload.payment_method,

          payment_deadline: paymentDeadline,

          notes: payload.notes,

          status: ORDER_STATUS.WAITING_PAYMENT,
        },
        transaction,
      );

      const items = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      await OrderItemRepository.bulkCreate(items, transaction);

      for (const item of orderItems) {
        const variant = await ProductVariantRepository.findById(
          item.product_variant_id,
        );

        await ProductVariantRepository.update(
          variant.id,
          {
            stock: variant.stock - item.qty,
          },
          transaction,
        );
      }

      if (voucher) {
        await VoucherRepository.update(
          voucher.id,
          {
            used: voucher.used + 1,
          },
          transaction,
        );
      }

      await CartItemRepository.clear(cart.id, transaction);

      await transaction.commit();

      return await OrderRepository.findById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async cancel(id) {
    const order = await OrderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }
    if (
      order.status === ORDER_STATUS.CANCELLED ||
      order.status === ORDER_STATUS.COMPLETED
    ) {
      throw new Error("Order cannot be cancelled");
    }
    if (order.status !== ORDER_STATUS.WAITING_PAYMENT) {
      throw new Error("Order cannot be cancelled");
    }

    for (const item of order.items) {
      const variant = await ProductVariantRepository.findById(
        item.product_variant_id,
      );

      await ProductVariantRepository.update(variant.id, {
        stock: variant.stock + item.qty,
      });
    }

    if (order.voucher_id) {
      const voucher = await VoucherRepository.findById(order.voucher_id);

      if (voucher && voucher.used > 0) {
        await VoucherRepository.update(voucher.id, {
          used: voucher.used - 1,
        });
      }
    }

    return OrderRepository.update(id, {
      status: ORDER_STATUS.CANCELLED,
      cancelled_at: new Date(),
    });
  }

  async updateStatus(id, status) {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new Error("Invalid order status");
    }

    const order = await OrderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    const payload = {
      status,
    };

    switch (status) {
      case ORDER_STATUS.PAID:
        payload.paid_at = new Date();
        break;

      case ORDER_STATUS.COMPLETED:
        payload.completed_at = new Date();
        break;

      case ORDER_STATUS.REFUNDED:
        payload.refunded_at = new Date();
        break;

      case ORDER_STATUS.CANCELLED:
        payload.cancelled_at = new Date();
        break;
    }

    return OrderRepository.update(id, payload);
  }
}

module.exports = new OrderService();
