"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ProductVariant.belongsTo(models.Color, {
        foreignKey: "color_id",
        as: "color",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ProductVariant.belongsTo(models.Size, {
        foreignKey: "size_id",
        as: "size",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ProductVariant.hasMany(models.CartItem, {
        foreignKey: "product_variant_id",
        as: "cartItems",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ProductVariant.hasMany(models.OrderItem, {
        foreignKey: "product_variant_id",
        as: "orderItems",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  ProductVariant.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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

      color_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Color is required",
          },
        },
      },

      size_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Size is required",
          },
        },
      },

      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "SKU is required",
          },
        },
      },

      barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Price cannot be negative",
          },
        },
      },

      discount_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "Discount price cannot be negative",
          },
        },
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Stock cannot be negative",
          },
        },
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

      length: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Length cannot be negative",
          },
        },
      },

      width: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Width cannot be negative",
          },
        },
      },

      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Height cannot be negative",
          },
        },
      },

      min_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: [1],
            msg: "Minimum order must be at least 1",
          },
        },
      },

      max_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "ProductVariant",
      tableName: "ProductVariants",
      timestamps: true,
    },
  );

  return ProductVariant;
};
