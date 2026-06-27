"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ProductImage.belongsTo(models.Color, {
        foreignKey: "color_id",
        as: "color",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  ProductImage.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product is required",
          },
        },
      },

      color_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Image is required",
          },
        },
      },

      alt: {
        type: DataTypes.STRING(255),
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
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "ProductImages",
      timestamps: true,
      underscored: true,
    },
  );

  return ProductImage;
};
