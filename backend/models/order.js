"use strict";

const { Model } = require("sequelize");
const ORDER_STATUS = require("../src/constants/orderStatus");

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
          min: 0,
        },
      },

      shipping_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      status: {
        type: DataTypes.ENUM(
          ORDER_STATUS.PENDING,
          ORDER_STATUS.PROCESS,
          ORDER_STATUS.SHIPPED,
          ORDER_STATUS.COMPLETED,
          ORDER_STATUS.CANCELLED,
        ),
        allowNull: false,
        defaultValue: ORDER_STATUS.PENDING,
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
      underscored: true,
    },
  );

  return Order;
};
