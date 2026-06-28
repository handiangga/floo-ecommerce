"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: "role_id",
        as: "users",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Role name is required",
          },
          len: {
            args: [2, 50],
            msg: "Role name must be between 2 and 50 characters",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
        validate: {
          isIn: {
            args: [["ACTIVE", "INACTIVE"]],
            msg: "Invalid status",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
      timestamps: true,
    },
  );

  return Role;
};
