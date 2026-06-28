"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Wishlist.init(
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

      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "Wishlists",
      timestamps: true,
    },
  );

  return Wishlist;
};
