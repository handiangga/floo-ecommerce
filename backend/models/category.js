"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
        as: "products",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
      Category.belongsTo(models.Category, { foreignKey: "parent_id", as: "parent" });
      Category.hasMany(models.Category, { foreignKey: "parent_id", as: "subcategories", onUpdate: "CASCADE", onDelete: "RESTRICT" });
    }
  }

  Category.init(
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
            msg: "Category name is required",
          },
          len: {
            args: [2, 100],
            msg: "Category name must be between 2 and 100 characters",
          },
        },
      },

      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Slug is required",
          },
        },
      },

      parent_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      banner: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
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
        },
      },

      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "Category",
      tableName: "Categories",
      timestamps: true,

      hooks: {
        beforeValidate(category) {
          if (category.name && !category.slug) {
            category.slug = slugify(category.name, {
              lower: true,
              strict: true,
              trim: true,
            });
          }
        },
      },
    },
  );

  return Category;
};
