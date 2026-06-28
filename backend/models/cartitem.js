"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      CartItem.belongsTo(models.ProductVariant, {
        foreignKey: "product_variant_id",
        as: "variant",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      cart_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Cart is required",
          },
        },
      },

      product_variant_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product variant is required",
          },
        },
      },

      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: [1],
            msg: "Minimum quantity is 1",
          },
          isInt: {
            msg: "Quantity must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "CartItems",
      timestamps: true,
      underscored: true,
    },
  );

  return CartItem;
};
