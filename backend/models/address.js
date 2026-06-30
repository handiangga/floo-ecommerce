"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Address.init(
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

      receiver_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Receiver name is required",
          },
          len: {
            args: [2, 100],
            msg: "Receiver name must be between 2 and 100 characters",
          },
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Phone is required",
          },
          len: {
            args: [8, 20],
            msg: "Invalid phone number",
          },
        },
      },

      label: {
        type: DataTypes.ENUM("HOME", "OFFICE", "OTHER"),
        allowNull: false,
        defaultValue: "HOME",
        validate: {
          isIn: {
            args: [["HOME", "OFFICE", "OTHER"]],
            msg: "Invalid label",
          },
        },
      },

      province: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Province is required",
          },
        },
      },

      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is required",
          },
        },
      },

      district: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "District is required",
          },
        },
      },

      subdistrict: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Subdistrict is required",
          },
        },
      },

      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: {
            args: [3, 10],
            msg: "Invalid postal code",
          },
        },
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Address is required",
          },
        },
      },

      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },

      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
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

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
      timestamps: true,
    },
  );

  return Address;
};
