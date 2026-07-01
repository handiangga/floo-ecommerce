"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      OrderItem.belongsTo(models.ProductVariant, {
        foreignKey: "product_variant_id",
        as: "variant",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  OrderItem.init(
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
        validate: {
          notNull: {
            msg: "Order is required",
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

      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "SKU is required",
          },
        },
      },

      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product name is required",
          },
        },
      },

      product_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      color_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Color name is required",
          },
        },
      },

      size_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Size name is required",
          },
        },
      },

      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Weight cannot be negative",
          },
        },
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Price cannot be negative",
          },
          isInt: {
            msg: "Price must be an integer",
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

      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Subtotal cannot be negative",
          },
          isInt: {
            msg: "Subtotal must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
      timestamps: true,

      hooks: {
        beforeValidate(orderItem) {
          if (
            orderItem.price != null &&
            orderItem.qty != null &&
            (!orderItem.subtotal || orderItem.subtotal === 0)
          ) {
            orderItem.subtotal = orderItem.price * orderItem.qty;
          }
        },
      },
    },
  );

  return OrderItem;
};
