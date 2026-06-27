"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductVariants", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      color_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Colors",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      size_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Sizes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      discount_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      length: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },

      width: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },

      height: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },

      min_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      max_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      is_ready_stock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      is_preorder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      preorder_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // ===========================
    // UNIQUE
    // ===========================

    await queryInterface.addConstraint("ProductVariants", {
      fields: ["sku"],
      type: "unique",
      name: "product_variants_sku_unique",
    });

    await queryInterface.addConstraint("ProductVariants", {
      fields: ["product_id", "color_id", "size_id"],
      type: "unique",
      name: "product_variants_product_color_size_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("ProductVariants", ["product_id"], {
      name: "product_variants_product_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["color_id"], {
      name: "product_variants_color_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["size_id"], {
      name: "product_variants_size_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["sku"], {
      name: "product_variants_sku_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["status"], {
      name: "product_variants_status_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["stock"], {
      name: "product_variants_stock_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["price"], {
      name: "product_variants_price_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["is_ready_stock"], {
      name: "product_variants_ready_stock_idx",
    });

    await queryInterface.addIndex("ProductVariants", ["product_id", "status"], {
      name: "product_variants_product_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ProductVariants");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_ProductVariants_status";',
    );
  },
};
