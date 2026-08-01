"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.ProductVariant, {
        foreignKey: "product_id",
        as: "variants",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.Review, {
        foreignKey: "product_id",
        as: "reviews",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: "product_id",
        as: "wishlists",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Category is required",
          },
        },
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product name is required",
          },
          len: {
            args: [2, 150],
            msg: "Product name must be between 2 and 150 characters",
          },
        },
      },

      slug: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Slug is required",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      material: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      brand: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Floo Fashionn",
      },

      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Weight cannot be negative",
          },
        },
      },

      is_ready_stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      is_preorder: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      preorder_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Preorder days cannot be negative",
          },
        },
      },

      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_best_seller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      is_new_arrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      sold_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

      seo_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      seo_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
    },
  );

  return Product;
};
