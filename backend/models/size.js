"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.ProductVariant, {
        foreignKey: "size_id",
        as: "variants",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  Size.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Size name is required",
          },
          len: {
            args: [1, 20],
            msg: "Size name must be between 1 and 20 characters",
          },
        },
      },

      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Sort order cannot be negative",
          },
        },
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
      modelName: "Size",
      tableName: "Sizes",
      timestamps: true,
      underscored: true,
    },
  );

  return Size;
};
