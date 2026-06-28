"use strict";

const { Model } = require("sequelize");

const VOUCHER_STATUS = require("../src/constants/voucherStatus");
const VOUCHER_TYPE = require("../src/constants/voucherType");

module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      // Reserved for future association
      // Voucher.hasMany(models.OrderVoucher)
    }
  }

  Voucher.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Voucher code is required",
          },
        },
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Voucher name is required",
          },
        },
      },

      type: {
        type: DataTypes.ENUM(VOUCHER_TYPE.PERCENTAGE, VOUCHER_TYPE.FIXED),
        allowNull: false,
      },

      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Voucher value must be greater than 0",
          },
          isInt: {
            msg: "Voucher value must be an integer",
          },
        },
      },

      min_purchase: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      max_discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      quota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
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

      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      status: {
        type: DataTypes.ENUM(VOUCHER_STATUS.ACTIVE, VOUCHER_STATUS.INACTIVE),
        allowNull: false,
        defaultValue: VOUCHER_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "Voucher",
      tableName: "Vouchers",
      timestamps: true,
      underscored: true,

      hooks: {
        beforeValidate(voucher) {
          if (voucher.code) {
            voucher.code = voucher.code.toUpperCase().trim();
          }
        },
      },
    },
  );

  return Voucher;
};
