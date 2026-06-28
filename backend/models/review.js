"use strict";

const { Model } = require("sequelize");

const REVIEW_STATUS = require("../src/constants/reviewStatus");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Review.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Review.belongsTo(models.OrderItem, {
        foreignKey: "order_item_id",
        as: "order_item",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: "review_id",
        as: "images",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Review.init(
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
      },

      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      order_item_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },

      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Minimum rating is 1",
          },
          max: {
            args: [5],
            msg: "Maximum rating is 5",
          },
          isInt: {
            msg: "Rating must be an integer",
          },
        },
      },

      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          REVIEW_STATUS.PENDING,
          REVIEW_STATUS.APPROVED,
          REVIEW_STATUS.REJECTED,
        ),
        allowNull: false,
        defaultValue: REVIEW_STATUS.PENDING,
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
      timestamps: true,
    },
  );

  return Review;
};
