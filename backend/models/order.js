"use strict";

const { Model } = require("sequelize");
const ORDER_STATUS = require("../src/constants/orderStatus");
const PAYMENT_METHOD = require("../src/constants/paymentMethod");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Order.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "address",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Order.hasOne(models.Payment, {
        foreignKey: "order_id",
        as: "payment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Order.hasOne(models.Shipment, {
        foreignKey: "order_id",
        as: "shipment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Order.belongsTo(models.Voucher, {
        foreignKey: "voucher_id",
        as: "voucher",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Customer is required",
          },
        },
      },

      address_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address is required",
          },
        },
      },

      invoice: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Invoice is required",
          },
        },
      },

      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Subtotal cannot be negative",
          },
        },
      },

      shipping_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Shipping cost cannot be negative",
          },
        },
      },

      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Discount cannot be negative",
          },
        },
      },

      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Total cannot be negative",
          },
        },
      },

      voucher_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      receiver_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Receiver name is required",
          },
        },
      },

      receiver_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Receiver phone is required",
          },
        },
      },

      province: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Province is required",
          },
        },
      },

      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is required",
          },
        },
      },

      district: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "District is required",
          },
        },
      },

      subdistrict: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Subdistrict is required",
          },
        },
      },

      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Postal code is required",
          },
          len: {
            args: [3, 10],
            msg: "Invalid postal code",
          },
        },
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Address is required",
          },
        },
      },

      shipping_method: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      courier_service: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          ORDER_STATUS.WAITING_PAYMENT,
          ORDER_STATUS.PAID,
          ORDER_STATUS.PROCESS,
          ORDER_STATUS.SHIPPED,
          ORDER_STATUS.COMPLETED,
          ORDER_STATUS.CANCELLED,
          ORDER_STATUS.EXPIRED,
          ORDER_STATUS.REFUNDED,
        ),
        allowNull: false,
        defaultValue: ORDER_STATUS.WAITING_PAYMENT,
      },

      payment_deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.ENUM(
          PAYMENT_METHOD.BANK_TRANSFER,
          PAYMENT_METHOD.QRIS,
          PAYMENT_METHOD.E_WALLET,
          PAYMENT_METHOD.CREDIT_CARD,
          PAYMENT_METHOD.COD,
        ),
        allowNull: true,
        validate: {
          isIn: {
            args: [
              [
                PAYMENT_METHOD.BANK_TRANSFER,
                PAYMENT_METHOD.QRIS,
                PAYMENT_METHOD.E_WALLET,
                PAYMENT_METHOD.CREDIT_CARD,
                PAYMENT_METHOD.COD,
              ],
            ],
            msg: "Invalid payment method",
          },
        },
      },

      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      refunded_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    },
  );

  return Order;
};
