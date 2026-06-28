"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "review_id",
        as: "review",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  ReviewImage.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      review_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Review is required",
          },
        },
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Image is required",
          },
          isUrl: {
            msg: "Image must be a valid URL",
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
          isInt: {
            msg: "Sort order must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
      tableName: "ReviewImages",
      timestamps: true,
      underscored: true,
    },
  );

  return ReviewImage;
};
