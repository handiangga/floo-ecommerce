"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Address, {
        foreignKey: "customer_id",
        as: "addresses",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Customer.hasMany(models.Order, {
        foreignKey: "customer_id",
        as: "orders",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Customer.hasMany(models.Cart, {
        foreignKey: "customer_id",
        as: "carts",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Customer.hasMany(models.Wishlist, {
        foreignKey: "customer_id",
        as: "wishlists",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Customer.hasMany(models.Review, {
        foreignKey: "customer_id",
        as: "reviews",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  Customer.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required",
          },
          len: {
            args: [2, 100],
            msg: "Name must be between 2 and 100 characters",
          },
        },
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          isEmail(value) {
            if (!validator.isEmail(value)) {
              throw new Error("Invalid email");
            }
          },
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
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

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: "Password minimum 6 characters",
          },
        },
      },

      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: true,
      },

      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "Customers",
      timestamps: true,

      hooks: {
        async beforeCreate(customer) {
          customer.password = await bcrypt.hash(customer.password, 10);
        },

        async beforeUpdate(customer) {
          if (customer.changed("password")) {
            customer.password = await bcrypt.hash(customer.password, 10);
          }
        },
      },
    },
  );

  return Customer;
};
