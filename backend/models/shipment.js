"use strict";

const { Model } = require("sequelize");

const SHIPMENT_STATUS = require("../src/constants/shipmentStatus");

module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    static associate(models) {
      Shipment.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Shipment.init(
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

      courier: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Courier is required",
          },
        },
      },

      service: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Service is required",
          },
        },
      },

      tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },

      shipping_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Shipping cost must be greater than or equal to 0",
          },
          isInt: {
            msg: "Shipping cost must be an integer",
          },
        },
      },

      status: {
        type: DataTypes.ENUM(
          SHIPMENT_STATUS.PENDING,
          SHIPMENT_STATUS.PICKED,
          SHIPMENT_STATUS.SHIPPED,
          SHIPMENT_STATUS.DELIVERED,
          SHIPMENT_STATUS.RETURNED,
        ),
        allowNull: false,
        defaultValue: SHIPMENT_STATUS.PENDING,
      },

      shipped_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delivered_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Shipment",
      tableName: "Shipments",
      timestamps: true,
    },
  );

  return Shipment;
};
