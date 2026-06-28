"use strict";

const { Model } = require("sequelize");

const BANNER_STATUS = require("../src/constants/bannerStatus");

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate(models) {
      // Banner tidak memiliki relasi
    }
  }

  Banner.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
          len: {
            args: [3, 150],
            msg: "Title must be between 3 and 150 characters",
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

      link: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Link must be a valid URL",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      button_text: {
        type: DataTypes.STRING(50),
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
          isInt: {
            msg: "Sort order must be an integer",
          },
        },
      },

      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: DataTypes.ENUM(BANNER_STATUS.ACTIVE, BANNER_STATUS.INACTIVE),
        allowNull: false,
        defaultValue: BANNER_STATUS.ACTIVE,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterStartDate(value) {
            if (
              value &&
              this.start_date &&
              new Date(value) < new Date(this.start_date)
            ) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Banner",
      tableName: "Banners",
      timestamps: true,
    },
  );

  return Banner;
};
