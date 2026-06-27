"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.hasMany(models.ProductVariant, {
        foreignKey: "color_id",
        as: "variants",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Color.hasMany(models.ProductImage, {
        foreignKey: "color_id",
        as: "images",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  Color.init(
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
            msg: "Color name is required",
          },
          len: {
            args: [2, 50],
            msg: "Color name must be between 2 and 50 characters",
          },
        },
      },

      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Color code is required",
          },
          is: {
            args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            msg: "Invalid HEX color code",
          },
        },
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "Color",
      tableName: "Colors",
      timestamps: true,
      underscored: true,
    },
  );

  return Color;
};
