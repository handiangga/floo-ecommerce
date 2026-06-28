"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      ActivityLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  ActivityLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User is required",
          },
        },
      },

      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Action is required",
          },
        },
      },

      module: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Module is required",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ActivityLog",
      tableName: "ActivityLogs",
      timestamps: true,
    },
  );

  return ActivityLog;
};
