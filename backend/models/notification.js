"use strict";

const { Model } = require("sequelize");

const NOTIFICATION_TYPE = require("../src/constants/notificationType");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Notification.init(
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

      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
        },
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Message is required",
          },
        },
      },

      type: {
        type: DataTypes.ENUM(
          NOTIFICATION_TYPE.ORDER,
          NOTIFICATION_TYPE.PAYMENT,
          NOTIFICATION_TYPE.PROMOTION,
          NOTIFICATION_TYPE.SYSTEM,
        ),
        allowNull: false,
        defaultValue: NOTIFICATION_TYPE.SYSTEM,
      },

      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
      timestamps: true,
    },
  );

  return Notification;
};
