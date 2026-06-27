"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

  User.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role is required",
          },
        },
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

      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      last_login: {
        type: DataTypes.DATE,
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
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      underscored: true,

      hooks: {
        async beforeCreate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },

        async beforeUpdate(user) {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  return User;
};
