"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        as: "items",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Cart.init(
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
        unique: true,
        validate: {
          notNull: {
            msg: "Customer is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "Carts",
      timestamps: true,
    },
  );

  return Cart;
};
