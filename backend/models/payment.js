"use strict";

const { Model } = require("sequelize");

const PAYMENT_STATUS = require("../src/constants/paymentStatus");
const PAYMENT_METHOD = require("../src/constants/paymentMethod");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Order is required",
          },
        },
      },

      method: {
        type: DataTypes.ENUM(
          PAYMENT_METHOD.BANK_TRANSFER,
          PAYMENT_METHOD.QRIS,
          PAYMENT_METHOD.E_WALLET,
          PAYMENT_METHOD.CREDIT_CARD,
          PAYMENT_METHOD.COD,
        ),
        allowNull: false,
      },

      provider: {
        type: DataTypes.ENUM("MIDTRANS", "XENDIT", "MANUAL"),
        allowNull: false,
        defaultValue: "MIDTRANS",
      },

      transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
          len: {
            args: [1, 100],
            msg: "Invalid transaction id",
          },
        },
      },

      snap_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      payment_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      webhook_payload: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      proof_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      proof_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      proof_submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verification_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          PAYMENT_STATUS.PENDING,
          PAYMENT_STATUS.PAID,
          PAYMENT_STATUS.FAILED,
          PAYMENT_STATUS.EXPIRED,
          PAYMENT_STATUS.CANCELLED,
          PAYMENT_STATUS.REFUNDED,
        ),
        allowNull: false,
        defaultValue: PAYMENT_STATUS.PENDING,
      },

      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Amount cannot be negative",
          },
          isInt: {
            msg: "Amount must be an integer",
          },
        },
      },
      payment_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: {
            args: [1, 100],
            msg: "Invalid payment code",
          },
        },
      },
      verified_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failed_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    },
  );

  return Payment;
};
